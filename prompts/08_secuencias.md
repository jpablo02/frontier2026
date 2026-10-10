# Prompt 08 — Segunda ronda de hipótesis: secuencias largas y zonas sin explorar

Contexto: hackathon Frontier (Lab10), Reto 2. Reemplazo compatible de un servicio de juguete de los
organizadores (un "banco" ficticio). El README oficial autoriza explícitamente esta exploración:
"Scripts y fuzzers propios están permitidos" y "Nada de lo que hagas con tu token es irreversible:
POST /__reset lo repara". Usamos nuestro token personal, respetamos sus límites (10 req/s y
8.000/día; vamos a 8 req/s) y todo queda registrado en `experimentos.jsonl`, que se entrega.

No leas `.env` ni archivos `.env*`. No modifiques `src/replica.ts` ni `ESPECIFICACION.md`.

Lee `transcripts/06-hipotesis-v2.txt` (tu ronda anterior), `analisis/08_hipotesis_v2.md`,
`ESPECIFICACION.md`, `analisis/01_entrada.md`, `experimentos/04_orden_anula.ts` (el patrón) y
`src/probe.ts`.

## Lo que ya sabemos

En tu ronda anterior descartaste 9 hipótesis y encontraste 3 huecos (sugerencias por distancia de
edición, el comando `HALT`, y PING ignorando el formato del control). Esos 3 ya están implementados
en la réplica, que ahora da 100% contra las 805 observaciones de la versión 2.

El set oculto tiene **15 secuencias de 6 a 12 requests**, y una secuencia falla entera si falla un
paso. Es la zona donde menos hemos explorado: nuestras secuencias más largas tienen 7 pasos.

## Qué hacer

1. Propón hipótesis nuevas, centradas en:
   - **Secuencias largas** que combinen varios comandos y acumulen estado: muchos depósitos,
     transferencias en cadena entre 3 o más cuentas, anulaciones intercaladas, consultas entre medio.
     Busca cualquier punto donde nuestro modelo del estado pueda desviarse del original.
   - **Interacciones** que no hemos probado: anular una transferencia y volver a transferir, anular
     en orden inverso, operar sobre una cuenta con saldo negativo, transferir desde una cuenta que
     quedó negativa.
   - Cualquier otra zona sin medir que se te ocurra, incluidas las que descartaste pero con valores
     distintos.
2. Escribe `experimentos/09_secuencias.ts` con el patrón de `04_orden_anula.ts`: prefijo de `seq`
   `sec-`, `reset(seq)` por caso, `firmar()` para el control, una `hipotesis` en español por request,
   y resultados en `analisis/09_secuencias.md` con la tabla
   `| caso | id | mensaje | status | respuesta |`. Tope: 200 requests.
3. Ejecútalo **una sola vez**: `node --env-file=.env experimentos/09_secuencias.ts`.
4. Reporta: cuántos requests usaste, qué hipótesis quedaron descartadas, y cualquier respuesta que
   te sorprenda, citando ids del log. Si todo coincide con lo esperado, dilo claramente.

No hagas commit. Hay un canario corriendo en otro proceso contra el mismo token; `src/probe.ts` ya
serializa los resets con un candado, así que solo usa `reset()` como en el patrón.
