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

## Corrida 2 — 17:42

| Métrica | Corrida 1 (14:19) | Corrida 2 (17:42) | Cambio |
|---|---|---|---|
| **Total** | 60 / 100 | **87 / 100** | **+27** |
| Fáciles | 34 / 40 | **40 / 40** | +6 (perfecto) |
| Regulares | 23 / 40 | 36 / 40 | +13 |
| Difíciles | 3 / 20 | 11 / 20 | +8 |
| Fallan por status distinto | 22 | 10 | −12 |
| Fallan por cuerpo distinto | 18 | 3 | −15 |
| Caen en el primer request | 17 | 4 | −13 |
| Caen más adelante en la secuencia | 23 | 9 | −14 |
| Mediana por caso | 303 ms | 316 ms | sin cambio relevante |

**Lectura.** Los 7 cambios aplicados cubrieron casi todo lo que fallaba:

- **Fáciles al 100%:** las sugerencias por distancia de edición, HALT y PING (los tests de un solo
  mensaje) estaban en el grupo que fallaba. "Caen en el primer request" bajó de 17 a 4.
- **Difíciles de 3 a 11:** el tercer cambio del incidente (el límite no aplica entre cuentas del
  mismo titular) era lo que rompía las secuencias largas, como se sospechaba.
- **"Cuerpo distinto" casi desaparece** (18 → 3): el formato del saldo como string con 2 decimales
  explicaba la mayoría.
- Quedan **13 tests fallando**: 10 por status distinto y 3 por cuerpo. De ellos, 4 caen en el primer
  request y 9 más adelante.

**Dónde está el resto.** Con 4 fallos en tests de un solo mensaje y 10 por status, lo más probable
es que queden reglas de borde no medidas. Candidatas, todas marcadas hoy como supuesto o probable
en la especificación:

1. Desempate de sugerencias cuando dos comandos quedan a la misma distancia (CMD-DES-09).
2. Validación del argumento de `HALT` y la confirmación que pide E520 (CMD-DES-08).
3. Comparación de titulares con espacios al inicio o final, que la segunda ronda aleatoria no
   alcanzó a probar con saldo suficiente.
4. Transición de `AC-9999` a `AC-10000` (CMD-ALTA-06).

## Corrida 3 — 18:49

| Métrica | Corrida 2 (17:42) | Corrida 3 (18:49) |
|---|---|---|
| **Total** | 87 / 100 | **87 / 100** |
| Fáciles | 40 / 40 | 40 / 40 |
| Regulares | 36 / 40 | 36 / 40 |
| Difíciles | 11 / 20 | 11 / 20 |
| Fallan por status distinto | 10 | 11 |
| Fallan por cuerpo distinto | 3 | 2 |
| Caen en el primer request | 4 | 4 |
| Caen más adelante en la secuencia | 9 | 9 |

**Cambios aplicados entre la corrida 2 y la 3:**

| # | Cambio | Evidencia |
|---|---|---|
| 8 | Bloqueo de cuenta tras 3 rechazos consecutivos por límite (E510, 423) | 3547-3550, 3558-3560 |
| 9 | Desempate de sugerencias por orden alfabético, no por el orden de la lista | 3493, 3494 |
| 10 | El control acepta `00` y cualquier par de dígitos | 3517 |

**Lectura: los tres cambios no movieron el total.** El set oculto no prueba esas reglas, o las prueba
dentro de casos que ya fallaban por otro motivo. Un test pasó de fallar por cuerpo a fallar por
status, lo que sugiere que alguna respuesta quedó más cerca pero no exacta.

**Qué descarta esto.** Los 13 tests que fallan no dependen del bloqueo por intentos, del desempate de
sugerencias ni del formato del control. Tampoco de nada medido entre las 17:42 y las 18:49.

**Dónde quedaría por mirar, si hubiera más tiempo:** los 9 que caen a mitad de secuencia apuntan a
una regla de estado que no hemos observado; los 11 por status distinto, a códigos HTTP de casos de
borde. Las zonas sin medir que siguen marcadas como supuesto en la especificación son el lugar por
donde seguiría: la confirmación que pide `HALT` (E520), la transición de `AC-9999` a `AC-10000`, y
el comportamiento con cuerpos o cabeceras que no probamos.

**Valor del experimento:** las tres corridas, con sus desgloses, muestran exactamente qué familia de
cambios produjo cada salto: de 60 a 87 con los tres cambios del incidente más las reglas de
comandos, y de 87 a 87 con las reglas de bloqueo y formato. Es evidencia directa de qué hipótesis
eran correctas y cuáles no tocaban el set.
