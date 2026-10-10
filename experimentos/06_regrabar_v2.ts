// Incidente 15:30: el servicio pasó a la versión 2 con 3 comportamientos cambiados.
// Vuelve a mandar cada secuencia ya registrada (versión 1) y compara respuesta por respuesta.
// Ejecutar: node --env-file=.env experimentos/06_regrabar_v2.ts
import { readFileSync, writeFileSync } from "node:fs";
import { send, reset } from "../src/probe.ts";

type Linea = { id: number; seq: string; request: unknown; status: number; response: unknown; metodo: string; ruta: string; auth: string };
const v1: Linea[] = readFileSync(new URL("../experimentos.jsonl", import.meta.url), "utf8")
  .split("\n").filter((l) => l.trim()).map((l) => JSON.parse(l));

// Solo lo registrado antes del incidente; las vueltas del canario se repiten entre sí, basta una.
const LIMITE_ID = Math.max(...v1.filter((l) => l.seq.startsWith("juan-")).map((l) => l.id));
// SOLO=seq1,seq2 repite únicamente esas secuencias (revisión rápida y barata).
const SOLO = process.env.SOLO ? new Set(process.env.SOLO.split(",")) : null;
const SALIDA = process.env.SALIDA ?? "06_cambios_v2.md";
const seqs = new Map<string, Linea[]>();
for (const l of v1) {
  if (l.id > LIMITE_ID) continue;
  if (SOLO && !SOLO.has(l.seq)) continue;
  if (l.seq.startsWith("canary-") && l.seq !== "canary-1450") continue;
  if (!seqs.has(l.seq)) seqs.set(l.seq, []);
  seqs.get(l.seq)!.push(l);
}

const canon = (v: unknown): string => JSON.stringify(v, (_k, x) =>
  x && typeof x === "object" && !Array.isArray(x) ? Object.fromEntries(Object.entries(x).sort(([a], [b]) => (a < b ? -1 : 1))) : x);

const cambios: string[] = [];
let total = 0;
for (const [seq, lineas] of seqs) {
  const seqV2 = `v2-${seq}`;
  await reset(seqV2);
  for (const l of lineas) {
    if (l.ruta === "/__reset" && l.auth === "ok") continue; // ya se hizo el reset de la secuencia
    if (l.auth === "custom") continue; // el valor exacto del header no se guardó en el log
    const r = await send({
      seq: seqV2, method: l.metodo, path: l.ruta, auth: l.auth,
      body: l.request === null ? undefined : l.request,
      hipotesis: `v2: ¿cambió la respuesta registrada en el id ${l.id}?`,
    });
    total++;
    const ahora = r.json ?? r.raw;
    if (r.status !== l.status || canon(ahora) !== canon(l.response))
      cambios.push(`| ${l.id} | ${r.id} | ${JSON.stringify(l.request)} | ${l.status} ${JSON.stringify(l.response)} | ${r.status} ${r.raw} |`);
  }
}

writeFileSync(new URL(`../analisis/${SALIDA}`, import.meta.url),
  `# Cambios de la versión 2 (incidente 15:30)\n\nSe repitieron ${total} requests de la versión 1. Diferencias: ${cambios.length}.\n\n` +
  `| id v1 | id v2 | request | respuesta v1 | respuesta v2 |\n|---|---|---|---|---|\n${cambios.join("\n")}\n`);
console.log(`repetidos: ${total} · diferencias: ${cambios.length} · ver analisis/06_cambios_v2.md`);
