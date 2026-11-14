# Backlog por sprints

Tareas para cargar en Jira (proyecto **SCV**). Se apoya en [REQUISITOS.md](REQUISITOS.md) y [ARQUITECTURA.md](ARQUITECTURA.md). Versión 1 — 14/11/2026.

## Cómo leerlo

- **Sprints de 2 semanas.** Son 9 sprints: unas 18 semanas si el ritmo acompaña.
- **Puntos (pts):** tamaño relativo. 1 = un rato, 2 = medio día, 3 = un día, 5 = dos o tres días, 8 = casi una semana.
- La carga por sprint es una estimación. Después del sprint 1 ya sabrás cuántos puntos terminas de verdad; ajusta los siguientes con ese número.
- Los números `SCV-n` son de referencia. En Jira (proyecto PuntoTrato, clave `SCRUM`) cada tarea es `SCRUM-(n+13)`: `SCV-1` es `SCRUM-14` y `SCV-62` es `SCRUM-75`. Las épicas E1 a E9 son `SCRUM-5` a `SCRUM-13`. En ramas y commits se usa la clave de Jira.
- **Tipo:** *Historia* = algo que el usuario puede usar. *Tarea* = trabajo técnico.
- Las tareas marcadas **TDD** se empiezan por el test.
- Cada sprint termina con algo desplegado que se puede mostrar al cliente.

## Épicas

| Épica | Contenido |
|---|---|
| E1 Fundaciones | Repositorio, herramientas, CI y despliegue |
| E2 Cuentas y acceso | Registro, login, separación entre clientes, configuración |
| E3 Artículos | Inventario, compra y fotos |
| E4 Gastos | Gastos por artículo y costo acumulado |
| E5 Ventas y permutas | Venta, permuta y cadena |
| E6 Crédito y deudas | Cuotas, cobros, pagos e incobrables |
| E7 Socios | Participaciones y liquidación |
| E8 Reportes | Resúmenes, inicio y PDF |
| E9 Salida a beta | Seguridad, monitoreo, respaldos y versión 1.0 |

---

## Sprint 0 — Fundaciones

**Objetivo:** una página en internet que le pregunta a la API "¿estás viva?" y muestra la respuesta. Sin funciones, pero con todo el camino armado: repositorio, tests, CI y despliegue.

| # | Tipo | Tarea | Pts |
|---|---|---|---|
| SCV-1 | Tarea | Crear el proyecto en Jira | 1 |
| SCV-2 | Tarea | Configurar Gitflow en GitHub | 2 |
| SCV-3 | Tarea | Armar el monorepo | 3 |
| SCV-4 | Tarea | API base en NestJS | 3 |
| SCV-5 | Tarea | PostgreSQL local y Prisma | 3 |
| SCV-6 | Tarea | Web base en React | 3 |
| SCV-7 | Tarea | Infraestructura de tests y primer ciclo TDD | 5 |
| SCV-8 | Tarea | CI con GitHub Actions | 3 |
| SCV-9 | Tarea | Primer despliegue | 5 |

**SCV-1 · Crear el proyecto en Jira** (E1)
Proyecto Scrum con clave SCV, las 9 épicas, el flujo Por hacer → En curso → En revisión → Hecho, y este backlog cargado. Conectar Jira con el repositorio de GitHub.
*Hecho cuando:* el sprint 0 está iniciado en Jira y una rama con `SCV-2` en el nombre aparece dentro de su tarea.

**SCV-2 · Configurar Gitflow en GitHub** (E1)
Renombrar `test` a `develop`. Proteger `main` y `develop` (sin push directo, CI obligatorio). Plantilla de PR. Escribir en `CONTRIBUTING.md` la convención de ramas y de commits.
*Hecho cuando:* un push directo a `develop` es rechazado y la primera rama `feature/` entra por PR.

**SCV-3 · Armar el monorepo** (E1)
pnpm workspaces con `apps/api`, `apps/web` y `packages/dominio`. TypeScript estricto, ESLint y Prettier compartidos. Scripts en la raíz: `dev`, `test`, `lint`, `build`.
*Hecho cuando:* `pnpm install` y `pnpm lint` funcionan desde la raíz, y `api` y `web` pueden importar una función de `dominio`.

**SCV-4 · API base en NestJS** (E1)
Proyecto NestJS con: variables de entorno validadas al arrancar, endpoint `GET /salud`, validación global con Zod, formato único de errores y CORS limitado al dominio de la web.
*Hecho cuando:* `GET /salud` responde 200, y la API se niega a arrancar si falta una variable de entorno.

**SCV-5 · PostgreSQL local y Prisma** (E1)
`docker-compose.yml` con PostgreSQL. Prisma configurado, con la primera migración: tablas `cuenta` y `usuario`. `PrismaService` disponible en toda la API. `.env.example`.
*Hecho cuando:* `docker compose up` + `prisma migrate dev` dejan la base lista en una máquina limpia, y `/salud` informa si la base responde.

**SCV-6 · Web base en React** (E1)
Vite + React + TypeScript, Tailwind, shadcn/ui, React Router y TanStack Query. Estructura de página pensada primero para celular, con barra de navegación inferior. Página de inicio que llama a `/salud`.
*Hecho cuando:* la web muestra el estado de la API y se ve bien a 375 px de ancho.

**SCV-7 · Infraestructura de tests y primer ciclo TDD** (E1) — **TDD**
Jest en `dominio` y en `api`; Supertest para e2e con una base de pruebas que se limpia entre tests; Vitest en `web`. Primer ejercicio de TDD: el módulo `dinero` (convertir Bs a centavos y al revés, formatear "Bs 5.000,50", aplicar un porcentaje con redondeo).
*Hecho cuando:* `pnpm test` corre los tres conjuntos, y `dinero` tiene sus tests escritos antes que el código (se ve en el historial de commits).

**SCV-8 · CI con GitHub Actions** (E1)
Flujo que en cada PR corre lint, revisión de tipos, tests (con un PostgreSQL de servicio) y build.
*Hecho cuando:* un PR con un test roto no se puede fusionar.

**SCV-9 · Primer despliegue** (E1)
Crear cuentas en Neon, Render y Cloudflare Pages. Base en Neon, API en Render (aplica migraciones al desplegar), web en Cloudflare Pages. Los tres despliegan solos desde `main`. Documentar los pasos y las variables en `DESPLIEGUE.md`.
*Hecho cuando:* la URL pública de la web muestra "API y base de datos funcionando", y un merge a `main` se publica sin intervención manual.

---

## Sprint 1 — Cuentas y acceso

**Objetivo:** una persona puede registrarse, entrar y configurar sus categorías. Los datos de una cuenta no se mezclan con los de otra.

| # | Tipo | Tarea | Pts |
|---|---|---|---|
| SCV-10 | Historia | Registro de cuenta | 5 |
| SCV-11 | Historia | Inicio y cierre de sesión | 5 |
| SCV-12 | Tarea | Separación entre cuentas | 5 |
| SCV-13 | Historia | Pantallas de registro e inicio de sesión | 5 |
| SCV-14 | Historia | Categorías de artículo | 3 |
| SCV-15 | Historia | Categorías de gasto | 2 |
| SCV-16 | Historia | Pantalla de configuración | 3 |
| SCV-17 | Historia | Contactos | 2 |

**SCV-10 · Registro de cuenta** (E2) — **TDD**
`POST /auth/registro` con nombre del negocio, nombre, correo y contraseña. Crea en una transacción la cuenta, el usuario (contraseña con argon2) y las categorías iniciales de artículo y de gasto de los requisitos 4.1 y 4.3.
*Hecho cuando:* una cuenta nueva ya tiene sus 4 categorías de artículo y 8 de gasto; un correo repetido da error claro; la contraseña nunca se guarda ni se devuelve en texto.

**SCV-11 · Inicio y cierre de sesión** (E2) — **TDD**
`POST /auth/login`, `/auth/refrescar` y `/auth/salir`. Token de acceso corto (15 min) y token de refresco en cookie httpOnly. `GET /auth/yo` devuelve el usuario y su cuenta.
*Hecho cuando:* credenciales malas dan 401 sin decir cuál dato falló; un token vencido se renueva con el refresco; tras salir, el refresco deja de servir.

**SCV-12 · Separación entre cuentas** (E2) — **TDD**
Guard global que exige sesión en todo salvo registro, login y salud. Decorador `@CuentaActual()`. Utilidad de tests que crea dos cuentas con sesión para las pruebas de aislamiento.
*Hecho cuando:* cualquier endpoint sin token da 401, y existe la utilidad `crearDosCuentas()` que usarán todos los módulos.

**SCV-13 · Pantallas de registro e inicio de sesión** (E2)
Formularios con React Hook Form y los esquemas Zod compartidos. Guardado de la sesión, renovación automática del token, rutas protegidas y botón de salir.
*Hecho cuando:* al recargar la página la sesión sigue activa, y entrar a una ruta privada sin sesión lleva al login.

**SCV-14 · Categorías de artículo** (E2) — **TDD**
Crear, listar, renombrar y desactivar. Cada categoría indica qué campos extra pide (placa, marca, año). No se borra una categoría en uso: se desactiva.
*Hecho cuando:* pasa la prueba de aislamiento y una categoría desactivada no aparece al crear artículos pero sí en los ya existentes.

**SCV-15 · Categorías de gasto** (E2) — **TDD**
Igual que SCV-14, sin campos extra.
*Hecho cuando:* pasa la prueba de aislamiento.

**SCV-16 · Pantalla de configuración** (E2)
Pantalla 10 de los requisitos: listas de categorías de artículo y de gasto, con alta, edición y desactivación.
*Hecho cuando:* se puede agregar la categoría "Moto" con campos placa, marca y año desde el celular.

**SCV-17 · Contactos** (E2) — **TDD**
Crear y buscar contactos por nombre o teléfono. Servirán como vendedores, compradores y socios. Componente web de "elegir o crear contacto" reutilizable.
*Hecho cuando:* al escribir un nombre aparecen los contactos existentes o la opción de crear uno nuevo.

---

## Sprint 2 — Artículos y compra

**Objetivo:** el cliente registra desde el celular lo que compra, con fotos, y ve su inventario.

| # | Tipo | Tarea | Pts |
|---|---|---|---|
| SCV-18 | Historia | Registrar un artículo con su compra | 5 |
| SCV-19 | Historia | Lista de artículos | 3 |
| SCV-20 | Historia | Ver, editar y cambiar el estado | 5 |
| SCV-21 | Tarea | Subida de fotos | 5 |
| SCV-22 | Historia | Pantalla "Nuevo artículo" | 5 |
| SCV-23 | Historia | Pantalla "Artículos" | 3 |
| SCV-24 | Historia | Pantalla "Detalle del artículo" | 5 |

**SCV-18 · Registrar un artículo con su compra** (E3) — **TDD**
Migración de `articulo`. `POST /articulos` con categoría, descripción, monto de compra, fecha, forma de pago (efectivo o transferencia; cuotas llega en el sprint 5), vendedor opcional, precio esperado opcional y los campos extra de la categoría. Entra en estado *comprado* con origen *compra*.
*Hecho cuando:* solo categoría, descripción y monto son obligatorios; la placa solo se acepta si la categoría la pide; pasa la prueba de aislamiento.

**SCV-19 · Lista de artículos** (E3) — **TDD**
`GET /articulos` con filtros por estado y categoría, búsqueda por descripción o placa, y paginación. Cada fila trae la foto principal y el costo acumulado (por ahora, el costo de compra).
*Hecho cuando:* los filtros se pueden combinar y los artículos más recientes salen primero.

**SCV-20 · Ver, editar y cambiar el estado** (E3) — **TDD**
`GET /articulos/:id`, edición de datos y cambio de estado entre *comprado*, *en reparación* y *listo*. El estado *vendido* solo lo pone una venta.
*Hecho cuando:* intentar poner *vendido* a mano da error, y un artículo vendido no puede volver atrás.

**SCV-21 · Subida de fotos** (E3)
Cuenta de Cloudinary. Interfaz `AlmacenDeFotos` con su implementación. Endpoint que firma la subida, y endpoints para registrar y borrar fotos de un artículo. Las fotos se reducen a un tamaño razonable.
*Hecho cuando:* una foto de 8 MB del celular queda guardada en menos de 500 KB y solo el dueño del artículo puede registrarla o borrarla.

**SCV-22 · Pantalla "Nuevo artículo"** (E3)
Pantalla 4. El formulario muestra los campos extra según la categoría elegida. Permite tomar fotos con la cámara o elegirlas de la galería.
*Hecho cuando:* se registra un vehículo con dos fotos desde un celular real en menos de un minuto.

**SCV-23 · Pantalla "Artículos"** (E3)
Pantalla 2: tarjetas con foto, descripción, estado y costo acumulado. Filtros por estado y categoría, y búsqueda.
*Hecho cuando:* la lista carga más artículos al bajar y recuerda los filtros al volver del detalle.

**SCV-24 · Pantalla "Detalle del artículo"** (E3)
Pantalla 3, primera versión: datos, galería de fotos, datos de la compra, cambio de estado y edición.
*Hecho cuando:* se puede pasar un artículo a *en reparación* y a *listo* con un toque.

---

## Sprint 3 — Gastos y costos

**Objetivo:** cargar un gasto toma segundos, y cada artículo muestra cuánto lleva invertido y cuánto se espera ganar.

| # | Tipo | Tarea | Pts |
|---|---|---|---|
| SCV-25 | Tarea | Dominio: costo y ganancia estimada | 3 |
| SCV-26 | Historia | Registrar gastos | 5 |
| SCV-27 | Historia | Pantalla "Nuevo gasto" rápido | 5 |
| SCV-28 | Historia | Historial y resultado en el detalle | 5 |
| SCV-29 | Historia | Inicio, primera versión | 3 |
| SCV-30 | Tarea | Costo acumulado real en la lista | 2 |

**SCV-25 · Dominio: costo y ganancia estimada** (E4) — **TDD**
En `packages/dominio`: `calcularCostoAcumulado` (adquisición + gastos), `calcularGananciaEstimada` (precio esperado − costo acumulado), `calcularDiasEnInventario` y `calcularDineroDetenido`.
*Hecho cuando:* los tests cubren artículo sin gastos, sin precio esperado y con ganancia estimada negativa.

**SCV-26 · Registrar gastos** (E4) — **TDD**
Migración de `gasto`. Crear, editar, borrar y listar por artículo. Obligatorios: artículo, monto y categoría. La fecha es hoy si no se envía. Se aceptan gastos en artículos en cualquier estado, incluido *vendido* (garantías).
*Hecho cuando:* un monto cero o negativo da error; pasa la prueba de aislamiento; no se puede cargar un gasto a un artículo de otra cuenta.

**SCV-27 · Pantalla "Nuevo gasto" rápido** (E4)
Pantalla 5. Tres datos: artículo, monto y categoría. Muestra primero los artículos usados hace poco, abre el teclado numérico y recuerda la última categoría. Descripción y fecha quedan plegadas. Se abre también desde el detalle, con el artículo ya elegido.
*Hecho cuando:* registrar un gasto desde el inicio toma menos de 10 segundos en un celular.

**SCV-28 · Historial y resultado en el detalle** (E4)
El detalle muestra el historial ordenado por fecha (compra y gastos) y un bloque de resultado: costo acumulado, precio esperado, ganancia estimada y días en inventario. Permite editar y borrar gastos.
*Hecho cuando:* al agregar un gasto, el costo y la ganancia estimada cambian sin recargar la página.

**SCV-29 · Inicio, primera versión** (E8)
Pantalla 1 con lo disponible hasta ahora: dinero detenido, cantidad de artículos por estado y botón grande de gasto rápido.
*Hecho cuando:* el dinero detenido coincide con la suma de los costos acumulados de los artículos no vendidos.

**SCV-30 · Costo acumulado real en la lista** (E4) — **TDD**
La lista de artículos pasa a mostrar compra + gastos y la ganancia estimada, calculados en una sola consulta.
*Hecho cuando:* listar 100 artículos no hace 100 consultas a la base.

---

## Sprint 4 — Venta y permuta

**Objetivo:** vender al contado o recibiendo artículos, ver la ganancia antes de confirmar y seguir la cadena de permutas. Es el corazón del producto.

| # | Tipo | Tarea | Pts |
|---|---|---|---|
| SCV-31 | Tarea | Dominio: cálculo de la venta | 5 |
| SCV-32 | Historia | Venta al contado | 5 |
| SCV-33 | Historia | Venta con permuta | 8 |
| SCV-34 | Tarea | Dominio: cadena de permutas | 5 |
| SCV-35 | Historia | Pantalla "Vender" | 8 |
| SCV-36 | Historia | Venta y cadena en el detalle | 5 |

**SCV-31 · Dominio: cálculo de la venta** (E5) — **TDD**
`calcularVenta`: aplica la fórmula del requisito 4.5, calcula la comisión (monto fijo o porcentaje del precio), el costo total y la ganancia y el margen del 4.8. Valida que las partes cuadren con el precio.
*Hecho cuando:* los ejemplos 1 y 2 de los requisitos son tests que pasan (ganancias de 2.200 y 5.000), y hay tests para comisión fija, comisión en porcentaje y venta con pérdida.

**SCV-32 · Venta al contado** (E5) — **TDD**
Migración de `venta`. `POST /articulos/:id/venta` con precio, efectivo o transferencia recibidos, comisión, fecha y comprador opcional. En una transacción crea la venta y pasa el artículo a *vendido*.
*Hecho cuando:* no se puede vender dos veces el mismo artículo; se guarda el monto de la comisión ya calculado; pasa la prueba de aislamiento.

**SCV-33 · Venta con permuta** (E5) — **TDD**
La venta acepta uno o varios artículos recibidos, cada uno con sus datos y su valor de toma, y un efectivo entregado como diferencia. Cada artículo recibido se crea en estado *comprado*, con origen *permuta*, el valor de toma como costo y enlazado a la venta. Todo en una transacción.
*Hecho cuando:* el ejemplo 2 deja dos artículos nuevos con costos de 25.000 y 30.000; si algo falla, no queda nada guardado a medias.

**SCV-34 · Dominio: cadena de permutas** (E5) — **TDD**
`calcularCadenaDePermutas`: a partir de un artículo, arma el árbol hacia atrás (de qué venta vino) y hacia adelante (qué artículos se recibieron al venderlo), y suma el resultado acumulado. Los artículos aún no vendidos se informan como pendientes.
*Hecho cuando:* el ejemplo 1 con la moto vendida en 2.500 da una cadena de +1.700, y una venta que recibe dos artículos produce dos ramas.

**SCV-35 · Pantalla "Vender"** (E5)
Pantalla 6, sin la parte de crédito. Pasos: precio y comprador → cómo paga (efectivo, artículos recibidos con mini formulario, diferencia entregada) → comisión → resumen con la ganancia, calculada con `calcularVenta` en el navegador.
*Hecho cuando:* el resumen avisa si las partes no suman el precio, y la ganancia mostrada es idéntica a la que luego guarda la API.

**SCV-36 · Venta y cadena en el detalle** (E5)
El detalle de un artículo vendido muestra la venta, el resultado final (costo total, precio, ganancia, margen, días) y la cadena de permutas con enlaces a cada artículo y el resultado acumulado.
*Hecho cuando:* desde la moto del ejemplo 1 se puede llegar al auto de origen y ver "+1.700 en la cadena".

---

## Sprint 5 — Crédito y deudas

**Antes de empezar:** confirmar con el cliente los tres pendientes de la sección 8 de los requisitos (cuándo cuenta el interés, a qué mes va la ganancia y cómo se calcula el interés).

**Objetivo:** vender a crédito, comprar a cuotas y saber quién debe, cuánto y desde cuándo.

| # | Tipo | Tarea | Pts |
|---|---|---|---|
| SCV-37 | Tarea | Dominio: cuotas, pagos y saldo | 8 |
| SCV-38 | Historia | Venta a crédito | 5 |
| SCV-39 | Historia | Compra a cuotas | 3 |
| SCV-40 | Historia | Registrar cobros y pagos | 5 |
| SCV-41 | Historia | Marcar una deuda como incobrable | 3 |
| SCV-42 | Historia | Pantalla "Cobros y deudas" | 5 |
| SCV-43 | Historia | Crédito en la pantalla "Vender" | 3 |
| SCV-44 | Historia | Cuotas próximas y vencidas en el inicio | 2 |

**SCV-37 · Dominio: cuotas, pagos y saldo** (E6) — **TDD**
`generarPlanDeCuotas` (capital + interés repartidos en N cuotas, con el ajuste de centavos en la última), `aplicarPago` (reparte un pago libre entre cuotas pendientes y entre capital e interés), `calcularSaldo` y `estadoDeCuota` (pendiente, pagada, vencida).
*Hecho cuando:* la suma de las cuotas es exactamente capital + interés; un pago mayor a una cuota adelanta la siguiente; un pago mayor al saldo da error.

**SCV-38 · Venta a crédito** (E6) — **TDD**
Migraciones de `deuda`, `cuota` y `pago`. La venta acepta un saldo a crédito con interés, cantidad de cuotas y fecha de la primera. Crea la deuda *por cobrar* y su plan dentro de la misma transacción de la venta.
*Hecho cuando:* una venta que combina efectivo, permuta y crédito cumple la fórmula del 4.5.

**SCV-39 · Compra a cuotas** (E6) — **TDD**
Al crear un artículo, la forma de pago *cuotas* pide el pago inicial, las cuotas y sus fechas, y genera una deuda *por pagar*.
*Hecho cuando:* el costo de adquisición del artículo es el precio completo, no solo lo pagado hasta hoy.

**SCV-40 · Registrar cobros y pagos** (E6) — **TDD**
`POST /deudas/:id/pagos` con monto y fecha. Guarda cuánto fue a capital y cuánto a interés. Cuando el saldo llega a cero, la deuda pasa a *pagada*. Se puede borrar un pago cargado por error.
*Hecho cuando:* los intereses cobrados se suman a la ganancia del artículo según lo acordado con el cliente.

**SCV-41 · Marcar una deuda como incobrable** (E6) — **TDD**
Acción sobre una deuda *por cobrar* activa. El saldo de capital no cobrado se resta de la ganancia del artículo. El artículo sigue *vendido*.
*Hecho cuando:* la ganancia del artículo cumple la fórmula del 4.8 con el saldo incobrable restado.

**SCV-42 · Pantalla "Cobros y deudas"** (E6)
Pantalla 7: dos pestañas, "Me deben" y "Debo". Cada deuda muestra contacto, artículo, saldo y próxima cuota. El detalle muestra el plan, los pagos y el botón para registrar un pago.
*Hecho cuando:* las cuotas vencidas se ven resaltadas y registrar un cobro toma dos toques y un monto.

**SCV-43 · Crédito en la pantalla "Vender"** (E6)
Se agrega el paso de saldo a crédito: interés, cuotas y fechas, con vista previa del plan.
*Hecho cuando:* el resumen muestra la ganancia de la venta y, aparte, el interés que se espera cobrar.

**SCV-44 · Cuotas próximas y vencidas en el inicio** (E8)
El inicio lista las cuotas por cobrar vencidas y las de los próximos 7 días, con acceso directo a registrar el cobro.
*Hecho cuando:* una cuota que vence hoy aparece en el inicio.

---

## Sprint 6 — Socios

**Objetivo:** llevar un artículo a medias con un socio y saber cuánto le toca a cada uno al vender.

| # | Tipo | Tarea | Pts |
|---|---|---|---|
| SCV-45 | Tarea | Dominio: liquidación entre socios | 5 |
| SCV-46 | Historia | Participaciones por artículo | 5 |
| SCV-47 | Historia | Indicar quién pagó cada gasto | 3 |
| SCV-48 | Historia | Pantalla "Socios" y liquidación | 5 |
| SCV-49 | Tarea | Deuda técnica y correcciones | 5 |

**SCV-45 · Dominio: liquidación entre socios** (E7) — **TDD**
`liquidarSocios`: cada participante recupera su aporte a la compra y los gastos que pagó; la ganancia o pérdida se reparte según el porcentaje. El resto de los centavos del redondeo va al dueño.
*Hecho cuando:* la suma de lo que recibe cada uno es exactamente el precio de venta menos la comisión, y hay tests con ganancia, con pérdida y con tres participantes.

**SCV-46 · Participaciones por artículo** (E7) — **TDD**
Migración de `participacion`. Agregar, editar y quitar socios de un artículo, con su porcentaje y su aporte a la compra. El dueño se queda con el porcentaje restante.
*Hecho cuando:* los porcentajes de los socios no pueden pasar de 100, y no se cambian las participaciones de un artículo ya vendido.

**SCV-47 · Indicar quién pagó cada gasto** (E7) — **TDD**
Si el artículo tiene socios, el gasto pide "pagado por" (el dueño por defecto). En artículos sin socios el campo no aparece.
*Hecho cuando:* el gasto rápido sigue tomando menos de 10 segundos en artículos sin socios.

**SCV-48 · Pantalla "Socios" y liquidación** (E7)
Pantalla 9: artículos con socios y, para cada uno vendido, la liquidación: qué puso cada uno, qué recupera y cuánto gana o pierde. En artículos no vendidos, una liquidación estimada con el precio esperado.
*Hecho cuando:* un vehículo a medias (50/50) muestra el monto final de cada participante.

**SCV-49 · Deuda técnica y correcciones** (E1)
Espacio reservado a mitad del proyecto: corregir lo que el cliente de prueba haya reportado, ordenar código y completar tests faltantes.
*Hecho cuando:* no quedan errores conocidos abiertos de los sprints 1 a 5.

---

## Sprint 7 — Reportes

**Objetivo:** responder "¿cuánto gané este mes y con qué?" y poder llevárselo en PDF.

| # | Tipo | Tarea | Pts |
|---|---|---|---|
| SCV-50 | Tarea | Dominio y consultas: ganancia por periodo | 5 |
| SCV-51 | Historia | Reportes de rentabilidad | 5 |
| SCV-52 | Historia | Reporte de inventario y dinero detenido | 3 |
| SCV-53 | Historia | Pantalla "Reportes" | 5 |
| SCV-54 | Historia | Exportar a PDF | 5 |
| SCV-55 | Historia | Inicio completo | 3 |

**SCV-50 · Dominio y consultas: ganancia por periodo** (E8) — **TDD**
Reglas para asignar la ganancia a un mes: la ganancia de la venta en el mes de la venta, los intereses en el mes en que se cobran, los gastos de garantía y los incobrables en el mes en que ocurren (según lo confirmado con el cliente).
*Hecho cuando:* una venta a crédito de enero con cobros en febrero y marzo reparte bien los montos entre los tres meses.

**SCV-51 · Reportes de rentabilidad** (E8) — **TDD**
Endpoints: ganancia por mes, ganancia por categoría de artículo, ranking de los más rentables y artículos con pérdida. Todos con rango de fechas.
*Hecho cuando:* la suma de la ganancia por categoría coincide con la ganancia total del mismo periodo; pasa la prueba de aislamiento.

**SCV-52 · Reporte de inventario y dinero detenido** (E8) — **TDD**
Endpoint con los artículos no vendidos, su costo acumulado, días en inventario y ganancia estimada, más el total invertido y detenido.
*Hecho cuando:* se puede ordenar por días en inventario para ver lo que lleva más tiempo sin venderse.

**SCV-53 · Pantalla "Reportes"** (E8)
Pantalla 8: selector de periodo, gráfico de ganancia por mes y tablas para el resto de los resúmenes de la sección 5.
*Hecho cuando:* todos los resúmenes de la sección 5 de los requisitos están visibles y se leen bien en el celular.

**SCV-54 · Exportar a PDF** (E8)
Cada reporte y la ficha de resultado de un artículo se exportan a PDF con pdfmake, con el nombre del negocio, el periodo y la fecha de emisión.
*Hecho cuando:* el PDF se puede descargar y compartir desde el celular.

**SCV-55 · Inicio completo** (E8)
Se agrega la ganancia del mes actual, comparada con la del mes anterior. El inicio queda como en la pantalla 1 de los requisitos.
*Hecho cuando:* el inicio carga con una sola petición a la API.

---

## Sprint 8 — Salida a beta

**Objetivo:** versión 1.0 en manos del cliente, segura y vigilada.

| # | Tipo | Tarea | Pts |
|---|---|---|---|
| SCV-56 | Tarea | Revisión de seguridad | 5 |
| SCV-57 | Tarea | Monitoreo de errores | 3 |
| SCV-58 | Tarea | Respaldos automáticos | 3 |
| SCV-59 | Historia | Recuperar la contraseña | 5 |
| SCV-60 | Historia | Instalar la app en el celular | 3 |
| SCV-61 | Tarea | Prueba de punta a punta | 5 |
| SCV-62 | Tarea | Prueba con el cliente y versión 1.0.0 | 5 |

**SCV-56 · Revisión de seguridad** (E9)
Límite de intentos en login y registro, cabeceras de seguridad (helmet), CORS estricto, revisión de que todo endpoint filtra por cuenta, auditoría de dependencias y límite de tamaño de las peticiones.
*Hecho cuando:* 10 intentos de login fallidos seguidos bloquean temporalmente, y todos los módulos tienen su prueba de aislamiento.

**SCV-57 · Monitoreo de errores** (E9)
Sentry en la API y en la web, sin enviar datos personales. Registro estructurado de peticiones en la API. Aviso por correo ante errores nuevos.
*Hecho cuando:* un error provocado a propósito en producción llega como aviso.

**SCV-58 · Respaldos automáticos** (E9)
Flujo programado de GitHub Actions que hace una copia semanal de la base (`pg_dump`) y la guarda cifrada. Documentar y **probar** la restauración.
*Hecho cuando:* se restauró una copia en una base vacía y los datos están completos.

**SCV-59 · Recuperar la contraseña** (E2) — **TDD**
Envío de un enlace de un solo uso, con vencimiento, por correo (servicio gratuito de correo transaccional, por ejemplo Resend). Pantallas de "olvidé mi contraseña" y de nueva contraseña.
*Hecho cuando:* el enlace sirve una sola vez, vence en una hora, y la respuesta no revela si el correo existe.

**SCV-60 · Instalar la app en el celular** (E9)
Manifiesto e íconos de PWA para "Agregar a pantalla de inicio". Sin modo sin conexión. Mensaje claro cuando la API está despertando.
*Hecho cuando:* la app se abre desde un ícono en el celular, a pantalla completa.

**SCV-61 · Prueba de punta a punta** (E9)
Playwright con el flujo principal: registrarse → crear artículo → cargar gasto → vender con permuta → ver la ganancia y la cadena. Corre en el CI.
*Hecho cuando:* la prueba pasa en el CI en tamaño de celular.

**SCV-62 · Prueba con el cliente y versión 1.0.0** (E9)
Sesión con el cliente cargando operaciones reales. Corregir lo que aparezca. Cerrar la versión con Gitflow: rama `release/1.0.0`, merge a `main`, etiqueta `v1.0.0` y merge de vuelta a `develop`.
*Hecho cuando:* el cliente registró por su cuenta una compra, un gasto y una venta con permuta, y `v1.0.0` está en producción.

---

## Resumen

| Sprint | Tema | Tareas | Puntos |
|---|---|---|---|
| 0 | Fundaciones | 9 | 28 |
| 1 | Cuentas y acceso | 8 | 30 |
| 2 | Artículos y compra | 7 | 31 |
| 3 | Gastos y costos | 6 | 23 |
| 4 | Venta y permuta | 6 | 36 |
| 5 | Crédito y deudas | 8 | 34 |
| 6 | Socios | 5 | 23 |
| 7 | Reportes | 6 | 26 |
| 8 | Salida a beta | 7 | 29 |
| | **Total** | **62** | **260** |

Los sprints 4 y 5 son los más cargados y los más delicados. Si hay que recortar, lo que se puede posponer sin romper el producto es el sprint 6 (socios), que los requisitos ya marcan como opcional para el cliente.
