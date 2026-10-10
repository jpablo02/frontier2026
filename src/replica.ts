// Réplica del servicio "banco" de la caja negra. Un proceso, estado en memoria, sin dependencias.
// Cada regla sale de una línea de experimentos.jsonl / frontier-reto-2/pruebas/ejemplos.jsonl.
import { createServer } from "node:http";
import { control } from "./control.ts";

const PORT = Number(process.env.PORT ?? 8080);
const TOKEN = process.env.TEAM_TOKEN;
if (!TOKEN) {
  console.error("Falta TEAM_TOKEN");
  process.exit(1);
}

// ---------- estado ----------
type Op =
  | { tipo: "DEPOSITO"; cuenta: string; monto: number; anulada: boolean }
  | { tipo: "TRANSFER"; origen: string; destino: string; monto: number; anulada: boolean };
const estado = { cuentas: new Map<string, number>(), ops: new Map<string, Op>(), nCuentas: 0, nOps: 0 };
function reset() {
  estado.cuentas.clear();
  estado.ops.clear();
  estado.nCuentas = 0;
  estado.nOps = 0;
}
const pad = (n: number) => String(n).padStart(4, "0");

// SUPUESTO: el límite de TRANSFER es por operación (no acumulado) e inclusivo: 100000 pasa (ej. 10),
// 120000 no (ej. 9). El corte exacto entre 100001 y 119999 no está medido.
const LIMITE_TRANSFER = 100000;
// SUPUESTO: monto válido = entero sin ceros a la izquierda de hasta 9 dígitos (999999999999 falla, 500000 pasa).
const MONTO_RE = /^[1-9]\d{0,8}$/;

// ---------- pipeline de validación ----------
type Resp = { status: number; body: unknown };
type Ctx = { raw: string; json?: any; m: string; segs: string[]; cmd: string; args: string[]; ctrl: string };
type Paso = { codigo: string; status: number; mensaje: string; chequeo: (c: Ctx) => boolean; extra?: (c: Ctx) => object };

const ctx = (raw: string): Ctx => ({ raw, m: "", segs: [], cmd: "", args: [], ctrl: "" });
function parse(c: Ctx) {
  try { c.json = JSON.parse(c.raw); } catch { c.json = undefined; }
}
const jsonOk = (c: Ctx) => { parse(c); return c.json !== undefined; };
const tieneM = (c: Ctx) => c.json !== null && typeof c.json === "object" && !Array.isArray(c.json) && typeof c.json.m === "string";

// Sugerencias observadas (ids 284-287). SUPUESTO: no hay más; el algoritmo real no se conoce.
const SUGERENCIAS: Record<string, string> = { AYUDA: "ANULA", HELP: "HALT" };
const ARIDAD: Record<string, number> = { PING: 0, ALTA: 1, CONSULTA: 1, DEPOSITO: 2, TRANSFER: 3, ANULA: 1 };

// Orden: primero lo que se evalúa para cualquier mensaje. Los datos lo fijan así:
// E100 < E102 < E103 < E104 < E201 < E202 < E301 < E302 (ids 138-159, 163-176, 178-217, 254-335).
const PASOS_MENSAJE: Paso[] = [
  { codigo: "E100", status: 400, mensaje: "json inválido", chequeo: (c) => !jsonOk(c) },
  { codigo: "E102", status: 400, mensaje: "falta m", chequeo: (c) => !tieneM(c) },
  {
    codigo: "E103", status: 400, mensaje: "falta control",
    chequeo: (c) => { c.m = c.json.m; return !c.m.includes(";"); },
  },
  {
    codigo: "E104", status: 400, mensaje: "segmento vacío",
    chequeo: (c) => { c.segs = c.m.split(";"); return c.segs.some((s) => s === ""); },
  },
  {
    codigo: "E201", status: 400, mensaje: "control mal formado",
    chequeo: (c) => { c.ctrl = c.segs[c.segs.length - 1]; return !/^(0|[1-9]\d?)$/.test(c.ctrl); },
  },
  {
    codigo: "E202", status: 400, mensaje: "control inválido",
    // SUPUESTO: PING no valida el valor del control (PING;65 → 200 con control correcto 64, id 30); con los
    // demás comandos 1 de diferencia ya es E202 (ids 28, 32). No se sabe si es PING o todo comando sin args.
    chequeo: (c) => c.segs[0].toUpperCase() !== "PING" && control(c.segs.slice(0, -1).join(";")) !== Number(c.ctrl),
  },
  {
    codigo: "E301", status: 400, mensaje: "comando desconocido ", // espacio final: es parte del original
    chequeo: (c) => {
      c.cmd = c.segs[0].toUpperCase();
      c.args = c.segs.slice(1, -1);
      return !(c.cmd in ARIDAD);
    },
    extra: (c) => (SUGERENCIAS[c.cmd] ? { sugerencia: SUGERENCIAS[c.cmd] } : {}),
  },
  { codigo: "E302", status: 400, mensaje: "aridad inválida", chequeo: (c) => c.args.length !== ARIDAD[c.cmd] },
];

const monto = (s: string) => Number(s);
const cuentaNo = (s: string) => !estado.cuentas.has(s);
// Validaciones propias de cada comando, también en orden.
// SUPUESTO: dentro de un comando, formato de monto (E303) antes que existencia de cuenta (E401); los datos
// solo muestran cada error por separado.
const PASOS_COMANDO: Record<string, Paso[]> = {
  PING: [],
  ALTA: [],
  CONSULTA: [{ codigo: "E401", status: 404, mensaje: "cuenta inexistente", chequeo: (c) => cuentaNo(c.args[0]) }],
  DEPOSITO: [
    { codigo: "E303", status: 400, mensaje: "monto inválido", chequeo: (c) => !MONTO_RE.test(c.args[1]) },
    { codigo: "E401", status: 404, mensaje: "cuenta inexistente", chequeo: (c) => cuentaNo(c.args[0]) },
  ],
  TRANSFER: [
    { codigo: "E303", status: 400, mensaje: "monto inválido", chequeo: (c) => !MONTO_RE.test(c.args[2]) },
    // SUPUESTO: E304 antes que E401 (ej. AC-0009→AC-0009 no medido).
    { codigo: "E304", status: 400, mensaje: "origen y destino iguales", chequeo: (c) => c.args[0] === c.args[1] },
    { codigo: "E401", status: 404, mensaje: "cuenta inexistente", chequeo: (c) => cuentaNo(c.args[0]) || cuentaNo(c.args[1]) },
    // SUPUESTO: límite (E506) antes que saldo (E507); ningún dato tiene ambos a la vez.
    { codigo: "E506", status: 422, mensaje: "límite excedido", chequeo: (c) => monto(c.args[2]) > LIMITE_TRANSFER },
    { codigo: "E507", status: 422, mensaje: "saldo insuficiente", chequeo: (c) => estado.cuentas.get(c.args[0])! < monto(c.args[2]) },
  ],
  ANULA: [{ codigo: "E402", status: 404, mensaje: "operación inexistente", chequeo: (c) => !estado.ops.has(c.args[0]) }],
};

function error(p: Paso, c: Ctx): Resp {
  return { status: p.status, body: { error: p.codigo, mensaje: p.mensaje, ...(p.extra?.(c) ?? {}) } };
}
function primerError(pasos: Paso[], c: Ctx): Resp | null {
  for (const p of pasos) if (p.chequeo(c)) return error(p, c);
  return null;
}

// ---------- ejecución de comandos (ya validados) ----------
const nuevaOp = (op: Op) => { const id = `OP-${pad(++estado.nOps)}`; estado.ops.set(id, op); return id; };
const EJECUTAR: Record<string, (c: Ctx) => Resp> = {
  PING: () => ({ status: 200, body: { pong: true } }),
  ALTA: () => {
    const id = `AC-${pad(++estado.nCuentas)}`;
    estado.cuentas.set(id, 0);
    return { status: 201, body: { cuentaId: id } };
  },
  CONSULTA: (c) => ({ status: 200, body: { cuenta_id: c.args[0], saldo: estado.cuentas.get(c.args[0]) } }),
  DEPOSITO: (c) => {
    const [cuenta, m] = [c.args[0], monto(c.args[1])];
    estado.cuentas.set(cuenta, estado.cuentas.get(cuenta)! + m);
    return { status: 200, body: { status: "recieved", operacionId: nuevaOp({ tipo: "DEPOSITO", cuenta, monto: m, anulada: false }) } };
  },
  TRANSFER: (c) => {
    const [origen, destino, m] = [c.args[0], c.args[1], monto(c.args[2])];
    estado.cuentas.set(origen, estado.cuentas.get(origen)! - m);
    estado.cuentas.set(destino, estado.cuentas.get(destino)! + m);
    return { status: 200, body: { status: "recieved", operacionId: nuevaOp({ tipo: "TRANSFER", origen, destino, monto: m, anulada: false }) } };
  },
  ANULA: (c) => {
    const id = c.args[0];
    const op = estado.ops.get(id)!;
    if (op.anulada) return { status: 200, body: { ok: false, motivo: "ya anulada" } };
    op.anulada = true;
    // Revierte el efecto (ej. 13→19: el destino vuelve a 40000 + 700).
    // SUPUESTO: la reversión se aplica aunque deje saldo negativo.
    if (op.tipo === "DEPOSITO") estado.cuentas.set(op.cuenta, estado.cuentas.get(op.cuenta)! - op.monto);
    else {
      estado.cuentas.set(op.origen, estado.cuentas.get(op.origen)! + op.monto);
      estado.cuentas.set(op.destino, estado.cuentas.get(op.destino)! - op.monto);
    }
    return { status: 200, body: { ok: true, anulada: id } };
  },
};

export function manejarMsg(raw: string): Resp {
  const c = ctx(raw);
  return primerError(PASOS_MENSAJE, c) ?? primerError(PASOS_COMANDO[c.cmd], c) ?? EJECUTAR[c.cmd](c);
}

// ---------- HTTP ----------
const NO_ENCONTRADA: Resp = { status: 404, body: { error: "E404", mensaje: "ruta desconocida" } };
const NO_AUTORIZADO: Resp = { status: 401, body: { error: "E001", mensaje: "no autorizado" } };

// Rutas exactas (sensibles a mayúsculas, sin barra final; el query se ignora: ids 109-136).
const RUTAS: Record<string, (raw: string) => Resp> = {
  "POST /msg": manejarMsg,
  "POST /__reset": () => {
    reset();
    return { status: 200, body: { ok: true } };
  },
  "GET /health": () => ({ status: 200, body: { ok: true } }),
};

// Un error imprevisto no debe tumbar el proceso: perdería el estado a mitad de una prueba.
process.on("uncaughtException", (e) => console.error("uncaughtException:", e));
process.on("unhandledRejection", (e) => console.error("unhandledRejection:", e));

createServer((req, res) => {
  const chunks: Buffer[] = [];
  req.on("data", (d) => chunks.push(d));
  req.on("end", () => {
    const ruta = RUTAS[`${req.method} ${(req.url ?? "").split("?")[0]}`];
    let r: Resp;
    if (!ruta) r = NO_ENCONTRADA; // ruta/método desconocido: 404 sin mirar la auth (ids 58-73, 75-136)
    else if (req.headers.authorization !== `Bearer ${TOKEN}`) r = NO_AUTORIZADO;
    else {
      try {
        r = ruta(Buffer.concat(chunks).toString("utf8"));
      } catch (e) {
        // SUPUESTO: el original nunca mostró un 500; esto solo evita que un caso imprevisto tumbe el proceso.
        console.error("error interno:", e);
        r = { status: 500, body: { error: "E500", mensaje: "error interno" } };
      }
    }
    res.writeHead(r.status, { "content-type": "application/json; charset=utf-8" });
    res.end(JSON.stringify(r.body));
  });
}).listen(PORT, () => console.log(`réplica en :${PORT}`));

