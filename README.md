# frontier2026 · Reto 2 (La caja negra)

Reemplazo compatible de un servicio HTTP sin documentación (un "banco" de juguete de los
organizadores del hackathon Frontier/Lab10). El reemplazo tiene que dar el mismo status y el mismo
cuerpo que el original en cada request, errores incluidos. Cada regla se sacó de un experimento
registrado en `experimentos.jsonl`, y la especificación cita esas líneas.

**Estado (10 oct, 14:55):** el comparador local da 100% contra el log (500/500 líneas al cerrar la
tanda 4). La
corrida oficial 1 (14:19) dio **60/100**, posiblemente contaminada porque el comparador corría contra
producción al mismo tiempo (ver `BITACORA.md`). El canario está en marcha desde las 14:50.

Documentos: [`DISENO.md`](DISENO.md) (diseño y decisiones) ·
[`ESPECIFICACION.md`](ESPECIFICACION.md) (comportamiento del servicio, con evidencia) ·
[`BITACORA.md`](BITACORA.md) (qué pasó durante el día).

## Estructura

| Ruta | Qué hay |
|---|---|
| `src/replica.ts` | La réplica: servidor HTTP sin dependencias, estado en memoria, validación en tablas ordenadas |
| `src/control.ts` | Cálculo del dígito de control (`control`) y firma de mensajes (`firmar`) |
| `src/probe.ts` | La sonda: único cliente del original. Limita la velocidad, registra cada request en el log y tiene el candado entre procesos |
| `src/diff.ts` | El comparador: reproduce los ejemplos oficiales y el log contra una URL y compara como el set oficial |
| `experimentos/` | Tandas de experimentos (`00_ejemplos.ts` … `04_orden_anula.ts`) y el canario (`canary.ts`) |
| `analisis/` | Resultados legibles de cada tanda, preguntas abiertas y el reporte del canario |
| `experimentos.jsonl` | Log de experimentos (entregable): una línea por request al original |
| `frontier-reto-2/` | Enunciado del reto y los 20 ejemplos oficiales |
| `prompts/` | Prompts que se le dieron a Pi agent para cada pieza |
| `transcripts/` | Salidas y sesiones de Pi agent |
| `docs/` | Diagrama de arquitectura |

## Requisitos y variables de entorno

Node 24 (TypeScript nativo, sin build). Copia `.env.example` a `.env`; `.env` está en `.gitignore`.

| Variable | Quién la usa | Para qué |
|---|---|---|
| `TEAM_TOKEN` | `replica.ts`, `diff.ts` | Token del equipo que acepta la réplica (el que usa el set) |
| `CAJA_NEGRA_TOKEN` | `probe.ts` | Token personal para hablar con el original |
| `PORT` | `replica.ts` | Puerto de la réplica (por defecto 8080) |
| `OPENROUTER_API_KEY`, `HACKATHON_API_KEY` | Pi agent | Están en `.env.example`; la réplica no las usa |

> `.env.example` solo trae las dos últimas. `TEAM_TOKEN` y `CAJA_NEGRA_TOKEN` hay que agregarlas a
> mano. Nunca se versionan valores reales: el hook de `.githooks/` bloquea commits con keys
> (`git config core.hooksPath .githooks`).

## Correr en local

```bash
# réplica (npm start no lee .env: hay que pasar las variables)
TEAM_TOKEN=<token> PORT=8080 npm start
# ...o tomando las variables de .env
node --env-file=.env src/replica.ts

# comparador contra la réplica local (lee TEAM_TOKEN de .env)
npm run diff
# ...o contra otra URL
npm run diff -- https://<tu-despliegue>
```

El comparador imprime aciertos por secuencia, el total y cada diferencia (`id | esperado | obtenido`).
Cada secuencia empieza con su línea de reset, así que se puede correr completo una y otra vez.
**No lo corras contra producción mientras corre una validación oficial:** comparten el mismo estado.

## Despliegue

Railway, plan Hobby, **1 instancia, sin modo serverless (sin "sleep")**, comando `npm start` con
`TEAM_TOKEN` en las variables del servicio. Por qué: el estado vive en la memoria del proceso y el
set le habla a un solo proceso. Con varias instancias o con un contenedor que se duerme, un test
puede caer en un proceso sin sus cuentas y fallar la secuencia entera. Un túnel a la máquina local
se descartó porque se cae en cuanto se apaga el portátil. La réplica atrapa errores imprevistos
(`uncaughtException`) para que el proceso no se caiga y pierda el estado.

## Cómo se explora el original

- **Sonda (`src/probe.ts`).** Es la única forma de hablar con el original. Manda a 8 rps como
  máximo (el límite es 10), reintenta si la infraestructura responde `X-Frontier-Infra: rate-limit` y
  agrega cada request a `experimentos.jsonl` con `id` consecutivo, `seq`, `x_req`, hipótesis,
  request, status, respuesta, método, ruta, modo de auth y hora. Nada sale sin quedar registrado.
- **Experimentos (`experimentos/*.ts`).** Cada tanda es un script que llama a `reset(seq)` y
  luego a `send(...)` con la hipótesis. Se corren con `node --env-file=.env experimentos/<archivo>.ts`
  y sus resultados se resumen en `analisis/`.
- **Candado entre procesos.** El canario y los experimentos usan el mismo token, o sea el mismo
  estado en el original. El primer `reset()` de un proceso crea el directorio `.probe.lock/`; los
  demás procesos esperan hasta que se suelte (`release()` o fin del proceso). Si el candado tiene más
  de 2 minutos, se considera abandonado y se borra.
- **Canario (`experimentos/canary.ts`).** Cada 10 minutos, hasta las 19:50 (hora de Bogotá), repite 26
  mensajes fijos (los 20 ejemplos oficiales y 6 reglas medidas) y compara cada respuesta con la
  primera vuelta. Escribe en `analisis/canary.md` "sin cambios" o una tabla con lo que cambió y el
  `id` del log. Sirve para detectar el incidente de las 15:30.
  Se corre con `node --env-file=.env experimentos/canary.ts`.
