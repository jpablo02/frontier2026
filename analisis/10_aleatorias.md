# Secuencias aleatorias largas (búsqueda a ciegas)

Script: `experimentos/10_aleatorias.ts` · corrida cruda paso a paso: `analisis/10_aleatorias_corrida.md`
· ids **2862–3109** de `experimentos.jsonl` (248 requests: 25 resets + 223 mensajes, 25 secuencias
`alea-01`…`alea-25`). En ese rango no hay líneas del canario.

## Decisiones

| Decisión | Alternativa descartada | Por qué |
|---|---|---|
| PRNG mulberry32, semilla 42 | `Math.random` | no tiene semilla, así que la corrida no se podría repetir |
| Generación adaptativa: los `AC-`/`OP-` salen de las respuestas reales del original | Prever los ids con la réplica | habríamos heredado sus errores justo en el estado que queremos poner a prueba |
| Largos (6–12) sorteados antes de empezar y recortados para no pasar de 250 | Cortar cuando se llega al tope | una secuencia cortada a la mitad no sirve para el diff |
| HALT solo con 0 o 1 argumento | HALT al azar con 2+ argumentos | E520 dice "reenvía con confirmación" y podría detener el servicio |
| Antes de gastar requests, probé el generador con un `send` simulado | Probarlo directo contra el original | así un bug del script no gasta cuota (la corrida real se hizo una sola vez) |

Mezcla obtenida (status y código): 201 ALTA 56 · 200 DEPOSITO/TRANSFER 28 · 200 CONSULTA 21 · 200 ANULA 9 ·
200 pong 6 · E401 27 · E402 13 · E301 13 · E506 9 · E303 9 · E302 8 · E507 7 · E202 7 · E520 4 · E304 3 · E201 3.

## Resultado del diff

`DESDE_ID=2862 node --env-file=.env src/diff.ts http://localhost:8099`

| secuencias | ok/total |
|---|---|
| alea-01…05, 07…25 (24 secuencias) | 100% cada una |
| **alea-06** | **9/10** |
| **Total** | **247/248 (99.6%)**, 24/25 secuencias perfectas |

## Diferencia encontrada (la única)

**id 2921 · `alea-06`, paso 7 de 9**

| paso | id | mensaje | original |
|---|---|---|---|
| 1 | 2915 | `ALTA;AC-0001;72` | 201 AC-0001 |
| 2 | 2916 | `ALTA;Ana;50` | 201 AC-0002 |
| 3 | 2917 | `ALTA;Ana;50` | 201 AC-0003 (nombre repetido) |
| 4 | 2918 | `CONSULTA;AC-0003;8` | 200 "0.00" |
| 5 | 2919 | `ALTAS;2` | 400 E301 sugerencia ALTA |
| 6 | 2920 | `DEPOSITO;AC-0001;100;82` | 200 OP-0001 |
| **7** | **2921** | **`TRANSFER;AC-0003;AC-0002;50001;26`** | **422 `{"error":"E507","mensaje":"saldo insuficiente"}`** |

- **Original:** `422 {"error":"E507","mensaje":"saldo insuficiente"}`
- **Réplica:** `422 {"error":"E506","mensaje":"límite excedido"}`

El original **no aplicó el límite de 50000**: el monto 50001 lo supera, pero respondió por el saldo
(AC-0003 tiene 0).

## Regla deducida

Comparé todas las TRANSFER de la v2 (ids ≥ 1793) con monto > 50000 y ambas cuentas existentes
(28 casos). En 27 el original da E506, aunque el saldo sea 0 (2972: `AC-0001→AC-0002;50001` con
saldo 0 → E506). Así que el orden E506 → E507 (ERR-20) sigue igual. Lo único que tiene el caso 2921
y ningún otro es esto:

> **El origen y el destino tienen el mismo titular** (las dos cuentas se dieron de alta como `ALTA;Ana`).

En todo el log hay solo dos transferencias entre cuentas distintas con el mismo nombre: 2921 (50001,
"Ana") y 2996 (50000, "123", por debajo del límite, E507 en los dos lados). **En la v1 no hubo
ninguna.** Eso encaja con CAM-05: el tercer cambio de la v2 estaría en una zona que nunca le
preguntamos a la v1 ("nombres repetidos en ALTA" ya figuraba como candidata).

**Hipótesis principal (probable, 1 línea):** en la v2, una TRANSFER entre cuentas del mismo titular
(mismo nombre en ALTA) se salta el límite E506. Las demás validaciones (E303, E304, E401, E507)
siguen igual.

También explica el patrón "se desvía a mitad de la secuencia": hacen falta dos ALTA con el mismo
nombre antes de la transferencia, y eso no pasó en ninguna de las 14 secuencias escritas a mano.

Hipótesis alternativas que estos datos no descartan del todo:

| Alternativa | Estado |
|---|---|
| E507 se evalúa antes que E506 | descartada: 2972 (saldo 0) y 2732 (saldo 5000), los dos con 50001, dan E506 |
| Depende de la cuenta de origen (`AC-0003`) | casi descartada: 3024 (`AC-0003`, otro titular, 99999999) da E506 |
| Entre cuentas del mismo titular hay un límite distinto (por ejemplo, 100000 como en la v1) en vez de no haber límite | **no se distingue**: solo hay un caso y es 50001 |
| La comparación de nombres distingue mayúsculas, tildes o espacios | sin datos |

## Siguiente experimento propuesto (no ejecutado, unos 10 requests)

Reset, `ALTA;Ana` ×2, `ALTA;Beto`, `DEPOSITO;AC-0001;9999999999`, y luego:
1. `TRANSFER;AC-0001;AC-0002;50001`: si da 200, el límite no se aplica entre cuentas del mismo titular.
2. `TRANSFER;AC-0001;AC-0002;100001` y `…;9999999999`: ¿no hay límite o el límite es otro?
3. `TRANSFER;AC-0001;AC-0003;50001` (Ana → Beto): control, tiene que dar E506.
4. `ALTA;ana` + `TRANSFER;AC-0001;AC-0004;50001`: ¿la comparación distingue mayúsculas?

No se modificó `src/replica.ts`. Si (1) da 200, el cambio es guardar el nombre en ALTA y saltar E506
cuando `nombre(origen) === nombre(destino)`.
