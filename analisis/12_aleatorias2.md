# Secuencias aleatorias 2: semilla 1337, sesgo a titulares

Script: `experimentos/12_aleatorias2.ts` · corrida paso a paso: `analisis/12_aleatorias2_corrida.md`
· ids **3162–3438** de `experimentos.jsonl` (**277 requests**: 20 resets + 257 mensajes, **20 secuencias**
`alea2-01`…`alea2-20`, de 10 a 16 mensajes). En ese rango no hay líneas del canario: el candado de
`probe.ts` las dejó fuera.

## Decisiones

| Decisión | Alternativa descartada | Por qué |
|---|---|---|
| Semilla 1337 | Repetir la 42 | con la 42 saldrían las mismas combinaciones que ya pasaron |
| ALTA reutiliza un nombre de la secuencia (55%) o una variante parecida (30%) | Sortear nombres de una lista fija, como en la ronda 1 | con 8 nombres casi nunca coincidían dos cuentas en una secuencia |
| Pares de TRANSFER con prioridad a "mismo titular" (45%) y "titular parecido" (30%) | Pares al azar | el cambio 3 solo se ve con pares que comparten titular |
| 20 secuencias de 10–16 mensajes, tope de 300 | Más secuencias cortas | los tests difíciles llegan a 12 mensajes |
| Probé el generador en seco (`SIMULAR=1`) antes de mandar nada | Probarlo directo contra el original | un bug no gasta cuota; la corrida real se hizo una sola vez |

## Resultado del diff

`DESDE_ID=3162 node --env-file=.env src/diff.ts http://localhost:8099`

| seq | ids | mensajes | ok/total |
|---|---|---|---|
| alea2-01 | 3162–3173 | 11 | 12/12 |
| alea2-02 | 3174–3185 | 11 | 12/12 |
| alea2-03 | 3186–3201 | 15 | 16/16 |
| alea2-04 | 3202–3216 | 14 | 15/15 |
| alea2-05 | 3217–3230 | 13 | 14/14 |
| alea2-06 | 3231–3243 | 12 | 13/13 |
| alea2-07 | 3244–3257 | 13 | 14/14 |
| alea2-08 | 3258–3271 | 13 | 14/14 |
| alea2-09 | 3272–3285 | 13 | 14/14 |
| alea2-10 | 3286–3299 | 13 | 14/14 |
| alea2-11 | 3300–3314 | 14 | 15/15 |
| alea2-12 | 3315–3326 | 11 | 12/12 |
| alea2-13 | 3327–3340 | 13 | 14/14 |
| alea2-14 | 3341–3353 | 12 | 13/13 |
| alea2-15 | 3354–3365 | 11 | 12/12 |
| alea2-16 | 3366–3381 | 15 | 16/16 |
| alea2-17 | 3382–3395 | 13 | 14/14 |
| alea2-18 | 3396–3412 | 16 | 17/17 |
| alea2-19 | 3413–3427 | 14 | 15/15 |
| alea2-20 | 3428–3438 | 10 | 11/11 |
| **Total** | | **257** | **277/277 (100%)**, 20/20 secuencias perfectas |

## Diferencias encontradas

**Ninguna.** Las 277 respuestas de la réplica coinciden con el original en status y cuerpo. Como no
hay diferencias, no hay regla nueva que deducir.

Mezcla (status y código): 201 ALTA 79 · 200 DEPOSITO/TRANSFER 49 · 422 E507 43 · E401 17 · 200 CONSULTA 16 ·
200 ANULA ok 13 · ya anulada 1 · E303 7 · E506 6 · E402 5 · E302 5 · pong 5 · E304 4 · E202 4 · E301 2 · E104 1.

## Lo que esta ronda sí probó

- **12 grupos de 3 o más cuentas con el mismo titular** (por ejemplo, 5× `Ana Maria` en alea2-05, 5× `AC-0001`
  en alea2-14, 5× `123` en alea2-18). La numeración `AC-` y los saldos siguieron igual que en la réplica.
- **26 transferencias de más de 50000 entre cuentas del mismo titular** (en los dos sentidos): las 22 que
  llegaron a validar el límite dieron **E507, no E506**. Como E506 se evalúa antes que E507 (ERR-20), eso
  confirma 22 veces que el límite no se aplica entre cuentas del mismo titular (CAM-05). Las otras 4 dieron
  E303 o E304 antes de llegar al límite.
- **Titulares parecidos que cuentan como distintos**: `José` vs `JOSÉ` (id 3168, 50001) y `Ana  Maria` vs
  `Ana Maria` (id 3183, 60000) dieron **E506**. Es decir, el original no pasa el nombre a mayúsculas ni
  colapsa los espacios internos. Esto confirma CMD-TRF-10 con otros dos casos, además del 3134.
- 4 transferencias de más de 50000 con titular distinto dieron E506, como se esperaba.

## Lo que esta ronda NO probó (falla de cobertura, no del servicio)

1. **Ninguna transferencia de más de 50000 entre cuentas del mismo titular se ejecutó.** Las 22 dieron E507
   porque el generador mandaba los depósitos en cualquier orden, casi siempre después de la transferencia
   o a otra cuenta (ver alea2-07: tres cuentas `x`, tres transferencias que dan E507 y el depósito al final).
   Las 5 transferencias que salieron bien eran de ≤ 50000.
2. **Por eso solo una anulación cayó sobre una transferencia** (id 3216, OP-0007, titular distinto, ok).
   Quedó **sin probar** cómo se anula una transferencia de más de 50000 entre cuentas del mismo titular.
3. **Las variantes de nombre casi no salieron**: el generador las aplica sobre el nombre que se va a reusar y
   muchos de ellos no cambian con mayúsculas ni tildes (`123`, `x`, `0`, `AC-0001`). Solo aparecieron
   `JOSÉ`, `BETO`, `Beto ` y `Ana  Maria`. No salieron `ana`, ` Ana` ni `Añá`. El único par con espacio al
   final (`Beto` vs `Beto `, id 3390) era de 50000, que no supera el límite, así que no dice nada sobre
   si el original recorta los espacios.

Conclusión: la réplica no tiene diferencias en lo que se probó. Pero el 100% **no** cubre la combinación que
más nos preocupa en los tests largos: una transferencia de más de 50000 entre cuentas del mismo titular,
con saldo, y después su anulación. Tampoco cubre los espacios en los extremos ni las tildes. Si se decide
gastar más cuota, conviene un experimento dirigido (unos 20 requests), no otra ronda aleatoria:
depositar primero y luego `Ana`/`Ana `, `Ana`/` Ana` y `Ana`/`Aná` con 50001, y después anular una de
50001 entre cuentas del mismo titular y consultar los dos saldos.
