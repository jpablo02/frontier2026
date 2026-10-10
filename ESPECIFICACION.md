# Especificación del servicio "caja negra" (borrador)

Reto 2 · 10 oct 2026 · Dos versiones observadas (hora de Bogotá):
**v1** entre las 12:25 y las 15:51, y **v2** desde algún momento entre las 15:51 y las 16:01,
vigente al cierre. Las filas marcadas "(v1)" describen el comportamiento anterior y se conservan
como evidencia; **la versión vigente es la v2**. Los cambios están en la sección 6.

**Cómo leer este documento.** Cada fila cita los `id` de `experimentos.jsonl` que la prueban (un rango
`a-b` incluye todas las líneas intermedias). Confianza:
**confirmado** = al menos 2 líneas del log lo muestran; **probable** = una sola línea;
**supuesto** = no hay evidencia y es lo que hace la réplica (`src/replica.ts`) por defecto.
Los textos van literales: `"recieved"` está mal escrito en el original y `"comando desconocido "`
termina con un espacio. Todos los cuerpos de respuesta observados son JSON, salvo `HEAD` (vacío).

Notación de mensajes: `CMD;arg1;…;argN;control`. En los ejemplos, `<c>` es el control correcto.

## 1. Entrada

| ID | Comportamiento | Evidencia | Confianza |
|---|---|---|---|
| ENT-01 | Hay tres rutas: `POST /msg` (mensajes), `POST /__reset` y `GET /health`. `/__reset` y `/health` responden `200` `{"ok":true}` | 2, 34, 1, 22, 42, 50, 88 | confirmado |
| ENT-02 | Cualquier otro método o ruta (incluidos `GET /msg`, `PUT/DELETE/PATCH/OPTIONS` en las tres rutas, `/`, `/noexiste`) responde `404` `{"error":"E404","mensaje":"ruta desconocida"}` | 75, 77-80, 82-86, 89-93, 95-100, 102-107 | confirmado |
| ENT-03 | `HEAD` sobre cualquier ruta responde `404` con cuerpo vacío | 81, 87, 94, 101, 108, 115, 122, 129, 136 | confirmado |
| ENT-04 | La ruta tiene que ser exacta: con barra final (`/msg/`, `/health/`) es `404` E404 | 109-114, 130-135 | confirmado |
| ENT-05 | La ruta distingue mayúsculas: `POST /MSG` es `404` E404 | 117 | probable |
| ENT-06 | El query string se ignora: `POST /msg?x=1` se procesa como `POST /msg`; `GET /msg?x=1` sigue siendo `404` | 124, 123 | probable |
| ENT-07 | La ruta se evalúa antes que la autenticación: una ruta inexistente da `404` E404 con cualquier `Authorization` (correcta, ausente, otro token, sin `Bearer`, `bearer` en minúsculas, `Basic`) | 58-73 | confirmado |
| ENT-08 | En las tres rutas válidas, el header tiene que ser exactamente `Authorization: Bearer <token>`. Si falta, si el token es otro, si falta `Bearer `, si va `bearer` en minúsculas, si va `Bearer ` vacío o `Basic …`, responde `401` `{"error":"E001","mensaje":"no autorizado"}` | 35-41, 43-49, 51-57 | confirmado |
| ENT-09 | `/health` también exige autenticación | 51-57 | confirmado |
| ENT-10 | Cada token tiene su propio estado. El original acepta el token personal y rechaza el del equipo (`401`); por contrato del reto, la réplica acepta solo el token del equipo (`TEAM_TOKEN`) | 36, 44, 52 | confirmado (original) |
| ENT-11 | La autenticación se evalúa antes que el cuerpo (un cuerpo inválido sin token da `401`, no `400`) | — | supuesto |
| ENT-12 | El cuerpo se interpreta como JSON sin importar el `Content-Type` (con `text/plain` o sin header funciona igual) | 150, 151 | confirmado |
| ENT-13 | Sin cuerpo, cuerpo vacío, texto no JSON o JSON cortado: `400` `{"error":"E100","mensaje":"json inválido"}` | 138, 139, 140, 159, 506 | confirmado |
| ENT-14 | El JSON tiene que ser un objeto con la clave `m` (minúscula) de tipo string. `{}`, `[]`, `null`, `m` nulo, numérico o array, o la clave `M`: `400` `{"error":"E102","mensaje":"falta m"}` | 141-146, 149 | confirmado |
| ENT-15 | Las claves extra del objeto se ignoran | 148 | probable |
| ENT-16 | `m` no se recorta: `" PING;64 "` da `400` E201 (el control queda como `"64 "`) | 152 | probable |
| ENT-17 | No se vio límite de largo: un `m` de 5000 caracteres se procesa normal (da E103 porque no tiene `;`) | 158 | probable |
| ENT-18 | Límites de campos: el control tiene 1 o 2 dígitos (INT-04) y los montos, de 1 a 10 dígitos (CMD-DEP-02) | 171, 173, 376, 393 | confirmado |

## 2. Integridad

Cada mensaje termina con un dígito de control. El servicio lo recalcula sobre el resto del mensaje y
lo compara.

**Fórmula.** Sea `P` el mensaje sin el último segmento (sin `;control`):

1. Se pasa `P` a mayúsculas.
2. Se recorre carácter por carácter: cada letra `A`–`Z` se reemplaza por su posición (`A=1` … `Z=26`,
   en decimal, así que una letra puede aportar 1 o 2 cifras), cada dígito `0`–`9` queda igual y todo
   lo demás (`;`, `-`, espacios, letras con tilde) se descarta.
3. Las cifras se concatenan en un número entero `N`.
4. `control = 98 − ((N × 100) mod 97)`. El resultado siempre está entre 2 y 98.

**Ejemplo 1: `ALTA;Ana`** (el original acepta `ALTA;Ana;50`, id 23, y rechaza `ALTA;Ana;51`, id 24):

| Paso | Valor |
|---|---|
| Mayúsculas | `ALTA;ANA` |
| Se descarta `;` | `ALTAANA` |
| Letras → números | A=1, L=12, T=20, A=1, A=1, N=14, A=1 |
| Concatenación `N` | `1122011141` |
| `N × 100` | `112201114100` |
| `mod 97` | `48` |
| `98 − 48` | **`50`** |

**Ejemplo 2: `PING`** → P=16, I=9, N=14, G=7 → `N = 169147` → `N × 100 = 16914700` →
`16914700 mod 97 = 34` (97 × 174378 = 16914666) → `98 − 34 = 64`. Por eso los ejemplos usan `PING;64`.

| ID | Comportamiento | Evidencia | Confianza |
|---|---|---|---|
| INT-01 | `m` se parte por `;`. El primer segmento es el comando, el último es el control y los del medio son los argumentos | 21, 209, 324, 333 | confirmado |
| INT-02 | Si `m` no tiene ningún `;` (incluidos `""`, `"PING"`, `"14"`): `400` `{"error":"E103","mensaje":"falta control"}` | 147, 155, 158, 217 | confirmado |
| INT-03 | Si algún segmento está vacío (control vacío, `;` final, comando vacío, argumento vacío, `;;;`): `400` `{"error":"E104","mensaje":"segmento vacío"}` | 153, 156, 157, 169, 213, 241 | confirmado |
| INT-04 | El control tiene que ser un entero decimal de 1 o 2 dígitos, sin signo, sin cero a la izquierda, sin espacios, sin punto ni exponente. Si no: `400` `{"error":"E201","mensaje":"control mal formado"}`. Casos vistos: `5X`, `014`, `011`, `+14`, `-14`, `14.0`, `" 14"`, `"14 "`, `111`, `108`, `1e1`, `12345` | 18, 497, 163-168, 171-176, 184 | confirmado |
| INT-05 | Si el último segmento no es un número (por ejemplo `CONSULTA;AC-0001`, sin control), se toma como control y da E201 | 170 | probable |
| INT-06 | Un control bien formado que no coincide con la fórmula: `400` `{"error":"E202","mensaje":"control inválido"}`. Basta 1 de diferencia | 3, 24, 26, 28, 32, 482 | confirmado |
| INT-07 | Un control de 2 dígitos fuera del rango de la fórmula (`99`) se considera bien formado y da E202, no E201 | 180, 188 | confirmado |
| INT-08 | Todos los mensajes del log con control bien formado (salvo PING) dan E202 si y solo si no coinciden con la fórmula; las minúsculas valen igual que las mayúsculas (`CONSULTa;AC-0001;14`, `anula;OP-0001;72`) | 4, 5, 6, 7, 8, 12, 23, 25, 452, 491 | confirmado |
| INT-09 | `;` y `-` no cuentan para el control (`CONSULTA;AC-0001;14`) | 6, 162, 485 | confirmado |
| INT-10 | Los espacios no cuentan (`ALTA;Ana Maria;44`) | 244 | probable |
| INT-11 | Las letras con tilde no cuentan (`ALTA;José;61`, igual que `ALTA;Jos`) | 243 | probable |
| INT-12 | `PING` no valida el valor del control: `PING;65` responde `200` `{"pong":true}` (el correcto es 64) | 30, 504, 531 | confirmado |
| INT-13 | `PING` **no** valida el formato del control: `PING;XX` → `200` `{"pong":true}`, donde cualquier otro comando daría E201. PING se salta E201 y E202 (ver CMD-PING-03) | 30, 2555 | confirmado |
| INT-14 | Un `0` solo cuenta como control bien formado (y da E202, porque la fórmula nunca da 0) | — | supuesto |

## 3. Comandos

El nombre del comando no distingue mayúsculas (`ping`, `CONSULTa`, `anula`). Cada comando tiene una
cantidad fija de argumentos. Si no coincide: `400` `{"error":"E302","mensaje":"aridad inválida"}`.

| Comando | Argumentos | Éxito |
|---|---|---|
| `PING` | 0 | `200` `{"pong":true}` |
| `ALTA` | 1: nombre | `201` `{"cuentaId":"AC-0001"}` |
| `CONSULTA` | 1: cuenta | v2: `200` `{"cuenta_id":"AC-0001","saldo":"0.00"}` · v1: `"saldo":0` |
| `DEPOSITO` | 2: cuenta, monto | `200` `{"status":"recieved","operacionId":"OP-0001"}` |
| `HALT` | 1 | `409` `{"error":"E520","mensaje":"operación destructiva: detiene el servicio; reenvía con confirmación"}` (no hay respuesta de éxito conocida) |
| `TRANSFER` | 3: origen, destino, monto | `200` `{"status":"recieved","operacionId":"OP-0002"}` |
| `ANULA` | 1: operación | `200` `{"ok":true,"anulada":"OP-0003"}` |

| ID | Comportamiento | Evidencia | Confianza |
|---|---|---|---|
| CMD-00 | El comando no distingue mayúsculas | 12, 154, 452, 491 | confirmado |

### PING

| ID | Comportamiento | Evidencia | Confianza |
|---|---|---|---|
| CMD-PING-01 | `PING;<c>` → `200` `{"pong":true}`. No cambia el estado | 2, 29, 34, 481 | confirmado |
| CMD-PING-02 | Con un argumento (`PING;AC-0001;87`) → `400` E302 | 324 | probable |
| CMD-PING-03 | **PING no valida el control en absoluto**: ni su valor (`PING;65` → 200, control correcto 64) ni su formato (`PING;XX` → 200, donde cualquier otro comando daría E201) | 30, 2555 | confirmado |

### ALTA

| ID | Comportamiento | Evidencia | Confianza |
|---|---|---|---|
| CMD-ALTA-01 | `ALTA;<nombre>;<c>` crea una cuenta con saldo 0 → `201` `{"cuentaId":"AC-NNNN"}`, con 4 dígitos y numeración consecutiva desde `AC-0001` después de cada reset | 4, 5, 483, 484 | confirmado |
| CMD-ALTA-02 | El nombre es texto libre: acepta dígitos (`123`), tildes (`José`), espacios (`Ana Maria`) y algo con forma de cuenta (`AC-0001`) | 242, 243, 244, 326 | confirmado |
| CMD-ALTA-03 | La cuenta nueva tiene saldo 0 | 6, 162, 485 | confirmado |
| CMD-ALTA-04 | Sin nombre (`ALTA;85`) o con dos (`ALTA;Lucia;Gomez;11`) → `400` E302 | 21, 327, 500 | confirmado |
| CMD-ALTA-05 | Se aceptan nombres repetidos (cada alta crea una cuenta nueva) | — | supuesto |
| CMD-ALTA-06 | Pasado `AC-9999` la numeración sigue sin recortar (`AC-10000`) | — | supuesto |

### CONSULTA

| ID | Comportamiento | Evidencia | Confianza |
|---|---|---|---|
| CMD-CON-01 | **(v2, vigente)** `CONSULTA;<cuenta>;<c>` → `200` `{"cuenta_id":"<cuenta>","saldo":"<string>"}`. El saldo es un **string con 2 decimales**, con el valor interno dividido entre 100: 0 → `"0.00"`, 40000 → `"400.00"`, 12345 → `"123.45"`, -800 → `"-8.00"`. Ojo: aquí la clave es `cuenta_id`; en ALTA es `cuentaId` | 1825, 1828, 1832, 2237, 2377, 2381 | confirmado |
| CMD-CON-01-v1 | **(v1, hasta 15:51)** El saldo era un **entero**: `{"cuenta_id":"AC-0001","saldo":0}` | 6, 9, 20, 485, 488 | confirmado |
| CMD-CON-02 | Cuenta inexistente → `404` `{"error":"E401","mensaje":"cuenta inexistente"}` | 16, 27, 495 | confirmado |
| CMD-CON-03 | El id de cuenta tiene que ser exacto: `ac-0001`, `AC-1` y `AC-00001` dan E401 | 471, 475, 479 | confirmado |
| CMD-CON-04 | Sin argumento (`CONSULTA;11`) → `400` E302 | 329 | probable |

### DEPOSITO

| ID | Comportamiento | Evidencia | Confianza |
|---|---|---|---|
| CMD-DEP-01 | `DEPOSITO;<cuenta>;<monto>;<c>` suma el monto al saldo → `200` `{"status":"recieved","operacionId":"OP-NNNN"}` | 7, 19, 20, 486, 498, 499 | confirmado |
| CMD-DEP-02 | Monto válido: entero de 1 a 10 dígitos, sin cero a la izquierda. `9999999999` pasa; `10000000000`, `99999999999`, `100000000000` y `999999999999` dan `400` `{"error":"E303","mensaje":"monto inválido"}` | 376, 501, 393, 396, 399, 230 | confirmado |
| CMD-DEP-03 | Monto `0` → `400` E303 | 226, 384, 403 | confirmado |
| CMD-DEP-04 | Monto negativo (`-5`), no numérico (`abc`), decimal (`1.5`) o con cero a la izquierda (`0100`) → `400` E303. Cada forma se vio una vez | 225, 227, 228, 229 | probable |
| CMD-DEP-05 | El depósito no tiene límite propio: 500000, 900000, 999999999, 1000000000 y 9999999999 pasan | 204, 339, 370, 373, 376 | confirmado |
| CMD-DEP-06 | Cuenta inexistente → `404` E401 | 221 | probable |
| CMD-DEP-07 | Con un argumento o sin ninguno → `400` E302 | 330, 331 | confirmado |

### TRANSFER

| ID | Comportamiento | Evidencia | Confianza |
|---|---|---|---|
| CMD-TRF-01 | `TRANSFER;<origen>;<destino>;<monto>;<c>` resta del origen y suma al destino → `200` `{"status":"recieved","operacionId":"OP-NNNN"}` | 8, 9, 11, 12, 487, 488, 490, 491 | confirmado |
| CMD-TRF-02 | **(v2, vigente)** Límite por operación de **50000**, inclusivo: 49999 y 50000 pasan; 50001, 55000 y 59999 dan `422` `{"error":"E506","mensaje":"límite excedido"}` | 2347, 2352, 2357, 2362, 2367 | confirmado |
| CMD-TRF-02-v1 | **(v1, hasta 15:51)** El límite era 100000, inclusivo: 100000 pasaba; 100001, 105000, 110000, 119999 y 120000 daban E506 | 11, 366, 490, 340, 345, 350, 355, 10, 419, 489, 502 | confirmado |
| CMD-TRF-03 | **(v2, vigente)** El límite no es acumulado: dos transferencias de 30000 seguidas pasan | 2372, 2373 | confirmado |
| CMD-TRF-03-v1 | **(v1, hasta 15:51)** Tampoco era acumulado: dos de 60000, o una de 100000 y otra de 1, pasaban | 360, 361, 366, 367 | confirmado |
| CMD-TRF-04 | Origen igual a destino → `400` `{"error":"E304","mensaje":"origen y destino iguales"}` | 234, 411, 431 | confirmado |
| CMD-TRF-05 | Origen o destino inexistente → `404` `{"error":"E401","mensaje":"cuenta inexistente"}` | 235, 236, 423, 427 | confirmado |
| CMD-TRF-06 | Saldo del origen menor que el monto → `422` `{"error":"E507","mensaje":"saldo insuficiente"}` | 17, 380, 496 | confirmado |
| CMD-TRF-07 | Transferir exactamente el saldo disponible pasa | 445 | probable |
| CMD-TRF-08 | Monto `0` → `400` E303 (mismas reglas de monto que DEPOSITO) | 237, 407, 415 | confirmado |
| CMD-TRF-09 | Con 1 o 0 argumentos → `400` E302 | 332, 333 | confirmado |

### ANULA

| ID | Comportamiento | Evidencia | Confianza |
|---|---|---|---|
| CMD-ANU-01 | `ANULA;<OP-NNNN>;<c>` anula una operación → `200` `{"ok":true,"anulada":"<OP-NNNN>"}` | 14, 250, 438, 493 | confirmado |
| CMD-ANU-02 | Anular una transferencia devuelve el monto al origen y lo quita del destino | 14, 20, 438, 439, 440, 493, 499 | confirmado |
| CMD-ANU-03 | Anular un depósito resta el monto de la cuenta | 446, 447, 452, 453, 466, 467 | confirmado |
| CMD-ANU-04 | La reversión se aplica aunque deje un saldo negativo. En v1 se veía como `-800` y `-1000`; en v2, como `"-8.00"` y `"-10.00"` | 440, 447, 2237, 2244 | confirmado |
| CMD-ANU-05 | Una operación ya anulada → `200` `{"ok":false,"motivo":"ya anulada"}` (no es un error HTTP) | 15, 465, 494 | confirmado |
| CMD-ANU-06 | Operación inexistente (`OP-0009`, `XX-0001`, `AC-0001`) → `404` `{"error":"E402","mensaje":"operación inexistente"}` | 248, 251, 334 | confirmado |
| CMD-ANU-07 | El id de operación distingue mayúsculas: `op-0001` da E402 | 458 | probable |
| CMD-ANU-08 | Sin argumento (`ANULA;45`) → `400` E302 | 335 | probable |

### Comando desconocido

| ID | Comportamiento | Evidencia | Confianza |
|---|---|---|---|
| CMD-DES-01 | Un comando que no está en la tabla → `400` `{"error":"E301","mensaje":"comando desconocido "}` (con espacio final), con cualquier cantidad de argumentos. Probados: SALDOS, RETIRO, RETIRAR, SALDO, BAJA, CIERRE, CERRAR, LISTA, LISTAR, HISTORIAL, EXTRACTO, MOVIMIENTOS, BLOQUEO, BLOQUEAR, DESBLOQUEO, VERSION, ECHO, RESET, INFO, STATUS, ESTADO, CUENTAS, PAGO, CREDITO, DEBITO, ABONO, CARGO, LIMITE, TASA, INTERES, AUDITORIA, LOG, REPORTE | 13, 492, 209, 254-283, 288-323 | confirmado |
| CMD-DES-02 | `AYUDA` agrega una sugerencia: `{"error":"E301","mensaje":"comando desconocido ","sugerencia":"ANULA"}` | 284, 285, 503 | confirmado |
| CMD-DES-03 | `HELP` agrega `"sugerencia":"HALT"` | 286, 287 | confirmado |
| CMD-DES-04 | **Regla de la sugerencia: el comando real a distancia de edición (Levenshtein) <= 2.** CONSULTAR→CONSULTA, DEPOSITAR→DEPOSITO, TRANSFERIR→TRANSFER, ANULAR→ANULA, ALTAS→ALTA, PINGG→PING | 2507-2512 | confirmado |
| CMD-DES-06 | El umbral 2 es el único que explica los 8 casos con sugerencia (AYUDA, HELP y los 6 de CMD-DES-04) y a la vez deja sin sugerencia a los 33 nombres que no la recibieron (SALDO, BAJA, LISTA, INFO, PAGO, DEBITO, TASA, LOG estarían a distancia 3) | 254-323, 2507-2512 | confirmado |
| CMD-DES-09 | **Sin medir:** qué sugiere el original cuando dos comandos empatan en distancia (`ALT` está a 1 de ALTA y de HALT). La réplica devuelve el primero en el orden PING, ALTA, CONSULTA, DEPOSITO, TRANSFER, ANULA, HALT | — | supuesto |
| CMD-DES-07 | **`HALT` existe como comando**, aunque no aparezca en los ejemplos: lo revela la sugerencia de `HELP`. Con 1 argumento → `409` `{"error":"E520","mensaje":"operación destructiva: detiene el servicio; reenvía con confirmación"}`; sin argumentos → E302. No cambió el estado | 2516, 2518, 2519 | confirmado |
| CMD-DES-08 | No se mandó la confirmación que pide E520: el mensaje dice que detiene el servicio y no hay certeza de que `/__reset` lo repare. La réplica responde E520 siempre | 2518 | supuesto |
| CMD-DES-05 | `HALT` **sí es un comando** del original (ver CMD-DES-07): con 1 argumento responde `409` E520 y sin argumentos E302 | 2516, 2518 | confirmado |

## 4. Memoria entre requests

| ID | Comportamiento | Evidencia | Confianza |
|---|---|---|---|
| MEM-01 | El servicio guarda, por token, las cuentas con su saldo, las operaciones y si están anuladas, y dos contadores (`AC-`, `OP-`). `POST /__reset` lo borra todo: la primera alta después de un reset siempre es `AC-0001` | 1, 4, 22, 23, 160, 161, 480, 483 | confirmado |
| MEM-02 | El contador de cuentas solo avanza con un `ALTA` exitoso; un alta rechazada (E202) no consume número | 3, 4, 24, 25, 482, 483 | confirmado |
| MEM-03 | DEPOSITO y TRANSFER comparten el contador `OP-` | 7, 8, 11, 19, 486, 487, 490, 498 | confirmado |
| MEM-04 | Una operación rechazada no consume número de operación (E506, E507, E303) | 10, 11, 489, 490, 380, 381, 384, 385 | confirmado |
| MEM-05 | `ANULA` no consume número de operación | 389, 390, 463, 464 | confirmado |
| MEM-06 | Los saldos se acumulan entre requests: CONSULTA refleja depósitos, transferencias y anulaciones anteriores | 9, 12, 20, 439, 440, 467 | confirmado |
| MEM-07 | La marca "anulada" se recuerda: la segunda anulación da `ok:false`, aunque haya operaciones nuevas en medio | 15, 465, 494 | confirmado |
| MEM-08 | El límite de TRANSFER no recuerda transferencias anteriores (ver CMD-TRF-03). En v2 verificado con 30000+30000 | 2372, 2373 | confirmado |
| MEM-09 | Header `X-Req`: contador que aumenta en 1 con cada `POST /msg` autenticado, aunque responda error, y que **no** vuelve a cero con `/__reset`. No aparece en respuestas 401, 404, `/__reset` ni `/health`. El set no compara headers y la réplica no lo emite | 21, 23, 3, 138, 35, 75, 1, 50 | confirmado |
| MEM-10 | `X-Req` es un contador por token, no global | — | supuesto |

## 5. Errores

El servicio evalúa en este orden y responde con el **primer** error que encuentra. Las posiciones 1 y
2 dependen de la ruta; de la 3 a la 10 aplican a todo mensaje de `POST /msg`; la 11 depende del
comando.

| Pos. | Código | Status | Cuerpo exacto | Cuándo | Evidencia |
|---|---|---|---|---|---|
| 1 | E404 | 404 | `{"error":"E404","mensaje":"ruta desconocida"}` | Método o ruta no reconocidos (`HEAD`: cuerpo vacío) | 58, 75 |
| 2 | E001 | 401 | `{"error":"E001","mensaje":"no autorizado"}` | `Authorization` distinto de `Bearer <token>` | 35, 43 |
| 3 | E100 | 400 | `{"error":"E100","mensaje":"json inválido"}` | El cuerpo no es JSON | 138, 140 |
| 4 | E102 | 400 | `{"error":"E102","mensaje":"falta m"}` | No es un objeto con `m` string | 141, 144 |
| 5 | E103 | 400 | `{"error":"E103","mensaje":"falta control"}` | `m` sin `;` | 147, 155 |
| 6 | E104 | 400 | `{"error":"E104","mensaje":"segmento vacío"}` | Algún segmento vacío | 153, 156 |
| 7 | E201 | 400 | `{"error":"E201","mensaje":"control mal formado"}` | Control que no es entero de 1–2 dígitos. **PING se salta este paso** (id 2555) | 18, 163 |
| 8 | E202 | 400 | `{"error":"E202","mensaje":"control inválido"}` | Control que no coincide (salvo PING) | 3, 24 |
| 9 | E301 | 400 | `{"error":"E301","mensaje":"comando desconocido "}` (+ `"sugerencia"` si hay un comando real a distancia de edición ≤ 2; ver CMD-DES-04) | Comando que no existe | 13, 254 |
| 10 | E302 | 400 | `{"error":"E302","mensaje":"aridad inválida"}` | Cantidad de argumentos incorrecta | 21, 324 |
| 11a | E303 | 400 | `{"error":"E303","mensaje":"monto inválido"}` | DEPOSITO, TRANSFER | 225, 226 |
| 11b | E304 | 400 | `{"error":"E304","mensaje":"origen y destino iguales"}` | TRANSFER | 234, 411 |
| 11c | E401 | 404 | `{"error":"E401","mensaje":"cuenta inexistente"}` | CONSULTA, DEPOSITO, TRANSFER | 16, 27 |
| 11d | E506 | 422 | `{"error":"E506","mensaje":"límite excedido"}` | TRANSFER | 10, 340 |
| 11e | E507 | 422 | `{"error":"E507","mensaje":"saldo insuficiente"}` | TRANSFER | 17, 380 |
| 11f | E402 | 404 | `{"error":"E402","mensaje":"operación inexistente"}` | ANULA | 248, 251 |
| 11g | E520 | 409 | `{"error":"E520","mensaje":"operación destructiva: detiene el servicio; reenvía con confirmación"}` | HALT con 1 argumento | 2518 |
| — | — | 200 | `{"ok":false,"motivo":"ya anulada"}` | ANULA repetido (no es error HTTP) | 15, 465, 494 |

| ID | Comportamiento | Evidencia | Confianza |
|---|---|---|---|
| ERR-01 | Cada código responde con el status y el cuerpo exactos de la tabla (ids por código en la columna Evidencia) | 58, 75, 35, 43, 138, 140, 141, 144, 147, 155, 153, 156, 18, 163, 3, 24, 13, 254, 21, 324, 225, 226, 234, 411, 16, 27, 248, 251, 10, 340, 17, 380 | confirmado |
| ERR-02 | E404 antes que E001 | 59-65, 67-73 | confirmado |
| ERR-03 | E001 antes que E100 | — | supuesto |
| ERR-04 | E103 antes que E104: `m` vacío da E103 | 147 | probable |
| ERR-05 | E104 antes que E201: `PING;`, `CONSULTA;AC-0001;`, `PING;64;` | 153, 156, 169 | confirmado |
| ERR-06 | E104 antes que E301: un comando vacío (`;AC-0001;35`) da E104 | 213 | probable |
| ERR-07 | E201 antes que E301, E302 y E401 | 184, 192, 200 | probable (una línea por par) |
| ERR-08 | E202 antes que E301 (`SALDOS;AC-0001;99`) | 180 | probable |
| ERR-09 | E202 antes que E302 (`ALTA;Lucia;Gomez;99`) | 188 | probable |
| ERR-10 | E202 antes que E401 (cuenta inexistente con control incorrecto) | 28, 196 | confirmado |
| ERR-11 | E202 antes que E506 | 205 | probable |
| ERR-12 | E301 antes que E302: un comando desconocido da E301 con cualquier cantidad de argumentos | 209, 254, 255, 284, 285 | confirmado |
| ERR-13 | E302 antes que las validaciones del comando (DEPOSITO y TRANSFER con argumentos de menos dan E302, no E303/E401) | 330, 332 | confirmado |
| ERR-14 | E303 antes que E401 (`DEPOSITO;AC-0009;0`, `TRANSFER;AC-0009;AC-0002;0`) | 403, 407 | confirmado |
| ERR-15 | E303 antes que E304 (`TRANSFER;AC-0001;AC-0001;0`) | 415 | probable |
| ERR-16 | E304 antes que E401 (`TRANSFER;AC-0009;AC-0009;100`) | 411 | probable |
| ERR-17 | E304 antes que E506 (`TRANSFER;AC-0001;AC-0001;120000`) | 431 | probable |
| ERR-18 | E401 antes que E506 (`TRANSFER;AC-0009;AC-0002;120000`) | 423 | probable |
| ERR-19 | E401 (destino) antes que E507 (`TRANSFER;AC-0001;AC-0009;500` con saldo 0) | 427 | probable |
| ERR-20 | E506 antes que E507 (`TRANSFER;AC-0001;AC-0002;120000` con saldo 0) | 419 | probable |
| ERR-21 | No se observó ningún `500`. Si la réplica falla internamente responde `500` `{"error":"E500","mensaje":"error interno"}` y sigue viva | — | supuesto |

## 6. Cambios durante el día

El proveedor desplegó una **versión 2** sin avisar qué cambió (ticket #FR-0153, abierto a las 15:30;
el cambio real llegó más tarde). El ticket dice que **cambiaron 3 comportamientos**.

**Cómo lo detectamos.** Un canario (`experimentos/canary.ts`) repetía 26 mensajes fijos cada 10
minutos contra el original y los comparaba con una línea base. A las 16:01 reportó 9 respuestas
distintas (`analisis/canary.md`). Acto seguido repetimos contra la v2 **las 451 llamadas
registradas de la v1** y comparamos una por una (`experimentos/06_regrabar_v2.ts`): 28 diferencias,
todas explicadas por los dos cambios de abajo (`analisis/06_cambios_v2_completa_1601.md`).

| ID | Comportamiento | Evidencia | Confianza |
|---|---|---|---|
| CAM-01 | Entre las 12:25 y las 15:51 el servicio no cambió: el canario dio "sin cambios" en las vueltas de 15:00, 15:10, 15:20, 15:30, 15:40 y 15:51, y dos regrabaciones completas (15:36 y 15:39, 451 requests cada una) dieron 0 diferencias | 2-21, 1255-1792 | confirmado |
| CAM-02 | El cambio ocurrió entre las 15:51 y las 16:01. El contador del header `X-Req` volvió a 1 en la primera llamada posterior, señal de que reiniciaron el proceso | 1793, 1794 | confirmado |
| CAM-03 | **Cambio 1 — límite de TRANSFER: de 100000 a 50000**, inclusivo. 50000 pasa; 50001, 55000 y 59999 dan E506. Sigue siendo por operación, no acumulado (30000+30000 pasa) | 2347, 2352, 2357, 2362, 2367, 2372, 2373 | confirmado |
| CAM-04 | **Cambio 2 — formato del saldo en CONSULTA: de entero a string con 2 decimales**, con el valor interno dividido entre 100 (40000 → `"400.00"`, 12345 → `"123.45"`, -800 → `"-8.00"`). El valor interno no cambió: los montos de DEPOSITO y TRANSFER se siguen dando en la unidad entera y el límite se evalúa sobre ella | 1825, 1828, 1832, 2237, 2377, 2381 | confirmado |
| CAM-05 | **El tercer cambio anunciado no se encontró.** Las 451 llamadas de la v1 repetidas contra la v2 solo mostraron esos 2 cambios, así que el tercero está en un comportamiento que nunca le preguntamos a la v1. Zonas candidatas sin medir en v1: límite acumulado por encima de 60000, nombres repetidos en ALTA, reglas de sugerencia para comandos mal escritos y el comando `HALT` que revela la sugerencia de `HELP` | 1793-2381 | supuesto |
| CAM-06 | Lo demás se mantuvo igual: autenticación, rutas, métodos, validación del mensaje y del control, códigos y textos de error, orden de evaluación, numeración de `AC-`/`OP-`, anulaciones y PING sin validar el valor del control | 1795-2246 | confirmado |

## 7. Riesgos

Comportamientos que la réplica copia porque el set los exige, pero que un cliente nuevo no debería
heredar.

| ID | Comportamiento | Evidencia | Confianza |
|---|---|---|---|
| RIE-01 | **PING no valida el control.** Un cliente puede creer que su firma está bien porque PING responde. Cierre: validar el control en todos los comandos | 30, 504, 531 | confirmado |
| RIE-02 | **ANULA deja saldos negativos.** Se puede gastar un depósito y luego anularlo. Cierre: rechazar la anulación si el saldo no alcanza, o retener los fondos | 440, 447 | confirmado |
| RIE-03 | **El límite (50000 en v2) es por operación.** Se esquiva partiendo el monto. Cierre: límite acumulado por cuenta y por día | 2372, 2373, 360, 361 | confirmado |
| RIE-04 | **El depósito no tiene límite** (hasta 9999999999 por operación). Cierre: límite de depósito y revisión de montos altos | 376, 501 | confirmado |
| RIE-05 | **El control es un checksum, no una firma.** La fórmula se dedujo de 20 ejemplos; cualquiera con un token puede firmar. Cierre: HMAC con clave secreta | 23-32 | confirmado |
| RIE-06 | **Textos con errores que los clientes copiarían**: `"recieved"`, `"comando desconocido "` con espacio final, y claves inconsistentes (`cuentaId` en ALTA, `cuenta_id` en CONSULTA). Cierre: que los clientes usen solo el código `error` y una versión nueva de la API con los textos corregidos | 7, 13, 4, 6 | confirmado |
| RIE-07 | **La sugerencia de HELP revela un nombre interno (`HALT`)**, confirmado como comando: responde E520 y dice que detiene el servicio. Un atacante puede descubrirlo probando nombres parecidos. Cierre: quitar las sugerencias o limitarlas a comandos no destructivos | 286, 287, 2518 | confirmado |
| RIE-08 | **Las rutas se pueden enumerar:** una ruta válida sin token da 401 y una inexistente da 404. Cierre: autenticar antes de resolver la ruta | 35, 59 | confirmado |
| RIE-09 | **Ids predecibles** (`AC-0001`, `OP-0001`, consecutivos): facilitan adivinar cuentas y operaciones ajenas. Cierre: ids aleatorios y control de dueño | 4, 5, 7, 8 | confirmado |
| RIE-10 | **`X-Req` expone cuántos mensajes mandó el token y sobrevive al reset.** Cierre: quitarlo o que sea un id aleatorio por request | 21, 23 | confirmado |
