// Tanda 2: entrada (auth, rutas, cuerpo), integridad del control, precedencia de errores y
// descubrimiento de comandos. Ejecutar: node --env-file=.env experimentos/01_entrada.ts
import { mkdirSync, writeFileSync } from "node:fs";
import { send, reset, type SendOpts } from "../src/probe.ts";
import { control, firmar } from "../src/control.ts";

type Fila = { grupo: string; id: number; desc: string; status: number; cuerpo: string; ct: string };
const filas: Fila[] = [];
const CON_CUERPO = new Set(["POST", "PUT", "PATCH", "DELETE"]);

async function q(grupo: string, desc: string, opts: SendOpts) {
  const method = opts.method ?? "POST";
  if (!CON_CUERPO.has(method)) delete opts.body;
  try {
    const r = await send(opts);
    filas.push({ grupo, id: r.id, desc, status: r.status, cuerpo: r.raw.slice(0, 160), ct: "" });
    return r;
  } catch (e) {
    filas.push({ grupo, id: -1, desc, status: 0, cuerpo: `ERROR CLIENTE: ${(e as Error).message}`, ct: "" });
    return null;
  }
}
const msg = (m: string) => ({ m });

// --- A. Autenticación ---
{
  const seq = "auth";
  await reset(seq);
  const rutas: [string, string, unknown?][] = [
    ["POST", "/msg", msg("PING;64")],
    ["POST", "/__reset"],
    ["GET", "/health"],
    ["GET", "/noexiste"],
    ["GET", "/"],
  ];
  const modos = ["ok", "none", "team", "raw", "lower", "Bearer xyz", "Bearer ", "Basic abc"];
  for (const [method, path, body] of rutas)
    for (const auth of modos)
      await q("A", `${method} ${path} auth=${auth}`, {
        seq, method, path, body, auth,
        hipotesis: `respuesta de ${method} ${path} con auth '${auth}'`,
      });
}

// --- B. Métodos y rutas ---
{
  const seq = "rutas";
  await reset(seq);
  const metodos = ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"];
  const rutas = ["/msg", "/__reset", "/health", "/", "/noexiste", "/msg/", "/MSG", "/msg?x=1", "/health/"];
  for (const path of rutas)
    for (const method of metodos) {
      if (method === "POST" && path === "/__reset") continue; // ya cubierto
      await q("B", `${method} ${path}`, {
        seq, method, path, body: msg("PING;64"),
        hipotesis: `qué responde ${method} ${path}`,
      });
    }
}

// --- C. Forma del cuerpo ---
{
  const seq = "cuerpo";
  await reset(seq);
  const casos: [string, Partial<SendOpts>][] = [
    ["sin cuerpo", {}],
    ["cuerpo vacío", { body: "" }],
    ["texto no JSON", { body: "not json" }],
    ["{}", { body: {} }],
    ["[]", { body: [] }],
    ["null", { body: "null", contentType: "application/json" }],
    ['m null', { body: { m: null } }],
    ["m número", { body: { m: 123 } }],
    ["m array", { body: { m: [] } }],
    ["m vacío", { body: msg("") }],
    ["clave extra", { body: { m: "PING;64", x: 1 } }],
    ["clave M mayúscula", { body: { M: "PING;64" } }],
    ["content-type text/plain", { body: JSON.stringify(msg("PING;64")), contentType: "text/plain" }],
    ["sin content-type", { body: JSON.stringify(msg("PING;64")), contentType: null }],
    ["espacios alrededor", { body: msg(" PING;64 ") }],
    ["; final", { body: msg("PING;64;") }],
    ["ping minúsculas", { body: msg("ping;64") }],
    ["PING sin control", { body: msg("PING") }],
    ["PING; control vacío", { body: msg("PING;") }],
    [";;;", { body: msg(";;;") }],
    ["m de 5000 chars", { body: msg("A".repeat(5000)) }],
    ["JSON malformado", { body: '{"m":', contentType: "application/json" }],
  ];
  for (const [desc, o] of casos)
    await q("C", desc, { seq, ...o, hipotesis: `forma del cuerpo: ${desc}` });
}

// --- D. Integridad del control ---
{
  const seq = "control";
  await reset(seq);
  await q("D", "ALTA;Ana firmado", { seq, body: msg(firmar("ALTA;Ana")), hipotesis: "crear AC-0001 para probar controles" });
  const base = "CONSULTA;AC-0001";
  const c = control(base);
  const variantes: [string, string][] = [
    ["correcto", `${base};${c}`],
    ["cero a la izquierda", `${base};0${c}`],
    ["con +", `${base};+${c}`],
    ["negativo", `${base};-${c}`],
    ["decimal .0", `${base};${c}.0`],
    ["espacio antes", `${base}; ${c}`],
    ["espacio después", `${base};${c} `],
    ["vacío", `${base};`],
    ["sin campo de control", base],
    ["N+97", `${base};${c + 97}`],
    ["notación 1e1", `${base};1e1`],
    ["5 dígitos", `${base};12345`],
  ];
  if (c - 97 > 0) variantes.push(["N-97", `${base};${c - 97}`]);
  for (const [desc, m] of variantes)
    await q("D", `CONSULTA control ${desc}: ${m}`, { seq, body: msg(m), hipotesis: `formato del control: ${desc}` });
  const alta = "ALTA;Beto";
  const ca = control(alta);
  for (const [desc, m] of [["cero a la izquierda", `${alta};0${ca}`], ["con +", `${alta};+${ca}`], ["N+97", `${alta};${ca + 97}`]])
    await q("D", `ALTA control ${desc}: ${m}`, { seq, body: msg(m), hipotesis: `formato del control en ALTA: ${desc}` });
}

// --- E. Precedencia de errores ---
{
  const casos: [string, string[]][] = [
    ["desconocido + control inválido", ["SALDOS;AC-0001;99"]],
    ["desconocido + control mal formado", ["SALDOS;AC-0001;5X"]],
    ["aridad + control inválido", ["ALTA;Lucia;Gomez;99"]],
    ["aridad + control mal formado", ["ALTA;Lucia;Gomez;5X"]],
    ["inexistente + control inválido", [`CONSULTA;AC-0009;${(control("CONSULTA;AC-0009") + 1) % 100}`]],
    ["inexistente + control mal formado", ["CONSULTA;AC-0009;5X"]],
    ["límite + control inválido", [firmar("DEPOSITO;AC-0001;500000"), `TRANSFER;AC-0001;AC-0002;120000;${(control("TRANSFER;AC-0001;AC-0002;120000") + 1) % 100}`]],
    ["desconocido + aridad rara", [firmar("SALDOS;a;b;c;d")]],
    ["comando vacío", [firmar(";AC-0001")]],
    ["solo control", ["14"]],
    ["DEPOSITO a inexistente", [firmar("DEPOSITO;AC-0009;100")]],
    ["DEPOSITO montos raros", ["-5", "0", "abc", "1.5", "0100", "999999999999"].map((x) => firmar(`DEPOSITO;AC-0001;${x}`))],
    ["TRANSFER casos borde", [firmar("TRANSFER;AC-0001;AC-0001;100"), firmar("TRANSFER;AC-0001;AC-0009;100"), firmar("TRANSFER;AC-0009;AC-0001;100"), firmar("TRANSFER;AC-0001;AC-0002;0")]],
    ["ALTA nombres raros", ["ALTA;", "ALTA;123", "ALTA;José", "ALTA;Ana Maria"].map(firmar)],
    ["ANULA casos borde", [firmar("ANULA;OP-0009"), firmar("DEPOSITO;AC-0001;1000"), firmar("ANULA;OP-0001"), firmar("ANULA;XX-0001")]],
  ];
  let n = 0;
  for (const [desc, mensajes] of casos) {
    const seq = `precedencia-${++n}`;
    await reset(seq);
    await q("E", `[${desc}] setup ALTA;Ana`, { seq, body: msg(firmar("ALTA;Ana")), hipotesis: "setup: crear AC-0001" });
    await q("E", `[${desc}] setup ALTA;Beto`, { seq, body: msg(firmar("ALTA;Beto")), hipotesis: "setup: crear AC-0002" });
    for (const m of mensajes)
      await q("E", `[${desc}] ${m}`, { seq, body: msg(m), hipotesis: `precedencia/borde: ${desc}` });
  }
}

// --- F. Descubrir comandos ---
{
  const seq = "comandos";
  await reset(seq);
  await q("F", "setup ALTA;Ana", { seq, body: msg(firmar("ALTA;Ana")), hipotesis: "setup: crear AC-0001" });
  const nombres = ["RETIRO", "RETIRAR", "SALDO", "SALDOS", "BAJA", "CIERRE", "CERRAR", "LISTA", "LISTAR",
    "HISTORIAL", "EXTRACTO", "MOVIMIENTOS", "BLOQUEO", "BLOQUEAR", "DESBLOQUEO", "AYUDA", "HELP", "VERSION",
    "ECHO", "RESET", "INFO", "STATUS", "ESTADO", "CUENTAS", "PAGO", "CREDITO", "DEBITO", "ABONO", "CARGO",
    "LIMITE", "TASA", "INTERES", "AUDITORIA", "LOG", "REPORTE", "PING", "ALTA", "CONSULTA", "DEPOSITO",
    "TRANSFER", "ANULA"];
  for (const c of nombres) {
    await q("F", `${c} con 1 arg`, { seq, body: msg(firmar(`${c};AC-0001`)), hipotesis: `¿existe el comando ${c}? (1 argumento)` });
    await q("F", `${c} sin args`, { seq, body: msg(firmar(c)), hipotesis: `¿existe el comando ${c}? (0 argumentos)` });
  }
}

// --- Reporte ---
mkdirSync(new URL("../analisis/", import.meta.url), { recursive: true });
const esc = (s: string) => s.replace(/\|/g, "\\|").replace(/\n/g, "⏎");
let md = "# Tanda 2 — resultados crudos\n\nGenerado por `experimentos/01_entrada.ts`. Cada fila cita su `id` en `experimentos.jsonl`.\n";
for (const g of ["A", "B", "C", "D", "E", "F"]) {
  md += `\n## Grupo ${g}\n\n| id | caso | status | cuerpo |\n|---|---|---|---|\n`;
  for (const f of filas.filter((x) => x.grupo === g)) md += `| ${f.id} | ${esc(f.desc)} | ${f.status} | ${esc(f.cuerpo)} |\n`;
}
writeFileSync(new URL("../analisis/01_entrada.md", import.meta.url), md);
const porGrupo = Object.fromEntries(["A", "B", "C", "D", "E", "F"].map((g) => [g, filas.filter((f) => f.grupo === g).length]));
console.log("requests por grupo (sin contar resets):", porGrupo, "errores cliente:", filas.filter((f) => f.id === -1).length);
