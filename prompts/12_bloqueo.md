# Prompt 12 — Entender el bloqueo por intentos (E510)

Mismo contexto autorizado de siempre (hackathon Frontier, servicio de juguete, token personal,
8 req/s, todo al log). No leas `.env`. No modifiques `src/replica.ts` ni `ESPECIFICACION.md`.
**Urgente: el cierre es a las 20:00.** Un solo experimento, rápido.

Acabas de descubrir que tras 3 rechazos por límite (E506) seguidos en la misma cuenta origen, la
siguiente transferencia desde esa cuenta responde
`423 {"error":"E510","mensaje":"cuenta bloqueada","intentos":1}` (id 3449).

Escribe y ejecuta `experimentos/14_bloqueo.ts` (prefijo `blq-`, tope 120 requests) para medir:

1. **Cuántos rechazos hacen falta:** prueba con 1, 2, 3 y 4 E506 seguidos y mira cuándo bloquea.
2. **Qué cuenta el campo `intentos`:** haz varias transferencias después del bloqueo y mira cómo
   cambia ese número.
3. **Si tienen que ser seguidos:** 2 E506, una operación exitosa en medio, y 1 E506 más.
4. **Qué errores cuentan:** ¿solo E506, o también E507 (saldo insuficiente) o E401?
5. **Qué alcanza el bloqueo:** con la cuenta bloqueada, prueba DEPOSITO, CONSULTA, recibir una
   transferencia de otra cuenta, y ANULA. ¿Se bloquea solo como origen?
6. **Si se puede desbloquear:** espera unos segundos y reintenta; prueba también si `__reset` lo
   limpia (eso ya lo sabemos, pero confírmalo).
7. **El status y el cuerpo exactos** en cada caso, incluido cómo evoluciona `intentos`.

Después compara con la réplica en local (puerto 8099) con `DESDE_ID=<primer id>` y apágala.
Escribe `analisis/14_bloqueo.md`. En tu respuesta final: **la regla exacta, en pocas líneas**, con
los ids que la prueban. No hagas commit.
