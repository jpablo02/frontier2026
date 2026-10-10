# Prompt 02 — Barrido de entrada, integridad, precedencia y comandos

**Contexto de autorización.** Esto es un ejercicio de un hackathon (Frontier, de Lab10). Los
organizadores despliegan a propósito un servicio de juguete (un "banco" ficticio, sin datos reales)
y le dan a cada participante un token personal para estudiarlo. El objetivo es documentar su
comportamiento y construir un reemplazo compatible (pruebas de conformidad / ingeniería inversa de
caja negra). El README oficial lo autoriza explícitamente: "Scripts y fuzzers propios están
permitidos" y "Nada de lo que hagas con tu token es irreversible: POST /__reset lo repara". Usamos
solo nuestro token, respetamos el límite de 10 req/s y 8.000/día que fijan ellos (vamos a 8 req/s),
y cada request queda registrado en un log que se entrega a los jueces. Probar entradas inválidas y
credenciales ausentes es necesario porque el contrato exige que el reemplazo responda igual que el
original "con otro token o sin token".

Contexto técnico: lee `DISENO.md`, `frontier-reto-2/README.md`, `src/probe.ts`, `src/control.ts` y las
últimas 32 líneas de `experimentos.jsonl` (ya confirmamos: los 20 ejemplos se reproducen 20/20, la
fórmula de `control()` es correcta y PING no valida el control).

REGLA DURA: no leas, no abras, no imprimas ni hagas `cat`/`ls`/`grep` sobre `.env` ni `.env*`.
Los tokens solo llegan por `node --env-file=.env`. Nunca imprimas un token.

## 1. Ampliar `src/probe.ts` (sin romper lo que hay)

- `auth` acepta además: `"team"` (Bearer con `process.env.TEAM_TOKEN`), `"raw"` (el token personal
  sin la palabra Bearer), `"lower"` (`bearer <token personal>` en minúsculas). En el log, `auth`
  guarda el nombre del modo (`ok`, `none`, `team`, `raw`, `lower`, `custom`), nunca el valor.
- Opción `contentType?: string | null` (null = no mandar Content-Type).
- Guarda también en el log `content_type_resp` (el Content-Type de la respuesta). Sirve para
  saber si el cuerpo es JSON o texto.

## 2. Script `experimentos/01_entrada.ts`

Cada grupo es una `seq` propia que empieza con `reset(seq)`. Cada request lleva una `hipotesis`
específica y en español (qué espero aprender). Usa `firmar()` cuando quieras un control válido.
Tope total: 450 requests.

**A. Autenticación** (`seq: "auth"`): para cada ruta [`POST /msg` con `{"m":"PING;64"}`,
`POST /__reset`, `GET /health`, `GET /noexiste`, `GET /`] y cada modo de auth [`ok`, `none`,
`team`, `raw`, `lower`, `"Bearer xyz"`, `"Bearer "`, `"Basic abc"`].

**B. Métodos y rutas** (`seq: "rutas"`, auth ok): métodos [GET, POST, PUT, DELETE, PATCH, OPTIONS,
HEAD] × rutas [`/msg`, `/__reset`, `/health`, `/`, `/noexiste`, `/msg/`, `/MSG`, `/msg?x=1`,
`/health/`]. Para métodos con cuerpo, manda `{"m":"PING;64"}`.

**C. Forma del cuerpo en `POST /msg`** (`seq: "cuerpo"`): sin cuerpo; `""`; `not json`; `{}`;
`[]`; `null`; `{"m":null}`; `{"m":123}`; `{"m":[]}`; `{"m":""}`; `{"m":"PING;64","x":1}`;
`{"M":"PING;64"}`; `{"m":"PING;64"}` con Content-Type `text/plain` y sin Content-Type;
`{"m":" PING;64 "}`; `{"m":"PING;64;"}`; `{"m":"ping;64"}`; `{"m":"PING"}`; `{"m":"PING;"}`;
`{"m":";;;"}`; un `m` de 5.000 caracteres; JSON malformado `{"m":`.

**D. Integridad del control** (`seq: "control"`): primero `ALTA;Ana` firmado (crea AC-0001).
Luego `CONSULTA;AC-0001` con controles: el correcto, con cero a la izquierda (`014` si fuera 14),
`+N`, `-N`, `N.0`, ` N`, `N ` , vacío (`CONSULTA;AC-0001;`), sin campo de control
(`CONSULTA;AC-0001`), N+97, N−97 si es positivo, `1e1`, un número de 5 dígitos. Repite 3 de esos
casos con `ALTA` para ver si se comporta igual.

**E. Precedencia de errores** (`seq: "precedencia-<n>"`, una seq por caso, cada una con reset y
una ALTA firmada previa que crea AC-0001): mensajes con DOS fallas a la vez, para saber cuál gana:
1. comando desconocido + control inválido (`SALDOS;AC-0001;99`)
2. comando desconocido + control mal formado (`SALDOS;AC-0001;5X`)
3. aridad inválida + control inválido (`ALTA;Lucia;Gomez;99`)
4. aridad inválida + control mal formado (`ALTA;Lucia;Gomez;5X`)
5. cuenta inexistente + control inválido (`CONSULTA;AC-0009;` + control malo)
6. cuenta inexistente + control mal formado
7. límite excedido + control inválido (TRANSFER de 120000 con control malo)
8. comando desconocido + aridad rara (`SALDOS;a;b;c;d` firmado)
9. comando vacío (`;AC-0001` firmado) y mensaje solo con control (`14`)
10. DEPOSITO a cuenta inexistente firmado; DEPOSITO con monto `-5`, `0`, `abc`, `1.5`, `0100`,
    `999999999999` firmados
11. TRANSFER a sí misma, a destino inexistente, desde origen inexistente, con monto 0 (firmados)
12. ALTA con nombre vacío (`ALTA;`), con números (`ALTA;123`), con acentos (`ALTA;José`),
    con espacios (`ALTA;Ana Maria`) — firmados
13. ANULA de operación inexistente, de un depósito, con formato raro (`ANULA;XX-0001`) — firmados

**F. Descubrir comandos** (`seq: "comandos"`): para cada nombre de esta lista manda la versión
firmada con 1 argumento (`<CMD>;AC-0001`) y con 0 argumentos (`<CMD>`): RETIRO, RETIRAR, SALDO,
SALDOS, BAJA, CIERRE, CERRAR, LISTA, LISTAR, HISTORIAL, EXTRACTO, MOVIMIENTOS, BLOQUEO, BLOQUEAR,
DESBLOQUEO, AYUDA, HELP, VERSION, ECHO, RESET, INFO, STATUS, ESTADO, CUENTAS, PAGO, CREDITO,
DEBITO, ABONO, CARGO, LIMITE, TASA, INTERES, AUDITORIA, LOG, REPORTE, PING, ALTA, CONSULTA,
DEPOSITO, TRANSFER, ANULA. Un comando que NO responda E301 existe: márcalo.

## 3. Resultados

- Ejecuta: `node --env-file=.env experimentos/01_entrada.ts`. En consola imprime solo un resumen
  corto (contadores por grupo).
- Escribe `analisis/01_entrada.md` con una tabla por grupo:
  `id del log | request | status | cuerpo de respuesta | content-type`. Al final, una sección
  **"Hallazgos"** con lo que observaste, citando ids del log, y marcando cada hallazgo como
  "visto 1 vez" o "repetido". No inventes: si algo no está en los datos, no lo afirmes.
- En tu respuesta final dame solo: cuántos requests usaste, los 10 hallazgos más importantes (con
  ids) y cualquier cosa inesperada.
- No hagas commit.
