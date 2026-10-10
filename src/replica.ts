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
const estado = { cuentas: new Map<string, number>(), titulares: new Map<string, string>(), ops: new Map<string, Op>(), nCuentas: 0, nOps: 0 };
function reset() {
  estado.cuentas.clear();
  estado.titulares.clear();
  estado.ops.clear();
  estado.nCuentas = 0;
  estado.nOps = 0;
}
const pad = (n: number) => String(n).padStart(4, "0");

// El límite de TRANSFER es por operación (no acumulado) e inclusivo: 100000 pasa y 100001 falla
// (ids 340-355); dos de 60000 seguidas pasan (360-361).
// Versión 2 (incidente, detectado 16:01): el límite bajó de 100000 a 50000. 50000 pasa y 50001 falla
// (ids de analisis/07_limite_v2.md); sigue siendo por transferencia, no acumulado.
const LIMITE_TRANSFER = 50000;

// Versión 2: el saldo se muestra como texto con 2 decimales, el valor interno entre 100
// (40000 → "400.00", -800 → "-8.00", 12345 → "123.45"; ver analisis/06_cambios_v2_completa_1601.md).
const formatoSaldo = (n: number): string => {
  const abs = Math.abs(n);
  return `${n < 0 ? "-" : ""}${Math.floor(abs / 100)}.${String(abs % 100).padStart(2, "0")}`;
};
// Monto válido = entero sin ceros a la izquierda de hasta 10 dígitos: 9999999999 pasa (id 376),
// 10000000000 falla (ids 393, 396, 399). Ceros a la izquierda, decimales y negativos fallan (ids 225-230).
const MONTO_RE = /^[1-9]\d{0,9}$/;

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

// Ante un comando desconocido el original sugiere el comando real a distancia de edicion <= 2.
// HALT es comando (id 2518), por eso esta tambien en ARIDAD.
// (AYUDA->ANULA, HELP->HALT: ids 284-287; CONSULTAR->CONSULTA, DEPOSITAR->DEPOSITO,
// TRANSFERIR->TRANSFER, ANULAR->ANULA, ALTAS->ALTA, PINGG->PING: ids 2507-2512). El umbral 2 es el
// único que explica esos 8 casos y a la vez no sugiere nada para los 33 nombres que no recibieron
// sugerencia (ids 254-283, 288-323)
const COMANDOS_CONOCIDOS = ["PING", "ALTA", "CONSULTA", "DEPOSITO", "TRANSFER", "ANULA", "HALT"];
const MAX_DISTANCIA_SUGERENCIA = 2;

function distancia(a: string, b: string): number {
  const d = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = d[0];
    d[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const tmp = d[j];
      d[j] = Math.min(d[j] + 1, d[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = tmp;
    }
  }
  return d[b.length];
}

function sugerir(cmd: string): string | undefined {
  let mejor: string | undefined;
  let mejorD = Infinity;
  for (const c of COMANDOS_CONOCIDOS) {
    const d = distancia(cmd, c);
    if (d < mejorD) { mejorD = d; mejor = c; }
  }
  return mejorD <= MAX_DISTANCIA_SUGERENCIA ? mejor : undefined;
}

// SUPUESTO: HALT con 1 argumento responde 409 E520 (id 2518) y no cambia el estado (id 2519). No se
// mandó la confirmación que pide el mensaje, porque dice que detiene el servicio.
const ARIDAD: Record<string, number> = { PING: 0, ALTA: 1, CONSULTA: 1, DEPOSITO: 2, TRANSFER: 3, ANULA: 1, HALT: 1 };

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
    chequeo: (c) => {
      c.ctrl = c.segs[c.segs.length - 1];
      if (c.segs[0].toUpperCase() === "PING") return false; // PING ignora el formato del control (id 2555)
      return !/^(0|[1-9]\d?)$/.test(c.ctrl);
    },
  },
  {
    codigo: "E202", status: 400, mensaje: "control inválido",
    // PING no valida el control: ni su valor (PING;65 → 200, id 30) ni su formato (PING;XX → 200,
    // id 2555, donde cualquier otro comando daría E201). Con los demás, 1 de diferencia ya es E202
    // (ids 28, 32). Por eso PING se exceptúa antes de E201 y de E202.
    chequeo: (c) => c.segs[0].toUpperCase() !== "PING" && control(c.segs.slice(0, -1).join(";")) !== Number(c.ctrl),
  },
  {
    codigo: "E301", status: 400, mensaje: "comando desconocido ", // espacio final: es parte del original
    chequeo: (c) => {
      c.cmd = c.segs[0].toUpperCase();
      c.args = c.segs.slice(1, -1);
      return !(c.cmd in ARIDAD);
    },
    extra: (c) => { const s = sugerir(c.cmd); return s ? { sugerencia: s } : {}; },
  },
  { codigo: "E302", status: 400, mensaje: "aridad inválida", chequeo: (c) => c.args.length !== ARIDAD[c.cmd] },
];

const monto = (s: string) => Number(s);
const cuentaNo = (s: string) => !estado.cuentas.has(s);
// Validaciones propias de cada comando, también en orden.
// Orden dentro de un comando: E303 → E304 → E401 → E506 → E507 (ids 403-431).
const PASOS_COMANDO: Record<string, Paso[]> = {
  PING: [],
  ALTA: [],
  HALT: [], // sin validaciones propias: con aridad 1 responde 409 E520 (id 2518)
  CONSULTA: [{ codigo: "E401", status: 404, mensaje: "cuenta inexistente", chequeo: (c) => cuentaNo(c.args[0]) }],
  DEPOSITO: [
    { codigo: "E303", status: 400, mensaje: "monto inválido", chequeo: (c) => !MONTO_RE.test(c.args[1]) },
    { codigo: "E401", status: 404, mensaje: "cuenta inexistente", chequeo: (c) => cuentaNo(c.args[0]) },
  ],
  TRANSFER: [
    { codigo: "E303", status: 400, mensaje: "monto inválido", chequeo: (c) => !MONTO_RE.test(c.args[2]) },
    // E304 antes que E401 (id 411); E303 antes que E304 (id 415).
    { codigo: "E304", status: 400, mensaje: "origen y destino iguales", chequeo: (c) => c.args[0] === c.args[1] },
    { codigo: "E401", status: 404, mensaje: "cuenta inexistente", chequeo: (c) => cuentaNo(c.args[0]) || cuentaNo(c.args[1]) },
    // Límite (E506) antes que saldo (E507) (id 419); cuenta inexistente antes que límite (id 423).
    // v2: el límite NO aplica si origen y destino tienen el mismo titular, comparado tal cual
    // (distingue mayúsculas): mismo titular con saldo pasa 50001 y hasta 999999999 (ids 3114, 3129);
    // distinto titular da E506 (3120); "Ana" vs "ANA" son titulares distintos (3134). Descubierto
    // con el id 2921, la única diferencia en 248 líneas aleatorias.
    {
      codigo: "E506", status: 422, mensaje: "límite excedido",
      chequeo: (c) => monto(c.args[2]) > LIMITE_TRANSFER &&
        estado.titulares.get(c.args[0]) !== estado.titulares.get(c.args[1]),
    },
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
  HALT: () => ({ status: 409, body: { error: "E520", mensaje: "operación destructiva: detiene el servicio; reenvía con confirmación" } }),
  ALTA: (c) => {
    const id = `AC-${pad(++estado.nCuentas)}`;
    estado.cuentas.set(id, 0);
    estado.titulares.set(id, c.args[0]); // el titular importa para el límite (ver E506)
    return { status: 201, body: { cuentaId: id } };
  },
  CONSULTA: (c) => ({ status: 200, body: { cuenta_id: c.args[0], saldo: formatoSaldo(estado.cuentas.get(c.args[0])!) } }),
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
    // La reversión se aplica aunque deje saldo negativo (ids 440, 447).
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

