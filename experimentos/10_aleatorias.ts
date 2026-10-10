// Búsqueda a ciegas: ~25 secuencias aleatorias (6-12 mensajes) con semilla fija.
// Ejecutar UNA vez: node --env-file=.env experimentos/10_aleatorias.ts
// Después: DESDE_ID=<primer id> node --env-file=.env src/diff.ts http://localhost:8099
//
// Decisiones:
// - PRNG mulberry32 con semilla 42: reproducible sin dependencias. Se descartó Math.random (no tiene semilla).
// - Generación adaptativa: los ids AC-/OP- disponibles salen de las respuestas reales del original,
//   no de un modelo propio. Si usáramos la réplica para prever ids, heredaríamos sus errores.
//   Con la misma semilla y las mismas respuestas, la secuencia es idéntica.
// - HALT solo con 0 o 1 argumento (lo ya medido, ids 2516-2519). Nunca con 2+ argumentos ni con
//   palabras tipo "SI"/"CONFIRMA": E520 pide "reenvía con confirmación" y podría detener el servicio.
import { appendFileSync, writeFileSync } from "node:fs";
import { send, reset } from "../src/probe.ts";
import { firmar, control } from "../src/control.ts";

const TOPE = 250;
const N_SEC = 25;
const SEMILLA = 42;

function mulberry32(a: number) {
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rnd = mulberry32(SEMILLA);
const ent = (a: number, b: number) => a + Math.floor(rnd() * (b - a + 1)); // [a, b]
const elegir = <T>(xs: T[]): T => xs[Math.floor(rnd() * xs.length)];
const prob = (p: number) => rnd() < p;
function ponderado<T>(xs: [T, number][]): T {
  const tot = xs.reduce((s, [, w]) => s + w, 0);
  let r = rnd() * tot;
  for (const [x, w] of xs) if ((r -= w) < 0) return x;
  return xs[xs.length - 1][0];
}

// Montos: bordes del límite (50000), del largo (10 dígitos) y formas inválidas.
const MONTOS_OK = ["1", "99", "100", "49999", "50000", "50001", "99999999", "9999999999"];
const MONTOS_RAROS = ["0", "-1", "-50000", "abc", "1.5", "0100", "10000000000", "1e3", " 100"];
const NOMBRES = ["Ana", "Beto", "Ana", "José", "Ana Maria", "123", "AC-0001", "x"];
const DESCONOCIDOS = ["SALDO", "RETIRO", "CONSULTAR", "DEPOSITAR", "TRANSFERIR", "ANULAR", "ALTAS", "PINGG", "AYUDA", "HELP", "HALTT", "LISTA", "TRANSFERENCIA"];
const CUENTAS_FALSAS = ["AC-0099", "AC-9999", "ac-0001", "AC-1", "AC-00001", "XX-0001"];
const OPS_FALSAS = ["OP-0099", "op-0001", "OP-1", "AC-0001"];

const pad = (n: number) => String(n).padStart(4, "0");

// Longitudes fijadas de antemano para respetar el tope: 25 resets + mensajes <= 250.
const largos = Array.from({ length: N_SEC }, () => ent(6, 12));
while (largos.reduce((a, b) => a + b, 0) + N_SEC > TOPE) {
  const i = largos.indexOf(Math.max(...largos));
  largos[i]--;
}

const salida = new URL("../analisis/10_aleatorias_corrida.md", import.meta.url);
writeFileSync(
  salida,
  `# Secuencias aleatorias (semilla ${SEMILLA}) — corrida cruda\n\nCorrida: ${new Date().toISOString()}\n\n| seq | paso | id | tipo | mensaje | status | respuesta |\n|---|---|---|---|---|---|---|\n`,
);

let usados = 0, primerId = 0, ultimoId = 0;

type Estado = { cuentas: string[]; ops: string[] };
const cuenta = (e: Estado) => (e.cuentas.length && prob(0.85) ? elegir(e.cuentas) : elegir(CUENTAS_FALSAS));
const op = (e: Estado) => (e.ops.length && prob(0.85) ? elegir(e.ops) : prob(0.5) ? `OP-${pad(e.ops.length + 1)}` : elegir(OPS_FALSAS));
const montoAl = () => (prob(0.8) ? elegir(MONTOS_OK) : elegir(MONTOS_RAROS));
const otra = (e: Estado, no: string) => {
  const resto = e.cuentas.filter((c) => c !== no);
  return resto.length && prob(0.85) ? elegir(resto) : prob(0.5) ? no : elegir(CUENTAS_FALSAS);
};
const malControlValor = (p: string) => { const c = control(p); return `${p};${c >= 97 ? c - 1 : c + 1}`; };

// Devuelve [tipo, m tal cual se manda].
function generar(e: Estado): [string, string] {
  const tipo = ponderado<string>([
    ["ALTA", e.cuentas.length < 2 ? 6 : 2],
    ["DEPOSITO", e.cuentas.length ? 5 : 1],
    ["TRANSFER", e.cuentas.length >= 2 ? 5 : 1],
    ["CONSULTA", 3],
    ["ANULA", e.ops.length ? 3 : 1],
    ["PING", 0.7],
    ["HALT", 0.5],
    ["desconocido", 0.8],
    ["aridad", 0.8],
    ["control", 1],
    ["minusculas", 0.6],
  ]);
  const cmd = (t: string): string => {
    switch (t) {
      case "ALTA": return `ALTA;${elegir(NOMBRES)}`;
      case "DEPOSITO": return `DEPOSITO;${cuenta(e)};${montoAl()}`;
      case "TRANSFER": { const o = cuenta(e); return `TRANSFER;${o};${otra(e, o)};${montoAl()}`; }
      case "CONSULTA": return `CONSULTA;${cuenta(e)}`;
      case "ANULA": return `ANULA;${op(e)}`;
      case "PING": return "PING";
      case "HALT": return prob(0.7) ? `HALT;${cuenta(e)}` : "HALT";
      default: return cmd(elegir(["ALTA", "DEPOSITO", "TRANSFER", "CONSULTA", "ANULA"]));
    }
  };
  switch (tipo) {
    case "PING": {
      const v = ent(0, 3);
      return ["PING", v === 0 ? firmar("PING") : v === 1 ? "PING;65" : v === 2 ? "PING;XX" : "ping;64"];
    }
    case "desconocido": {
      const p = `${elegir(DESCONOCIDOS)}${prob(0.6) ? `;${cuenta(e)}` : ""}`;
      return ["desconocido", firmar(p)];
    }
    case "aridad": {
      const base = cmd(elegir(["ALTA", "DEPOSITO", "TRANSFER", "CONSULTA", "ANULA", "PING"]));
      const segs = base.split(";");
      const p = prob(0.5) && segs.length > 1 ? segs.slice(0, -1).join(";") : `${base};${elegir(["extra", "AC-0001", "100"])}`;
      return ["aridad", firmar(p)];
    }
    case "control": {
      const p = cmd("x");
      const v = ent(0, 4);
      const m = v <= 1 ? malControlValor(p) : v === 2 ? `${p};XX` : v === 3 ? `${p};0${control(p)}` : `${p};99`;
      return ["control", m];
    }
    case "minusculas": {
      const p = cmd("x");
      const [c, ...r] = p.split(";");
      return ["minusculas", firmar([c.toLowerCase(), ...r].join(";"))];
    }
    default:
      return [tipo, firmar(cmd(tipo))];
  }
}

for (let s = 0; s < N_SEC; s++) {
  const seq = `alea-${String(s + 1).padStart(2, "0")}`;
  if (usados + largos[s] + 1 > TOPE) throw new Error(`tope de ${TOPE}: no se corre ${seq}`);
  const r0 = await reset(seq);
  usados++;
  primerId ||= r0.id;
  ultimoId = r0.id;
  appendFileSync(salida, `| ${seq} | 0 | ${r0.id} | reset | POST /__reset | ${r0.status} | ${r0.raw} |\n`);
  const e: Estado = { cuentas: [], ops: [] };
  for (let paso = 1; paso <= largos[s]; paso++) {
    const [tipo, m] = generar(e);
    const r = await send({ seq, body: { m }, hipotesis: `aleatoria semilla ${SEMILLA}: paso ${paso} (${tipo}) de ${seq}` });
    usados++;
    ultimoId = r.id;
    const j = r.json as any;
    if (j?.cuentaId) e.cuentas.push(j.cuentaId);
    if (j?.operacionId) e.ops.push(j.operacionId);
    appendFileSync(salida, `| ${seq} | ${paso} | ${r.id} | ${tipo} | \`${m}\` | ${r.status} | ${r.raw.replace(/\|/g, "\\|")} |\n`);
  }
}

appendFileSync(salida, `\nRequests usados: ${usados} en ${N_SEC} secuencias (ids ${primerId}–${ultimoId})\n`);
console.log(`listo: ${usados} requests, ${N_SEC} secuencias, ids ${primerId}-${ultimoId}`);
