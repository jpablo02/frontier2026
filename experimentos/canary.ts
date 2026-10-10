// Canario: cada 10 minutos repite un conjunto fijo de mensajes contra el original y avisa si alguna
// respuesta cambió respecto de la primera vuelta (la línea base). Sirve para detectar el incidente
// de las 15:30 y documentar "Cambios durante el día" con evidencia del log.
// Ejecutar: node --env-file=.env experimentos/canary.ts   (se detiene solo a las 19:50 hora Bogotá)
import { appendFileSync, readFileSync } from "node:fs";
import { send, reset, release, type SendOpts } from "../src/probe.ts";
import { firmar } from "../src/control.ts";

const INTERVALO_MS = 10 * 60 * 1000;
const FIN_BOGOTA = "19:50";
const reporte = new URL("../analisis/canary.md", import.meta.url);

type Paso = { nombre: string; opts: Omit<SendOpts, "seq" | "hipotesis"> };
const ejemplos = readFileSync(new URL("../frontier-reto-2/pruebas/ejemplos.jsonl", import.meta.url), "utf8")
  .split("\n").filter((l) => l.trim()).map((l) => JSON.parse(l));

// Secuencia fija: los 20 ejemplos oficiales + casos sueltos de reglas medidas hoy.
const pasos: Paso[] = [
  ...ejemplos.map((e) => ({ nombre: `ejemplo-${e.n}`, opts: { body: e.request } })),
  { nombre: "deposito-10-digitos", opts: { body: { m: firmar("DEPOSITO;AC-0001;9999999999") } } },
  { nombre: "transfer-limite+1", opts: { body: { m: firmar("TRANSFER;AC-0001;AC-0002;100001") } } },
  { nombre: "comando-desconocido", opts: { body: { m: firmar("AYUDA;AC-0001") } } },
  { nombre: "ping-control-malo", opts: { body: { m: "PING;65" } } },
  { nombre: "ruta-inexistente", opts: { method: "GET", path: "/noexiste" } },
  { nombre: "json-invalido", opts: { body: "not json" } },
];

const base = new Map<string, string>();
const ahoraBogota = () => new Date().toLocaleTimeString("es-CO", { timeZone: "America/Bogota", hour: "2-digit", minute: "2-digit", hour12: false });

async function vuelta(n: number) {
  const hora = ahoraBogota();
  const seq = `canary-${hora.replace(":", "")}`;
  const cambios: string[] = [];
  await reset(seq);
  for (const p of pasos) {
    const r = await send({ seq, hipotesis: `canario: ¿cambió ${p.nombre}?`, ...p.opts });
    const huella = `${r.status} ${r.raw}`;
    if (n === 0) base.set(p.nombre, huella);
    else if (base.get(p.nombre) !== huella) cambios.push(`| ${p.nombre} | ${r.id} | ${base.get(p.nombre)} | ${huella} |`);
  }
  release(); // deja que los experimentos usen el original entre vueltas
  if (n === 0) {
    appendFileSync(reporte, `# Canario\n\nLínea base tomada a las ${hora} (seq \`${seq}\`, ${pasos.length} mensajes).\n\n`);
    console.log(`[${hora}] línea base tomada (${pasos.length} mensajes)`);
  } else if (cambios.length === 0) {
    appendFileSync(reporte, `- ${hora}: sin cambios (seq \`${seq}\`)\n`);
    console.log(`[${hora}] sin cambios`);
  } else {
    appendFileSync(reporte, `\n## CAMBIO DETECTADO a las ${hora} (seq \`${seq}\`)\n\n| caso | id | antes | ahora |\n|---|---|---|---|\n${cambios.join("\n")}\n\n`);
    console.log(`[${hora}] *** CAMBIO DETECTADO: ${cambios.length} casos *** ver analisis/canary.md`);
  }
}

for (let n = 0; ahoraBogota() < FIN_BOGOTA; n++) {
  await vuelta(n);
  await new Promise((r) => setTimeout(r, INTERVALO_MS));
}
console.log("canario detenido");
