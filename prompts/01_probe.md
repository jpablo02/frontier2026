# Prompt 01 — Cliente de sondeo (`probe`)

Contexto: lee `DISENO.md` y `frontier-reto-2/README.md`. Estamos en el Reto 2 (caja negra).

REGLA DURA: no leas, no abras, no imprimas ni hagas `cat` de `.env` ni de ningún archivo `.env*`.
Los tokens llegan por `process.env` al ejecutar con `node --env-file=.env`. Nunca imprimas un token.

## Qué construir

Node 24 con TypeScript nativo (sin build, sin dependencias nuevas; usa `fetch` nativo). Los imports
llevan la extensión `.ts`.

### `src/probe.ts` — única puerta al servicio original

- URL base: `https://caja-negra-production-c64f.up.railway.app`. Token: `process.env.CAJA_NEGRA_TOKEN`.
  Si falta, error claro sin imprimir nada sensible.
- `export async function send(opts)` con:
  `{ seq: string, hipotesis: string, method?: string = "POST", path?: string = "/msg",
     body?: unknown | string (string = cuerpo crudo, se manda tal cual), auth?: "ok" | "none" | string
     (string = header Authorization literal), conclusion?: string }`.
  Devuelve `{ id, status, raw, json (o null), xReq }`.
- `export async function reset(seq)`: `POST /__reset` con el token. **Se registra en el log** igual
  que cualquier request (hipotesis: "reset de secuencia").
- Límite de velocidad: como máximo 8 requests por segundo en total (cola global).
- Si la respuesta trae el header `X-Frontier-Infra: rate-limit`, NO se registra como experimento:
  espera 2 s y reintenta (máximo 5 veces).
- Timeout de 10 s por request.

### Log `experimentos.jsonl` (en la raíz; es entregable)

Una línea JSON por request, escrita apenas llega la respuesta (append, nunca reescribir):

```json
{"id":1,"seq":"s1","x_req":1,"hipotesis":"…","request":{"m":"PING;64"},"status":200,"response":{"pong":true},"conclusion":"…",
 "metodo":"POST","ruta":"/msg","auth":"ok","ts":"2026-10-10T16:00:00.000Z"}
```

- `id`: consecutivo global. Al arrancar, continúa desde la última línea existente del archivo.
- `x_req`: valor del header `X-Req` (número si es numérico, si no string, o null).
- `request`: el cuerpo enviado (objeto si era JSON; string si era crudo; null si no hubo cuerpo).
- `response`: el JSON parseado; si el cuerpo no es JSON, el texto exacto como string.
- Campos extra `metodo`, `ruta`, `auth` (`"ok"`, `"none"` o `"custom"`; nunca el valor) y `ts`.
- Escritura segura ante concurrencia: un solo escritor en serie.

### `src/control.ts`

`export function control(msg: string): number`: dado el mensaje sin el último campo, calcula
`98 − ((N × 100) mod 97)`, donde N es el mensaje en mayúsculas con cada letra convertida a su
posición (A=1…Z=26), los dígitos tal cual y descartando todo lo demás. Usa `BigInt`.
`export function firmar(msg: string): string` devuelve `msg + ";" + control(msg)`.

### `experimentos/00_ejemplos.ts` — primer experimento

1. `reset("ejemplos-replay")` y luego manda en orden los 20 `request` de
   `frontier-reto-2/pruebas/ejemplos.jsonl` con `seq: "ejemplos-replay"` e hipotesis
   `"reproducción del ejemplo oficial n=<n>"`.
2. Compara cada respuesta con la esperada (status + cuerpo JSON sin importar el orden de las claves)
   e imprime una tabla `n | esperado | obtenido | OK/DIFF`.
3. Además, para 5 mensajes nuevos firmados con `firmar()` (ej. `ALTA;Ana`, `ALTA;Bruno`,
   `CONSULTA;AC-0003`), manda la versión firmada y la versión con control+1, con hipotesis
   `"confirmar algoritmo de control"`, y reporta si la firmada pasa y la otra da E202.

Ejecutar con: `node --env-file=.env experimentos/00_ejemplos.ts`

### Entrega

- Corre `00_ejemplos.ts` una vez y muéstrame la tabla resultante.
- No hagas commit. No modifiques `DISENO.md` ni el material del reto.
