# Prompt 03 — Construir la réplica y el comparador

Contexto: hackathon Frontier (Lab10), Reto 2. Hay que construir un servicio HTTP compatible con un
servicio de juguete de los organizadores (un "banco" ficticio). Lee `DISENO.md`,
`frontier-reto-2/README.md` (sección del contrato), `analisis/01_entrada.md`,
`frontier-reto-2/pruebas/ejemplos.jsonl` y `src/control.ts`.

No leas `.env` ni archivos `.env*`. No llames al servicio original: esta tarea es solo construir y
probar en local.

## 1. `src/replica.ts` — el servidor

Node 24 con TypeScript nativo y `node:http`, sin dependencias nuevas. Un solo proceso.

- Puerto: `process.env.PORT` (por defecto 8080). Token válido: `process.env.TEAM_TOKEN`.
- Rutas, autenticación, forma del cuerpo, errores y su orden: replica **exactamente** lo que muestran
  `analisis/01_entrada.md` y los ejemplos oficiales (mismo status, mismo cuerpo, mismos textos,
  incluidos espacios y faltas de ortografía).
- Comandos de los ejemplos (`PING`, `ALTA`, `CONSULTA`, `DEPOSITO`, `TRANSFER`, `ANULA`),
  sin importar mayúsculas/minúsculas, con estado en memoria: contador de cuentas `AC-0001…`,
  contador de operaciones `OP-0001…`, saldos y operaciones anuladas.
- `POST /__reset` vuelve todo al estado inicial.
- **Organiza las validaciones como una tabla ordenada**: un arreglo de pasos `{código, status,
  mensaje, chequeo}` que se evalúan en orden. Si los datos no muestran el orden entre dos errores,
  elige uno, déjalo marcado con `// SUPUESTO:` y explícalo en una línea.
- Reglas de negocio que los datos aún no aclaran del todo (por ejemplo, si el límite de
  transferencia es por operación o acumulado): implementa la interpretación más simple que encaje
  con los ejemplos y márcala con `// SUPUESTO:`.

## 2. `src/diff.ts` — el comparador

- Lee `experimentos.jsonl` y agrupa las líneas por `seq`. Cada secuencia se reproduce contra una URL
  (por defecto `http://localhost:8080`) en el mismo orden, con el mismo método, ruta y cuerpo. El
  reset de cada secuencia se manda a la réplica.
- La autenticación se traduce: donde el log dice `auth: "ok"`, usa `TEAM_TOKEN`; `"none"` sin
  header; `"team"` un token distinto del válido (por ejemplo `Bearer otro`); los demás modos, un
  header inválido equivalente.
- Compara como el set oficial: mismo status y mismo cuerpo (si ambos son JSON, sin importar el
  orden de las claves; si no, el texto exacto). Ignora las respuestas de `HEAD` en el cuerpo.
- Reporta: % de coincidencia por línea y por secuencia, y la lista de diferencias
  (`id | esperado | obtenido`).
- Uso: `node --env-file=.env src/diff.ts [url]`.

## 3. Prueba

- Levanta la réplica en local, corre el comparador y muéstrame el resumen y las diferencias.
- Itera hasta que los 20 ejemplos y las secuencias de `analisis/01_entrada.md` coincidan, o hasta
  que las diferencias que queden sean dudas reales (anótalas).
- No hagas commit.
