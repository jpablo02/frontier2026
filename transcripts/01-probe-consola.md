 ▀▀█  v1.1.0
 █▀ █ escape interrupt · ctrl+c/ctrl+d clear/exit · / commands · ! bash · ctrl+o more
 Press ctrl+o to show full startup help and loaded resources.

 Pi can explain its own features and look up its docs. Ask it how to use or extend Pi.


[Context]
  CLAUDE.md


 <file name="D:\proyectos2026\frontier2026\prompts\01_probe.md">
 # Prompt 01 — Cliente de sondeo (`probe`)

 Contexto: lee DISENO.md y frontier-reto-2/README.md. Estamos en el Reto 2 (caja negra).

 REGLA DURA: no leas, no abras, no imprimas ni hagas cat de .env ni de ningún archivo .env*.
 Los tokens llegan por process.env al ejecutar con node --env-file=.env. Nunca imprimas un token.

 Qué construir

 Node 24 con TypeScript nativo (sin build, sin dependencias nuevas; usa fetch nativo). Los imports
 llevan la extensión .ts.

 ### src/probe.ts — única puerta al servicio original

 - URL base: https://caja-negra-production-c64f.up.railway.app. Token: process.env.CAJA_NEGRA_TOKEN.
   Si falta, error claro sin imprimir nada sensible.
 - export async function send(opts) con:
   { seq: string, hipotesis: string, method?: string = "POST", path?: string = "/msg",    body?: unknown | string (string = cuerpo crudo, se manda tal cual), auth?:
   "ok" | "none" | string    (string = header Authorization literal), conclusion?: string }.
   Devuelve { id, status, raw, json (o null), xReq }.
 - export async function reset(seq): POST /__reset con el token. Se registra en el log igual
   que cualquier request (hipotesis: "reset de secuencia").
 - Límite de velocidad: como máximo 8 requests por segundo en total (cola global).
 - Si la respuesta trae el header X-Frontier-Infra: rate-limit, NO se registra como experimento:
   espera 2 s y reintenta (máximo 5 veces).
 - Timeout de 10 s por request.

 ### Log experimentos.jsonl (en la raíz; es entregable)

 Una línea JSON por request, escrita apenas llega la respuesta (append, nunca reescribir):

 ```json
   {"id":1,"seq":"s1","x_req":1,"hipotesis":"…","request":{"m":"PING;64"},"status":200,"response":{"pong":true},"conclusion":"…",
    "metodo":"POST","ruta":"/msg","auth":"ok","ts":"2026-10-10T16:00:00.000Z"}
 ```

 - id: consecutivo global. Al arrancar, continúa desde la última línea existente del archivo.
 - x_req: valor del header X-Req (número si es numérico, si no string, o null).
 - request: el cuerpo enviado (objeto si era JSON; string si era crudo; null si no hubo cuerpo).
 - response: el JSON parseado; si el cuerpo no es JSON, el texto exacto como string.
 - Campos extra metodo, ruta, auth ("ok", "none" o "custom"; nunca el valor) y ts.
 - Escritura segura ante concurrencia: un solo escritor en serie.

 ### src/control.ts

 export function control(msg: string): number: dado el mensaje sin el último campo, calcula
 98 − ((N × 100) mod 97), donde N es el mensaje en mayúsculas con cada letra convertida a su
 posición (A=1…Z=26), los dígitos tal cual y descartando todo lo demás. Usa BigInt.
 export function firmar(msg: string): string devuelve msg + ";" + control(msg).

 ### experimentos/00_ejemplos.ts — primer experimento

 1. reset("ejemplos-replay") y luego manda en orden los 20 request de
    frontier-reto-2/pruebas/ejemplos.jsonl con seq: "ejemplos-replay" e hipotesis
    "reproducción del ejemplo oficial n=<n>".
 2. Compara cada respuesta con la esperada (status + cuerpo JSON sin importar el orden de las claves)
    e imprime una tabla n | esperado | obtenido | OK/DIFF.
 3. Además, para 5 mensajes nuevos firmados con firmar() (ej. ALTA;Ana, ALTA;Bruno,
    CONSULTA;AC-0003), manda la versión firmada y la versión con control+1, con hipotesis
    "confirmar algoritmo de control", y reporta si la firmada pasa y la otra da E202.

 Ejecutar con: node --env-file=.env experimentos/00_ejemplos.ts

 ### Entrega

 - Corre 00_ejemplos.ts una vez y muéstrame la tabla resultante.
 - No hagas commit. No modifiques DISENO.md ni el material del reto.

 </file>
 Implementa este prompt.



 $ cd /d/proyectos2026/frontier2026 && ls && cat DISENO.md | head -80 && cat frontier-reto-2/README.md && ls frontier-reto-2 frontier-reto-2/pruebas && head -c 1500
 frontier-reto-2/pruebas/ejemplos.jsonl && node -v && ls .env* | head

 ... (246 earlier lines, ctrl+o to expand)
 {"n":10,"id":10,"seq":"ejemplos","request":{"m":"TRANSFER;AC-0001;AC-0002;100000;12"},"status":200,"response":{"status":"recieved","operacionId":"OP-0003"}}
 {"n":11,"id":11,"seq":"ejemplos","request":{"m":"CONSULTa;AC-0001;14"},"status":200,"response":{"cuenta_id":"AC-0001","saldo":110000}}
 {"n":12,"id":12,"seq":"ejemplos","requesv24.11.0
 .env
 .env.example

 Took 0.4s


 I need to implement the checksum logic using N*100 mod 97, normalizing case before processing, plus a global rate limiter capped at 8 requests per second with
 serialized log writing, while making sure not to touch the .env file.


 $ cd /d/proyectos2026/frontier2026 && mkdir -p src experimentos && cat > src/control.ts <<'EOF'
 export function control(msg: string): number {
   let digits = "";
   for (const ch of msg.toUpperCase()) {
     if (ch >= "A" && ch <= "Z") digits += String(ch.charCodeAt(0) - 64);
     else if (ch >= "0" && ch <= "9") digits += ch;
   }
   const n = BigInt(digits || "0");
   return 98 - Number((n * 100n) % 97n);
 }

 export function firmar(msg: string): string {
   return msg + ";" + control(msg);
 }
 EOF
 cat > src/probe.ts <<'EOF'
 import { appendFileSync, existsSync, readFileSync } from "node:fs";

 const BASE = "https://caja-negra-production-c64f.up.railway.app";
 const LOG = new URL("../experimentos.jsonl", import.meta.url);
 const MIN_GAP_MS = 125; // 8 rps
 const TIMEOUT_MS = 10_000;
 const MAX_RETRIES = 5;

 export interface SendOpts {
   seq: string;
   hipotesis: string;
   method?: string;
   path?: string;
   body?: unknown;
   auth?: "ok" | "none" | string;
   conclusion?: string;
 }
 export interface SendResult {
   id: number;
   status: number;
   raw: string;
   json: unknown | null;
   xReq: number | string | null;
 }

 function token(): string {
   const t = process.env.CAJA_NEGRA_TOKEN;
   if (!t) throw new Error("Falta CAJA_NEGRA_TOKEN (ejecuta con node --env-file=.env)");
   return t;
 }

 // --- cola global de velocidad ---
 let nextSlot = 0;
 async function throttle(): Promise<void> {
   const now = Date.now();
   const at = Math.max(now, nextSlot);
   nextSlot = at + MIN_GAP_MS;
   if (at > now) await new Promise((r) => setTimeout(r, at - now));
 }

 // --- log serial ---
 let nextId: number | null = null;
 function initId(): number {
   if (nextId !== null) return nextId;
   let last = 0;
   if (existsSync(LOG)) {
     const lines = readFileSync(LOG, "utf8").split("\n").filter((l) => l.trim());
     if (lines.length) {
       try {
         last = Number(JSON.parse(lines[lines.length - 1]).id) || 0;
       } catch {
         last = lines.length;
       }
     }
   }
   nextId = last + 1;
   return nextId;
 }
 function appendLog(entry: Record<string, unknown>): number {
   // síncrono: en un solo hilo, asigna id y escribe de forma atómica y en serie
   const id = initId();
   nextId = id + 1;
   appendFileSync(LOG, JSON.stringify({ id, ...entry }) + "\n");
   return id;
 }

 function tryJson(s: string): unknown | null {
   try {
     return JSON.parse(s);
   } catch {
     return null;
   }
 }

 export async function send(opts: SendOpts): Promise<SendResult> {
   const method = opts.method ?? "POST";
   const path = opts.path ?? "/msg";
   const auth = opts.auth ?? "ok";
   const headers: Record<string, string> = {};
   if (auth === "ok") headers.Authorization = `Bearer ${token()}`;
   else if (auth !== "none") headers.Authorization = auth;

   let payload: string | undefined;
   if (opts.body !== undefined) {
     if (typeof opts.body === "string") payload = opts.body;
     else {
       payload = JSON.stringify(opts.body);
       headers["Content-Type"] = "application/json";
     }
   }

   let res: Response | undefined;
   let raw = "";
   for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
     await throttle();
     res = await fetch(BASE + path, {
       method,
       headers,
       body: payload,
       signal: AbortSignal.timeout(TIMEOUT_MS),
     });
     raw = await res.text();
     if (res.headers.get("X-Frontier-Infra") === "rate-limit" && attempt < MAX_RETRIES) {
       await new Promise((r) => setTimeout(r, 2000));
       continue;
     }
     break;
   }
   if (!res) throw new Error("sin respuesta");

   const json = tryJson(raw);
   const xr = res.headers.get("X-Req");
   const xReq = xr === null ? null : xr.trim() !== "" && !isNaN(Number(xr)) ? Number(xr) : xr;
   const reqLog = opts.body === undefined ? null : opts.body;
   const id = appendLog({
     seq: opts.seq,
     x_req: xReq,
     hipotesis: opts.hipotesis,
     request: reqLog,
     status: res.status,
     response: json !== null ? json : raw,
     conclusion: opts.conclusion ?? "",
     metodo: method,
     ruta: path,
     auth: auth === "ok" ? "ok" : auth === "none" ? "none" : "custom",
     ts: new Date().toISOString(),
   });
   return { id, status: res.status, raw, json, xReq };
 }

 export function reset(seq: string): Promise<SendResult> {
   return send({ seq, hipotesis: "reset de secuencia", path: "/__reset" });
 }
 EOF
 cat > experimentos/00_ejemplos.ts <<'EOF'
 import { readFileSync } from "node:fs";
 import { send, reset } from "../src/probe.ts";
 import { firmar } from "../src/control.ts";

 function canon(v: unknown): unknown {
   if (Array.isArray(v)) return v.map(canon);
   if (v && typeof v === "object")
     return Object.fromEntries(Object.entries(v).sort(([a], [b]) => (a < b ? -1 : 1)).map(([k, x]) => [k, canon(x)]));
   return v;
 }
 const same = (a: unknown, b: unknown) => JSON.stringify(canon(a)) === JSON.stringify(canon(b));
 const short = (s: number, b: unknown) => `${s} ${JSON.stringify(b)}`;

 const SEQ = "ejemplos-replay";
 const ej = readFileSync(new URL("../frontier-reto-2/pruebas/ejemplos.jsonl", import.meta.url), "utf8")
   .split("\n").filter((l) => l.trim()).map((l) => JSON.parse(l));

 await reset(SEQ);
 console.log("n | esperado | obtenido | OK/DIFF");
 let ok = 0;
 for (const e of ej) {
   const r = await send({ seq: SEQ, hipotesis: `reproducción del ejemplo oficial n=${e.n}`, body: e.request });
   const got = r.json ?? r.raw;
   const good = r.status === e.status && same(got, e.response);
   if (good) ok++;
   console.log(`${e.n} | ${short(e.status, e.response)} | ${short(r.status, got)} | ${good ? "OK" : "DIFF"}`);
 }
 console.log(`\nReplay: ${ok}/${ej.length} OK\n`);

 const SEQ2 = "control-confirm";
 await reset(SEQ2);
 const msgs = ["ALTA;Ana", "ALTA;Bruno", "CONSULTA;AC-0003", "PING", "ALTA;Carla"];
 console.log("mensaje | firmado | control+1");
 for (const m of msgs) {
   const f = firmar(m);
   const c = Number(f.split(";").pop());
   const bad = `${m};${(c + 1) % 100}`;
   const r1 = await send({ seq: SEQ2, hipotesis: "confirmar algoritmo de control", body: { m: f } });
   const r2 = await send({ seq: SEQ2, hipotesis: "confirmar algoritmo de control", body: { m: bad } });
   const e202 = (r2.json as any)?.error === "E202";
   const pasa = (r1.json as any)?.error !== "E202";
   console.log(`${m} | ${f} → ${short(r1.status, r1.json ?? r1.raw)} ${pasa ? "PASA" : "FALLA"} | ${bad} → ${short(r2.status, r2.json ?? r2.raw)} ${e202 ? "E202" :
 "NO-E202"}`);
 }
 EOF
 git check-ignore experimentos.jsonl; node --env-file=.env experimentos/00_ejemplos.ts (timeout 120s)

 ... (26 earlier lines, ctrl+o to expand)
 ALTA;Bruno | ALTA;Bruno;78 → 201 {"cuentaId":"AC-0002"} PASA | ALTA;Bruno;79 → 400 {"error":"E202","mensaje":"control inválido"} E202
 CONSULTA;AC-0003 | CONSULTA;AC-0003;8 → 404 {"error":"E401","mensaje":"cuenta inexistente"} PASA | CONSULTA;AC-0003;9 → 400 {"error":"E202","mensaje":"control
 inválido"} E202
 PING | PING;64 → 200 {"pong":true} PASA | PING;65 → 200 {"pong":true} NO-E202
 ALTA;Carla | ALTA;Carla;9 → 201 {"cuentaId":"AC-0003"} PASA | ALTA;Carla;10 → 400 {"error":"E202","mensaje":"control inválido"} E202

 Took 8.1s


 Implementé src/control.ts, src/probe.ts y experimentos/00_ejemplos.ts, y corrí el experimento una vez con node --env-file=.env. No hice commit. No toqué DISENO.md ni
 el material del reto. Tampoco leí .env.

 Replay de los 20 ejemplos: 20/20 OK. El status y el cuerpo coinciden en todos (n=1 a n=20).

 Confirmación del control (5 mensajes nuevos):

 ┌──────────────────┬───────────────────────────────────────────────────────────────┬─────────────────────────────────────┐
 │ Mensaje          │ Firmado                                                       │ Control+1                           │
 ├──────────────────┼───────────────────────────────────────────────────────────────┼─────────────────────────────────────┤
 │ ALTA;Ana         │ ;50 → 201, pasa                                               │ ;51 → E202                          │
 ├──────────────────┼───────────────────────────────────────────────────────────────┼─────────────────────────────────────┤
 │ ALTA;Bruno       │ ;78 → 201, pasa                                               │ ;79 → E202                          │
 ├──────────────────┼───────────────────────────────────────────────────────────────┼─────────────────────────────────────┤
 │ CONSULTA;AC-0003 │ ;8 → 404 E401, pasa (la firma es válida; la cuenta no existe) │ ;9 → E202                           │
 ├──────────────────┼───────────────────────────────────────────────────────────────┼─────────────────────────────────────┤
 │ PING             │ ;64 → 200, pasa                                               │ ;65 → 200 {"pong":true}, no da E202 │
 ├──────────────────┼───────────────────────────────────────────────────────────────┼─────────────────────────────────────┤
 │ ALTA;Carla       │ ;9 → 201, pasa                                                │ ;10 → E202                          │
 └──────────────────┴───────────────────────────────────────────────────────────────┴─────────────────────────────────────┘

 El algoritmo de control queda confirmado para ALTA y CONSULTA. PING no valida el control: con PING;65 responde pong igual. Esto coincide con la hipótesis del log de
 ejemplo, "responde pong aunque el último campo no sea un número".

 Otros detalles:
 - experimentos.jsonl quedó en la raíz. No está ignorado por git, que es lo que se quiere porque es entregable.
 - En send, reset y el log, x_req se guarda como número si el header es numérico, y el campo auth nunca guarda el valor del token.
 - El log se escribe con appendFileSync en un solo hilo, así que no hay escrituras concurrentes. El id continúa desde la última línea del archivo.