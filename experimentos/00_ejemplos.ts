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
  console.log(`${m} | ${f} → ${short(r1.status, r1.json ?? r1.raw)} ${pasa ? "PASA" : "FALLA"} | ${bad} → ${short(r2.status, r2.json ?? r2.raw)} ${e202 ? "E202" : "NO-E202"}`);
}
