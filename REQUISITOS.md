# Sistema de Compra-Venta con control de gastos por artículo

Documento de requisitos y reglas de negocio. Versión 1 — 14/11/2026.

Estado: levantamiento de requisitos terminado. Todavía no hay código.

## 1. Objetivo

Registrar la compra, los gastos y la venta de artículos únicos para saber cuánto se ganó o se perdió en cada operación.

Hoy el cliente lleva todo de memoria. Donde más pierde los números es en las **permutas**.

El sistema será un **SaaS**. El primer cliente es un usuario de prueba con el que se pulirá el producto.

## 2. Perfil del primer cliente

| Tema | Respuesta |
|---|---|
| Qué compra y vende | Vehículos, celulares, TV y electrodomésticos |
| Tipo de artículo | Siempre único, nunca por lotes |
| A quién compra | Particulares |
| Cómo trabaja | Solo. Rara vez con un socio (por ejemplo, un vehículo a medias) |
| Reparaciones | Mecánicos externos; les paga cuando el trabajo está terminado |
| Moneda | Bolivianos (BOB), única |
| Dispositivos | Celular y PC, siempre con internet |
| Usuarios | Solo el dueño, por ahora |
| Datos a migrar | Ninguno |
| Fecha límite | Ninguna |

## 3. Alcance de la primera versión

### Incluye

- Registro de artículos con fotos tomadas desde el celular.
- Registro de la compra: contado, transferencia o cuotas.
- Registro de gastos por artículo.
- Venta al contado, a crédito con interés, con permuta, o combinadas.
- Control de cobros pendientes y de deudas propias.
- Comisión de venta.
- Precio esperado y ganancia estimada.
- Resúmenes y exportación a PDF.
- Socios por artículo y reparto de ganancia (opcional para el cliente).
- Cuentas separadas por cliente del SaaS.

### No incluye

- Facturación o comprobantes fiscales.
- Recibos, contratos o notas de venta.
- Documentos adjuntos o fotos de recibos.
- Código de barras o QR.
- Funcionamiento sin internet.
- Roles y permisos (hay un solo usuario por cuenta).
- Caja o efectivo disponible.
- Cuentas corrientes con mecánicos.
- Gastos generales del negocio y su prorrateo.
- Presupuesto de reparación contra gasto real.
- Varias monedas.

## 4. Reglas de negocio

### 4.1 Artículo

- Cada artículo es único y pertenece a una categoría.
- Categorías iniciales: vehículo, celular, TV, electrodoméstico. Son configurables por cuenta.
- Datos de un vehículo: placa, marca y año.
- Datos de los demás: fotos y observación.
- Todos los datos, salvo la categoría y una descripción corta, son opcionales.
- Estados, en orden: **comprado → en reparación → listo → vendido**.
- Un artículo entra al inventario por una compra o por una permuta.
- Cada artículo puede tener un **precio esperado** de venta.

### 4.2 Compra

- Se registra el monto, la fecha y la forma de pago: efectivo, transferencia o cuotas.
- El nombre y el teléfono del vendedor son opcionales.
- No hay gastos de adquisición aparte. Si aparece alguno, se registra como un gasto del artículo.
- Una compra a cuotas genera una deuda por pagar (ver 4.6).
- El cliente no entrega artículos suyos como parte de pago al comprar.

### 4.3 Gastos

- Cada gasto pertenece a un solo artículo.
- Datos obligatorios: artículo, monto y categoría. La fecha se pone sola y se puede cambiar.
- La descripción es opcional.
- Categorías iniciales: repuestos, mano de obra, pintura, limpieza, trámites, combustible, comisiones, otros. Son configurables por cuenta.
- El gasto se registra cuando se paga. No se llevan deudas con mecánicos.
- Si el artículo tiene socios, cada gasto indica quién lo pagó.
- Un artículo vendido puede seguir recibiendo gastos (garantías). Esos gastos reducen su ganancia.
- Registrar un gasto debe tomar pocos segundos desde el celular.

### 4.4 Venta

- Una venta puede combinar tres formas de cobro:
  - efectivo o transferencia recibidos en el momento,
  - artículos recibidos en permuta,
  - saldo a crédito.
- El nombre y el teléfono del comprador son opcionales.
- La comisión de venta se ingresa como monto fijo o como porcentaje del precio de venta. Se guarda el monto resultante y cuenta como costo del artículo.
- Al vender, el artículo pasa a estado **vendido**.
- Antes de confirmar la venta, el sistema muestra la ganancia resultante.

### 4.5 Permuta

- En una venta se pueden recibir uno o varios artículos.
- A cada artículo recibido se le da un **valor de toma**, que el cliente fija según el precio de mercado.
- Si los artículos recibidos valen más que el artículo vendido, el cliente paga la diferencia en efectivo.
- Fórmula:

  **Precio de venta = efectivo recibido + saldo a crédito + suma de valores de toma − efectivo entregado como diferencia**

- Cada artículo recibido entra al inventario en estado **comprado**, con su valor de toma como costo de adquisición y enlazado a la venta de origen.
- El sistema muestra la **cadena de permutas** de un artículo y el resultado acumulado de toda la cadena.

Ejemplo 1, permuta simple:

| Concepto | Monto (Bs) |
|---|---|
| Compra de un auto | 5.000 |
| Reparaciones | 800 |
| Costo total del auto | 5.800 |
| Efectivo recibido | 5.000 |
| Moto recibida (valor de toma) | 3.000 |
| Precio de venta | 8.000 |
| **Ganancia del auto** | **2.200** |

La moto entra al inventario con costo 3.000. Si luego se vende en 2.500, esa operación da una pérdida de 500 y la cadena completa una ganancia de 1.700.

Ejemplo 2, permuta con diferencia a cargo del cliente:

| Concepto | Monto (Bs) |
|---|---|
| Costo total del auto | 40.000 |
| Moto recibida (valor de toma) | 25.000 |
| Camioneta recibida (valor de toma) | 30.000 |
| Efectivo entregado como diferencia | 10.000 |
| Precio de venta | 45.000 |
| **Ganancia del auto** | **5.000** |

La moto y la camioneta quedan en inventario con costos de 25.000 y 30.000.

### 4.6 Crédito y deudas

- Hay dos tipos de deuda:
  - **por cobrar**: saldo de una venta a crédito,
  - **por pagar**: saldo de una compra a cuotas.
- Una deuda tiene capital, interés y un plan de cuotas con fecha de vencimiento.
- Lo habitual son cuotas fijas, pero se pueden registrar pagos libres de cualquier monto y en cualquier fecha.
- Las ventas a crédito cobran interés.
- Si el comprador deja de pagar, el artículo **no** se recupera.
- Una deuda por cobrar impaga se puede marcar como **incobrable**. El saldo no cobrado se resta de la ganancia del artículo.
- Estados de una deuda: activa, pagada, incobrable.

### 4.7 Socios

- Un artículo puede tener uno o más socios, cada uno con su porcentaje de participación.
- Se registra cuánto aportó cada uno a la compra.
- Cada gasto indica quién lo pagó: el dueño o un socio.
- Al vender se hace la liquidación:
  1. cada uno recupera lo que puso (aporte a la compra + gastos que pagó),
  2. la ganancia o la pérdida se reparte según el porcentaje.
- El uso de socios es opcional. Un artículo sin socios pertenece 100 % al dueño.

### 4.8 Cálculo de costo y ganancia

- **Costo total** = costo de adquisición (compra o valor de toma) + gastos + comisión de venta.
- **Ganancia** = precio de venta + intereses cobrados − costo total − saldo incobrable.
- **Margen %** = ganancia ÷ costo total.
- **Ganancia estimada** = precio esperado − costo acumulado. Se muestra mientras el artículo no esté vendido.
- **Días en inventario** = fecha de venta (o la fecha actual) − fecha de ingreso.
- **Dinero detenido** = suma del costo acumulado de los artículos no vendidos.

## 5. Resúmenes

Por artículo:

- costo total, precio de venta, ganancia, margen % y días en inventario.

Generales:

- ganancia por mes,
- ganancia por tipo de artículo,
- ranking de los artículos más rentables,
- artículos con pérdida,
- inventario actual con costo acumulado,
- dinero invertido y detenido.

Todos se pueden exportar a PDF.

## 6. Modelo de datos

Todas las tablas, salvo `cuenta`, llevan `cuenta_id` para separar los datos de cada cliente del SaaS.

| Tabla | Campos principales |
|---|---|
| `cuenta` | nombre del cliente del SaaS |
| `usuario` | nombre, correo, contraseña |
| `categoria_articulo` | nombre, campos extra que pide (placa, marca, año) |
| `categoria_gasto` | nombre |
| `contacto` | nombre, teléfono. Sirve para vendedores, compradores y socios |
| `articulo` | categoría, descripción, placa, marca, año, observación, estado, precio esperado, origen (compra o permuta), costo de adquisición, fecha de ingreso, forma de pago, vendedor, venta de origen |
| `foto` | artículo, URL |
| `gasto` | artículo, categoría, monto, fecha, descripción, pagado por |
| `venta` | artículo, fecha, precio de venta, efectivo recibido, efectivo entregado, tipo de comisión, valor de comisión, monto de comisión, comprador |
| `deuda` | tipo (por cobrar o por pagar), venta o artículo, capital, interés, estado |
| `cuota` | deuda, número, fecha de vencimiento, monto |
| `pago` | deuda, fecha, monto |
| `participacion` | artículo, socio, porcentaje, aporte a la compra |

Notas:

- Los artículos recibidos en permuta son filas de `articulo` con origen "permuta" y la venta de origen informada. No necesitan tabla propia.
- La compra se guarda dentro de `articulo`, porque cada artículo tiene una sola adquisición.

## 7. Pantallas

1. **Inicio:** ganancia del mes, dinero detenido, cuotas por cobrar próximas o vencidas y botón de gasto rápido.
2. **Artículos:** lista con foto, estado, costo acumulado y ganancia estimada. Filtros por estado y categoría.
3. **Detalle del artículo:** datos, fotos, historial (compra, gastos, venta, cobros), resultado y cadena de permutas.
4. **Nuevo artículo:** categoría, descripción, monto de compra, forma de pago, precio esperado y fotos.
5. **Nuevo gasto:** artículo, monto y categoría.
6. **Vender:** precio, efectivo, artículos recibidos en permuta, diferencia entregada, saldo a crédito con interés y cuotas, comisión. Muestra la ganancia antes de confirmar.
7. **Cobros y deudas:** lo que le deben y lo que debe, con registro de pagos.
8. **Reportes:** los resúmenes de la sección 5, con exportación a PDF.
9. **Socios:** liquidación por artículo.
10. **Configuración:** categorías de artículo y de gasto.

## 8. Pendientes

### Por confirmar con el cliente

- **Momento en que el interés cuenta como ganancia.** Supuesto actual: a medida que se cobra, no el día de la venta. Así el resumen mensual no muestra dinero que todavía no entró.
- **Mes al que pertenece la ganancia de una venta a crédito.** Supuesto actual: la ganancia sin interés cuenta en el mes de la venta.
- **Cómo se calcula el interés:** monto fijo acordado o porcentaje sobre el saldo.

### Por decidir en el proyecto

- Tecnologías (frontend, backend, base de datos, almacenamiento de fotos).
- Nombre comercial del producto.
- Planes y precios del SaaS.

## 9. Para versiones futuras

- Facturación y reportes contables.
- Más usuarios por cuenta, con roles y permisos.
- Historial de cambios.
- Control de propiedad de vehículos e IMEI de celulares.
- Exportación a Excel.
