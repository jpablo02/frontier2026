// Segunda búsqueda a ciegas: ~20 secuencias aleatorias (10-16 mensajes), semilla 1337, sesgo a titulares.
// Ejecutar UNA vez: node --env-file=.env experimentos/12_aleatorias2.ts
// Después: DESDE_ID=<primer id> node --env-file=.env src/diff.ts http://localhost:8099
//
// Decisiones (además de las de 10_aleatorias.ts, que se mantienen):
// - Semilla 1337 en vez de 42: recorre combinaciones nuevas y sigue siendo reproducible.
// - Sesgo a titulares (CAM-05 mostró que importan): cada ALTA reutiliza un nombre ya usado en la
//   secuencia (55%), una variante parecida (30%: mayúsculas, espacios, tildes) o uno nuevo del pool
//   (15%). Así salen 3+ cuentas con el mismo titular y pares "casi iguales". Se descartó sortear
//   nombres uniformes de una lista: con 8 nombres casi nunca coinciden dos cuentas en la misma secuencia.
// - Los depósitos son grandes (hasta 9999999999) para que las transferencias sobre el límite lleguen
//   a evaluar el titular y no mueran en E507. Se descartó usar los montos de la ronda 1: con saldo
//   chico, E507 tapaba la regla del titular (justo lo que pasó con el id 2921).
// - TRANSFER elige el par con prioridad a "mismo titular" o "titular parecido", en cualquier sentido,
//   con montos alrededor de 50000. ANULA prefiere transferencias, y a veces repite una ya anulada.
// - Largos 10-16 (los tests difíciles llegan a 12); 20 secuencias, tope 300 requests con resets.
// - HALT solo con 0 o 1 argumento, igual que antes (E520 pide confirmación: no arriesgarse).
import { appendFileSync, writeFileSync } from "node:fs";
import { send, reset } from "../src/probe.ts";
import { firmar, control } from "../src/control.ts";

const TOPE = 300;
const N_SEC = 20;
const SEMILLA = 1337;
const SIMULAR = process.env.SIMULAR === "1"; // prueba en seco del generador, sin tocar el original

function mulberry32(a: number) {
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rnd = mulberry32(SEMILLA);
const ent = (a: number, b: number) => a + Math.floor(rnd() * (b - a + 1));
const elegir = <T>(xs: T[]): T => xs[Math.floor(rnd() * xs.length)];
const prob = (p: number) => rnd() < p;
function ponderado<T>(xs: [T, number][]): T {
  const tot = xs.reduce((s, [, w]) => s + w, 0);
  let r = rnd() * tot;
  for (const [x, w] of xs) if ((r -= w) < 0) return x;
  return xs[xs.length - 1][0];
}

const NOMBRES = ["Ana", "Beto", "José", "Ana Maria", "123", "0", "007", "AC-0001", "x", "Ñandú"];
// Variantes de un nombre: lo que un comparador "flojo" (trim, minúsculas, sin tildes) igualaría.
function variante(n: string): string {
  const sinTilde = n.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return elegir([
    n.toLowerCase(), n.toUpperCase(), `${n} `, ` ${n}`, `${n}  `, sinTilde,
    n.replace(/a/g, "á").replace(/n/g, "ñ"), // Ana -> Áñá-ish
    n.length > 1 ? n[0] + n.slice(1).toUpperCase() : n + n,
    n.replace(/ /g, ""), n.replace(/ /g, "  "),
  ]);
}
const MONTOS_DEP = ["100000", "900000", "999999999", "9999999999", "50001", "50000", "1000", "60000"];
const MONTOS_TRF = ["49999", "50000", "50001", "50001", "60000", "100000", "999999999", "1", "25000"];
const MONTOS_RAROS = ["0", "-50001", "50000.5", "050001", "10000000000"];
const CUENTAS_FALSAS = ["AC-0099", "ac-0001", "AC-1"];
const OPS_FALSAS = ["OP-0099", "op-0001"];
const DESCONOCIDOS = ["TITULAR", "CUENTAS", "ALTAS", "TRANSFERIR", "SALDO"];
const pad = (n: number) => String(n).padStart(4, "0");

const largos = Array.from({ length: N_SEC }, () => ent(10, 16));
while (largos.reduce((a, b) => a + b, 0) + N_SEC > TOPE) largos[largos.indexOf(Math.max(...largos))]--;

type OpInfo = { id: string; tipo: "DEP" | "TRF"; rel?: string };
type Estado = { cuentas: string[]; titular: Map<string, string>; nombres: string[]; ops: OpInfo[]; anuladas: Set<string> };

// Relación entre titulares, solo para la hipótesis (no para predecir respuestas).
function relacion(e: Estado, a: string, b: string): string {
  const ta = e.titular.get(a), tb = e.titular.get(b);
  if (ta === undefined || tb === undefined) return "cuenta desconocida";
  if (ta === tb) return "mismo titular exacto";
  const norm = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().replace(/\s+/g, " ").toLowerCase();
  return norm(ta) === norm(tb) ? `titular parecido (${JSON.stringify(ta)} vs ${JSON.stringify(tb)})` : "titular distinto";
}

function nombreAlta(e: Estado): string {
  const r = rnd();
  if (e.nombres.length && r < 0.55) return elegir(e.nombres);
  if (e.nombres.length && r < 0.85) return variante(elegir(e.nombres));
  return prob(0.06) ? "" : elegir(NOMBRES); // "" fuerza E104
}

function parTransfer(e: Estado): [string, string] {
  const c = e.cuentas;
  if (c.length < 2) return [c[0] ?? elegir(CUENTAS_FALSAS), elegir(CUENTAS_FALSAS)];
  const pares: [string, string][] = [];
  for (const a of c) for (const b of c) if (a !== b) pares.push([a, b]);
  const mismos = pares.filter(([a, b]) => e.titular.get(a) === e.titular.get(b));
  const parecidos = pares.filter(([a, b]) => relacion(e, a, b).startsWith("titular parecido"));
  const r = rnd();
  if (mismos.length && r < 0.45) return elegir(mismos);
  if (parecidos.length && r < 0.75) return elegir(parecidos);
  if (prob(0.05)) { const a = elegir(c); return [a, a]; } // E304
  return elegir(pares);
}

function generar(e: Estado): [string, string] {
  const tipo = ponderado<string>([
    ["ALTA", e.cuentas.length < 3 ? 8 : 2.5],
    ["DEPOSITO", e.cuentas.length ? 3.5 : 0.3],
    ["TRANSFER", e.cuentas.length >= 2 ? 6 : 0.3],
    ["CONSULTA", 2.5],
    ["ANULA", e.ops.length ? 3 : 0.3],
    ["PING", 0.3],
    ["HALT", 0.2],
    ["desconocido", 0.3],
    ["aridad", 0.4],
    ["control", 0.4],
    ["minusculas", 0.4],
  ]);
  const cuenta = () => (e.cuentas.length && prob(0.9) ? elegir(e.cuentas) : elegir(CUENTAS_FALSAS));
  let nota = "";
  const cmd = (t: string): string => {
    switch (t) {
      case "ALTA": { const n = nombreAlta(e); nota = `titular ${JSON.stringify(n)}`; return `ALTA;${n}`; }
      case "DEPOSITO": return `DEPOSITO;${cuenta()};${prob(0.92) ? elegir(MONTOS_DEP) : elegir(MONTOS_RAROS)}`;
      case "TRANSFER": {
        const [o, d] = parTransfer(e);
        nota = relacion(e, o, d);
        return `TRANSFER;${o};${d};${prob(0.92) ? elegir(MONTOS_TRF) : elegir(MONTOS_RAROS)}`;
      }
      case "CONSULTA": return `CONSULTA;${cuenta()}`;
      case "ANULA": {
        const trf = e.ops.filter((o) => o.tipo === "TRF");
        const ya = e.ops.filter((o) => e.anuladas.has(o.id));
        let id: string;
        if (ya.length && prob(0.2)) { id = elegir(ya).id; nota = "repite una anulación"; }
        else if (trf.length && prob(0.75)) { const o = elegir(trf); id = o.id; nota = `anula transferencia (${o.rel})`; }
        else if (e.ops.length && prob(0.85)) { id = elegir(e.ops).id; nota = "anula operación"; }
        else id = prob(0.5) ? `OP-${pad(e.ops.length + 1)}` : elegir(OPS_FALSAS);
        return `ANULA;${id}`;
      }
      case "PING": return "PING";
      case "HALT": return prob(0.7) ? `HALT;${cuenta()}` : "HALT";
      default: return cmd(elegir(["ALTA", "DEPOSITO", "TRANSFER", "CONSULTA", "ANULA"]));
    }
  };
  let m: string;
  switch (tipo) {
    case "PING": m = elegir([firmar("PING"), "PING;65", "ping;64"]); break;
    case "desconocido": m = firmar(`${elegir(DESCONOCIDOS)}${prob(0.6) ? `;${cuenta()}` : ""}`); break;
    case "aridad": {
      const segs = cmd(elegir(["ALTA", "DEPOSITO", "TRANSFER", "CONSULTA", "ANULA"])).split(";");
      m = firmar(prob(0.5) && segs.length > 1 ? segs.slice(0, -1).join(";") : [...segs, elegir(["Ana", "AC-0001", "100"])].join(";"));
      break;
    }
    case "control": { const p = cmd("x"); const c = control(p); m = `${p};${c >= 97 ? c - 1 : c + 1}`; break; }
    case "minusculas": { const [c, ...r] = cmd("x").split(";"); m = firmar([c.toLowerCase(), ...r].join(";")); break; }
    default: m = firmar(cmd(tipo));
  }
  return [nota ? `${tipo}: ${nota}` : tipo, m];
}

const salida = new URL("../analisis/12_aleatorias2_corrida.md", import.meta.url);
const escribir = (s: string) => (SIMULAR ? process.stdout.write(s) : appendFileSync(salida, s));
if (!SIMULAR)
  writeFileSync(salida, `# Secuencias aleatorias 2 (semilla ${SEMILLA}, sesgo a titulares) — corrida cruda\n\nCorrida: ${new Date().toISOString()}\n\n| seq | paso | id | tipo | mensaje | status | respuesta |\n|---|---|---|---|---|---|---|\n`);

// Simulación: responde como lo haría un servicio sano, solo para ver la mezcla del generador.
let simId = 0, simC = 0, simO = 0;
async function enviar(seq: string, m: string, hip: string) {
  if (!SIMULAR) return send({ seq, body: { m }, hipotesis: hip });
  const c = m.split(";")[0];
  const json = c === "ALTA" && m.split(";").length === 3 && m.split(";")[1] ? { cuentaId: `AC-${pad(++simC)}` }
    : (c === "DEPOSITO" || c === "TRANSFER") && prob(0.6) ? { operacionId: `OP-${pad(++simO)}` } : {};
  return { id: ++simId, status: 0, raw: JSON.stringify(json), json, xReq: null };
}

let usados = 0, primerId = 0, ultimoId = 0;
for (let s = 0; s < N_SEC; s++) {
  const seq = `alea2-${String(s + 1).padStart(2, "0")}`;
  if (usados + largos[s] + 1 > TOPE) throw new Error(`tope de ${TOPE}: no se corre ${seq}`);
  const r0 = SIMULAR ? { id: ++simId, status: 200, raw: "{}" } : await reset(seq);
  simC = simO = 0;
  usados++;
  primerId ||= r0.id;
  ultimoId = r0.id;
  escribir(`| ${seq} | 0 | ${r0.id} | reset | POST /__reset | ${r0.status} | ${r0.raw} |\n`);
  const e: Estado = { cuentas: [], titular: new Map(), nombres: [], ops: [], anuladas: new Set() };
  for (let paso = 1; paso <= largos[s]; paso++) {
    const [tipo, m] = generar(e);
    const r = await enviar(seq, m, `aleatoria semilla ${SEMILLA}, sesgo a titulares: paso ${paso} de ${largos[s]} de ${seq} (${tipo})`);
    usados++;
    ultimoId = r.id;
    const j = r.json as any;
    const segs = m.split(";");
    if (j?.cuentaId) {
      e.cuentas.push(j.cuentaId);
      e.titular.set(j.cuentaId, segs[1]);
      if (!e.nombres.includes(segs[1])) e.nombres.push(segs[1]);
    }
    if (j?.operacionId) e.ops.push({ id: j.operacionId, tipo: segs[0].toUpperCase() === "TRANSFER" ? "TRF" : "DEP", rel: segs.length === 5 ? relacion(e, segs[1], segs[2]) : undefined });
    if (j?.anulada) e.anuladas.add(j.anulada);
    escribir(`| ${seq} | ${paso} | ${r.id} | ${tipo.replace(/\|/g, "\\|")} | \`${m}\` | ${r.status} | ${r.raw.replace(/\|/g, "\\|")} |\n`);
  }
}

escribir(`\nRequests usados: ${usados} en ${N_SEC} secuencias (ids ${primerId}–${ultimoId})\n`);
console.log(`listo: ${usados} requests, ${N_SEC} secuencias, ids ${primerId}-${ultimoId}`);
