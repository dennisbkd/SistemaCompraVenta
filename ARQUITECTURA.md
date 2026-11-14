# Arquitectura y tecnologías

Propuesta para la primera versión del sistema descrito en [REQUISITOS.md](REQUISITOS.md). Versión 1 — 14/11/2026.

Criterios con los que se eligió todo:

1. **Un solo lenguaje.** TypeScript en frontend, backend y reglas de negocio.
2. **Costo cero al inicio**, sin tarjeta de crédito donde sea posible.
3. **Migrar sin reescribir.** Todo lo gratuito se apoya en estándares (PostgreSQL, Node, archivos estáticos), así que cambiar de proveedor es cambiar variables de entorno, no código.
4. **Poco DevOps.** Nada de servidores propios, Kubernetes ni Docker en producción. Los proveedores despliegan solos desde GitHub.

## 1. Vista general

```
 Celular / PC (navegador)
        │
        ▼
 ┌──────────────────┐        ┌───────────────────┐
 │ Web (React SPA)  │──────▶ │ API (NestJS)      │
 │ Cloudflare Pages │  HTTPS │ Render            │
 └──────────────────┘  JSON  └───────┬───────────┘
        │                            │
        │ sube fotos directo         ▼
        ▼                    ┌───────────────────┐
 ┌──────────────────┐        │ PostgreSQL (Neon) │
 │ Cloudinary       │        └───────────────────┘
 └──────────────────┘
```

Es un **monolito modular**: una sola API, una sola base de datos, dividida por dentro en módulos. Es la arquitectura correcta para un desarrollador y un primer cliente. Microservicios, colas y caché no hacen falta y solo frenarían.

## 2. Tecnologías

| Parte | Elección | Por qué |
|---|---|---|
| Repositorio | Monorepo con **pnpm workspaces** | Frontend y backend comparten tipos y reglas de negocio |
| Backend | **NestJS** | Es lo que estás aprendiendo; su estructura de módulos calza con el dominio |
| Base de datos | **PostgreSQL** | Datos relacionales y dinero: se necesitan transacciones |
| ORM | **Prisma** | Tipos automáticos, migraciones simples, curva de aprendizaje baja |
| Validación | **Zod**, en el paquete compartido | El mismo esquema valida el formulario y la API |
| Autenticación | Propia: **JWT** (acceso corto + refresh en cookie httpOnly), contraseñas con **argon2** | Se aprende, no depende de un proveedor y un solo usuario por cuenta lo hace simple |
| Frontend | **React + Vite + TypeScript** | Ya lo conoces. No hace falta Next.js: la app es privada, no necesita SEO |
| Datos en el frontend | **TanStack Query** | Caché, recarga y estados de carga resueltos |
| Formularios | **React Hook Form + Zod** | |
| Estilos | **Tailwind CSS + shadcn/ui** | Componentes listos y pensados para celular |
| Fotos | **Cloudinary** | Gratis sin tarjeta, y reduce el tamaño de las fotos del celular |
| PDF | **pdfmake**, generado en el navegador | No carga al servidor gratuito |
| Tests | **Jest** (API y dominio), **Supertest** (e2e de la API), **Vitest + Testing Library** (web), **Playwright** al final | |
| CI | **GitHub Actions** | Gratis; corre lint, tipos, tests y build en cada PR |
| Errores | **Sentry** | Avisa cuando algo falla en producción |

### Hosting gratuito

| Servicio | Uso | Límite a tener en cuenta | A dónde migrar |
|---|---|---|---|
| **Neon** | PostgreSQL | Almacenamiento reducido (≈0,5 GB) y la base se "duerme" sin uso | Plan pago de Neon, o cualquier PostgreSQL |
| **Render** | API NestJS | Se duerme tras ~15 min sin uso; la primera petición tarda hasta ~1 min | Plan pago de Render (≈7 USD/mes) o Railway/Fly |
| **Cloudflare Pages** | Web | Prácticamente ninguno. Permite uso comercial | No hace falta |
| **Cloudinary** | Fotos | Cuota mensual de créditos | Cloudflare R2 o plan pago |

Notas:

- Los límites de los planes gratuitos cambian seguido. Hay que revisarlos en la página de cada proveedor al crear las cuentas.
- No uses Vercel para la web: su plan gratuito prohíbe el uso comercial.
- No uses la base de datos gratuita de Render: caduca a los pocos días.
- El "despertar" lento de Render es el único costo real del plan gratuito. Es aceptable para pulir con el cliente de prueba; cuando moleste, es el primer servicio a pagar.

## 3. Estructura del repositorio

```
SistemaCompraVenta/
├── apps/
│   ├── api/                 NestJS
│   │   ├── prisma/          schema.prisma y migraciones
│   │   ├── src/
│   │   │   ├── auth/
│   │   │   ├── cuentas/
│   │   │   ├── categorias/
│   │   │   ├── contactos/
│   │   │   ├── articulos/
│   │   │   ├── fotos/
│   │   │   ├── gastos/
│   │   │   ├── ventas/
│   │   │   ├── deudas/
│   │   │   ├── socios/
│   │   │   ├── reportes/
│   │   │   └── comun/       guards, decoradores, filtros, Prisma
│   │   └── test/            pruebas e2e
│   └── web/                 React + Vite
│       └── src/
│           ├── paginas/
│           ├── componentes/
│           └── api/         cliente HTTP y hooks de TanStack Query
├── packages/
│   └── dominio/             reglas de negocio puras + esquemas Zod
├── docker-compose.yml       solo PostgreSQL para desarrollo local
└── .github/workflows/       CI
```

## 4. Diseño del backend

### Capas

Cada módulo de NestJS tiene tres piezas:

- **Controlador:** recibe la petición, valida con Zod y responde. No decide nada.
- **Servicio:** orquesta. Lee de la base, llama a las funciones de dominio, guarda dentro de una transacción.
- **Dominio** (`packages/dominio`): funciones puras, sin base de datos ni NestJS. Reciben datos y devuelven resultados.

No hace falta arquitectura hexagonal completa ni repositorios abstractos. La única regla estricta es: **ningún cálculo de dinero vive en un controlador, un servicio o un componente de React.**

### El paquete de dominio

Aquí están las fórmulas de la sección 4 de los requisitos:

- `calcularCostoTotal`, `calcularGanancia`, `calcularMargen`, `calcularGananciaEstimada`
- `calcularVenta` (fórmula de la permuta y comisión)
- `generarPlanDeCuotas`, `aplicarPago`, `calcularSaldo`
- `liquidarSocios`
- `calcularCadenaDePermutas`

Ventajas:

- **Es donde se hace TDD de verdad.** Son funciones puras: los ejemplos 1 y 2 de los requisitos se convierten tal cual en los primeros tests.
- **Lo usa también la web.** La pantalla *Vender* muestra la ganancia antes de confirmar usando la misma función que luego usa la API. No hay dos versiones de la fórmula.

### Dinero

Los montos se guardan y se calculan como **enteros en centavos** (Bs 5.000,50 → `500050`). Así no hay errores de redondeo de decimales. Solo se formatea a "Bs 5.000,50" al mostrar. Los porcentajes se guardan en centésimas (12,5 % → `1250`).

### Separación entre clientes del SaaS (multi-tenant)

- Una sola base de datos; todas las tablas llevan `cuenta_id`.
- El `cuenta_id` viaja dentro del JWT. **Nunca** se acepta desde el cuerpo o la URL de una petición.
- Un guard global exige sesión en todo, salvo login y registro. Un decorador `@CuentaActual()` entrega el `cuenta_id` al controlador.
- Todo servicio recibe `cuentaId` como primer parámetro y lo usa en cada consulta.
- Una prueba e2e por módulo comprueba que la cuenta A no puede leer ni modificar datos de la cuenta B. Esta prueba es obligatoria en la definición de terminado.

Más adelante, con más clientes, se puede añadir Row Level Security de PostgreSQL como segunda barrera.

### Operaciones con varias escrituras

Registrar una venta toca varias tablas (venta, artículo, artículos recibidos, deuda, cuotas). Todo va en una sola transacción de Prisma: o se guarda completo o no se guarda nada.

### Fotos

1. La web pide a la API una firma de subida.
2. La web sube la foto directo a Cloudinary.
3. La web envía a la API la URL resultante, que se guarda en `foto`.

Las fotos no pasan por el servidor gratuito. El acceso a Cloudinary queda detrás de una interfaz `AlmacenDeFotos`, para poder cambiar de proveedor.

## 5. Ajustes al modelo de datos

Cambios respecto a la sección 6 de los requisitos, necesarios para implementar:

| Tabla | Cambio | Motivo |
|---|---|---|
| Todas | `id` (UUID), `creado_en`, `actualizado_en` | Estándar |
| `usuario` | Correo único en todo el sistema | Login sin pedir la cuenta |
| `deuda` | `interes` es el **monto total** de interés pactado | Sirve tanto si el cliente lo acuerda como monto fijo o como porcentaje (se guarda el resultado, igual que la comisión) |
| `pago` | Añadir `monto_capital` y `monto_interes` | Permite contar el interés como ganancia "a medida que se cobra" |
| `cuota` | Añadir `estado` calculado, no guardado | Se deduce de los pagos |
| `gasto` | `pagado_por` es nulo (el dueño) o un `contacto` | |
| `articulo` | `venta_origen_id` nulo salvo en permutas | Permite recorrer la cadena |

El reparto de cada pago entre capital e interés depende de los pendientes de la sección 8 de los requisitos. **Hay que confirmarlos con el cliente antes del sprint 5.**

## 6. Forma de trabajo

### Gitflow

| Rama | Uso |
|---|---|
| `main` | Lo que está en producción. Cada merge lleva una etiqueta de versión (`v0.1.0`) |
| `develop` | Integración. De aquí salen y aquí vuelven las funcionalidades |
| `feature/SCV-12-registro-de-gasto` | Una por tarea de Jira. Sale de `develop` |
| `release/0.3.0` | Al cerrar un sprint: últimas correcciones, luego merge a `main` y a `develop` |
| `hotfix/SCV-40-...` | Arreglo urgente. Sale de `main`, vuelve a `main` y a `develop` |

- Aunque trabajes solo, cada `feature` entra a `develop` por un **Pull Request**: ahí corre el CI y queda el historial.
- `main` y `develop` protegidas: no se puede hacer push directo y el CI debe pasar.
- Commits con el formato `SCV-12 feat: registrar gasto`. Con la clave al inicio, Jira enlaza el commit y el PR con la tarea.
- La rama actual `test` se puede renombrar a `develop`.

Gitflow es más ceremonia de la que necesita una persona sola; se adopta aquí porque el objetivo es aprenderlo.

### TDD

Ciclo: test que falla → código mínimo para que pase → ordenar.

| Qué | Cómo se prueba | ¿TDD estricto? |
|---|---|---|
| `packages/dominio` | Tests unitarios | **Sí, siempre.** Primero el test |
| Servicios y controladores de la API | Tests e2e con Supertest contra un PostgreSQL real de pruebas | Sí en el caso principal y en el aislamiento entre cuentas |
| Componentes de React | Vitest + Testing Library, solo donde hay lógica (formulario de venta, gasto rápido) | No. Se prueba después |
| Flujo completo | Playwright: comprar → gastar → vender | Al final |

### Jira

- Proyecto Scrum, clave **SCV**. Sprints de 2 semanas.
- Las épicas y las tareas están en [BACKLOG.md](BACKLOG.md).
- Flujo del tablero: Por hacer → En curso → En revisión (PR abierto) → Hecho.
- Conectar Jira con GitHub para ver ramas y PR dentro de cada tarea.

### Definición de terminado

Una tarea está terminada cuando:

1. cumple sus criterios de aceptación,
2. tiene tests y pasan,
3. el CI pasa,
4. el PR está fusionado en `develop`,
5. si toca datos, tiene su prueba de aislamiento entre cuentas.

## 7. Entornos

| Entorno | Web | API | Base de datos |
|---|---|---|---|
| Local | `localhost:5173` | `localhost:3000` | PostgreSQL en Docker |
| Producción | Cloudflare Pages (desde `main`) | Render (desde `main`) | Neon, rama principal |

Un entorno intermedio de pruebas no es necesario todavía. Cuando haga falta, Neon permite crear una rama de la base y Cloudflare Pages genera una vista previa por cada rama.

Las claves y secretos van en variables de entorno de cada proveedor, nunca en el repositorio. El repositorio lleva un `.env.example` sin valores reales.

## 8. Qué queda fuera a propósito

- Docker en producción, Kubernetes, Terraform.
- Microservicios, colas, Redis.
- Row Level Security.
- App nativa. La web se podrá instalar en el celular como PWA.
- Modo sin conexión (los requisitos lo excluyen).
