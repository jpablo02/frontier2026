# Registro de corridas del set oculto

Solo tenemos 3 corridas en el día y **nunca vemos los casos**, solo los totales por categoría. Este
registro compara los desgloses entre corridas para deducir qué mejoró y qué no, sin ver sus tests.

**Cómo leerlo.** "Caen en el primer request" quiere decir que la réplica falló en el paso 1 de la
secuencia; "caen más adelante" quiere decir que arrancó bien y se desvió después, que es lo típico
de un estado mal calculado.

## Corrida 1 — 14:19

| Métrica | Valor |
|---|---|
| Total | **60 / 100** |
| Fáciles | 34 / 40 |
| Regulares | 23 / 40 |
| Difíciles | 3 / 20 |
| Fallan por status distinto | 22 |
| Fallan por cuerpo distinto | 18 |
| Caen en el primer request | 17 |
| Caen más adelante en la secuencia | 23 |
| Mediana por caso | 303 ms (límite: 5 s por request) |

**Estado del código en ese momento:** réplica de la versión 1 del original, con el monto máximo
limitado a 9 dígitos (error que se corrigió después). El incidente todavía no había ocurrido.

**Advertencia sobre este dato:** mientras corría, el comparador local se ejecutó contra el mismo
entrypoint. La réplica tiene una sola memoria compartida, así que sus resets y los nuestros pudieron
pisarse. El número puede estar subestimado y no sabemos cuánto.

**Lectura:** el agujero está en las secuencias largas (3/20) y en lo que se desvía a mitad de camino
(23 casos). La distribución real (40/40/20) no coincide con la del README (40/45/15).

## Cambios aplicados después de la corrida 1

| # | Cambio | Evidencia |
|---|---|---|
| 1 | Monto máximo de depósito: de 9 a 10 dígitos | ids 393, 396, 399 |
| 2 | Límite de TRANSFER: de 100000 a 50000 (cambio 1 del incidente) | 2347-2367 |
| 3 | Saldo como string con 2 decimales (cambio 2 del incidente) | 1825, 2237, 2377 |
| 4 | Sugerencia del comando más parecido, a distancia de edición ≤ 2 | 2507-2512 |
| 5 | Comando `HALT`: 409 E520 | 2516, 2518 |
| 6 | PING ignora el control por completo, también su formato | 2555 |
| 7 | Corregido un error 500 de la réplica al ejecutar HALT | — |

**Verificación local antes de la corrida 2:** 1.015 / 1.015 líneas y 105 / 105 secuencias contra
todo lo observado de la versión 2.

## Corrida 2 — pendiente

| Métrica | Valor |
|---|---|
| Total | |
| Fáciles | / 40 |
| Regulares | / 40 |
| Difíciles | / 20 |
| Fallan por status distinto | |
| Fallan por cuerpo distinto | |
| Caen en el primer request | |
| Caen más adelante en la secuencia | |

**Qué mirar al compararla con la corrida 1:**

- Si **difíciles** sigue bajo, el problema está en el estado de las secuencias largas, no en reglas
  sueltas.
- Si **"caen en el primer request"** baja mucho, los cambios 4, 5 y 6 (sugerencias, HALT, PING)
  estaban en varios tests de un solo mensaje.
- Si **"status distinto"** baja y "cuerpo distinto" no, falta afinar textos exactos, no reglas.
- Si el total **no sube**, los 7 cambios no tocaban lo que el set prueba, y hay que buscar en otra
  parte.

## Corrida 3 — pendiente (reservada para ~19:30)

Verificación final del despliegue, después de aplicar lo que enseñe la corrida 2.
