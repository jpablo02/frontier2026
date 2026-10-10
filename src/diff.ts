// Reproduce experimentos.jsonl (y los ejemplos oficiales) contra una URL y compara como el set oficial.
// Uso: node --env-file=.env src/diff.ts [url]
import { readFileSync } from "node:fs";
import { isDeepStrictEqual } from "node:util";

const BASE = (process.argv[2] ?? "http://localhost:8080").replace(/\/$/, "");
const TOKEN = process.env.TEAM_TOKEN ?? "";

type Linea = {
  id: number | string;
  seq: string;
  request: unknown;
  status: number;
  response: unknown;
  metodo?: string;
  ruta?: string;
  auth?: string;
};
const leer = (f: string): any[] =>
  readFileSync(f, "utf8").split("\n").filter(Boolean).map((l) => JSON.parse(l));

const lineas: Linea[] = [];
// Ejemplos oficiales: un reset y luego cada uno como POST /msg.
lineas.push({ id: "of-reset", seq: "oficial", request: null, status: 200, response: { ok: true }, metodo: "POST", ruta: "/__reset", auth: "ok" });
for (const e of leer("frontier-reto-2/pruebas/ejemplos.jsonl"))
  lineas.push({ ...e, id: `of-${e.n}`, seq: "oficial", metodo: "POST", ruta: "/msg", auth: "ok" });
// El log ya incluye los resets de cada secuencia como líneas propias.
lineas.push(...leer("experimentos.jsonl"));

function authHeader(modo = "ok"): string | undefined {
  switch (modo) {
    case "ok": return `Bearer ${TOKEN}`;
    case "none": return undefined;
    case "team": return "Bearer otro";
    case "raw": return TOKEN;
    case "lower": return `bearer ${TOKEN}`;
    default: return "Bearer invalido";
  }
}

function igual(esperado: unknown, texto: string, metodo: string): boolean {
  if (metodo === "HEAD") return true; // el cuerpo de HEAD se ignora
  if (typeof esperado !== "string") {
    try { return isDeepStrictEqual(esperado, JSON.parse(texto)); } catch { return false; }
  }
  return esperado === texto; // el log guarda texto cuando no era JSON
}

const porSeq = new Map<string, { ok: number; total: number }>();
const difs: string[] = [];
const cortar = (s: string) => (s.length > 160 ? s.slice(0, 160) + "…" : s);

for (const l of lineas) {
  const metodo = l.metodo ?? "POST";
  const headers: Record<string, string> = {};
  const a = authHeader(l.auth);
  if (a !== undefined) headers.authorization = a;
  let body: string | undefined;
  if (l.request !== null && l.request !== undefined && !["GET", "HEAD"].includes(metodo))
    body = typeof l.request === "string" ? l.request : JSON.stringify(l.request);
  let status = 0;
  let texto = "";
  try {
    const r = await fetch(BASE + (l.ruta ?? "/msg"), { method: metodo, headers, body });
    status = r.status;
    texto = await r.text();
  } catch (e) {
    texto = `ERROR: ${(e as Error).message}`;
  }
  const ok = status === l.status && igual(l.response, texto, metodo);
  const s = porSeq.get(l.seq) ?? { ok: 0, total: 0 };
  s.total++;
  if (ok) s.ok++;
  porSeq.set(l.seq, s);
  if (!ok) difs.push(`${l.id} | ${l.status} ${cortar(JSON.stringify(l.response))} | ${status} ${cortar(texto)}`);
}

const pct = (a: number, b: number) => `${((100 * a) / b).toFixed(1)}%`;
console.log("secuencia | ok/total | %");
for (const [seq, s] of porSeq) console.log(`${seq} | ${s.ok}/${s.total} | ${pct(s.ok, s.total)}`);
const tot = [...porSeq.values()].reduce((a, s) => ({ ok: a.ok + s.ok, total: a.total + s.total }), { ok: 0, total: 0 });
const seqOk = [...porSeq.values()].filter((s) => s.ok === s.total).length;
console.log(`\nTOTAL líneas: ${tot.ok}/${tot.total} (${pct(tot.ok, tot.total)}) · secuencias perfectas: ${seqOk}/${porSeq.size}`);
if (difs.length) console.log(`\nDiferencias (id | esperado | obtenido):\n${difs.join("\n")}`);
