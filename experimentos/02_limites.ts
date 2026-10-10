// Preguntas abiertas 1, 2 y 5: límite de transferencia, montos y numeración de operaciones.
// Ejecutar: node --env-file=.env experimentos/02_limites.ts
import { appendFileSync } from "node:fs";
import { send, reset } from "../src/probe.ts";
import { firmar } from "../src/control.ts";

const salida = new URL("../analisis/02_limites.md", import.meta.url);
appendFileSync(salida, "# Límites, montos y numeración\n\n| caso | id | mensaje | status | respuesta |\n|---|---|---|---|---|\n");

async function caso(nombre: string, pasos: string[], pregunta: string) {
  const seq = `limites-${nombre}`;
  await reset(seq);
  for (const p of pasos) {
    const m = firmar(p);
    const r = await send({ seq, body: { m }, hipotesis: `${pregunta} (${nombre})` });
    appendFileSync(salida, `| ${nombre} | ${r.id} | ${m} | ${r.status} | ${r.raw} |\n`);
  }
}

const inicio = ["ALTA;Ana", "ALTA;Beto", "DEPOSITO;AC-0001;900000"];

for (const monto of ["100001", "105000", "110000", "119999"])
  await caso(`transfer-${monto}`, [...inicio, `TRANSFER;AC-0001;AC-0002;${monto}`], "monto máximo de una transferencia");

await caso("acumulado-60-60", [...inicio, "TRANSFER;AC-0001;AC-0002;60000", "TRANSFER;AC-0001;AC-0002;60000"], "el límite es por transferencia o acumulado");
await caso("acumulado-100-1", [...inicio, "TRANSFER;AC-0001;AC-0002;100000", "TRANSFER;AC-0001;AC-0002;1"], "el límite es por transferencia o acumulado");

for (const monto of ["999999999", "1000000000", "9999999999"])
  await caso(`deposito-${monto}`, ["ALTA;Ana", `DEPOSITO;AC-0001;${monto}`], "monto máximo de un depósito");

await caso("numeracion-saldo", ["ALTA;Ana", "ALTA;Beto", "TRANSFER;AC-0001;AC-0002;500", "DEPOSITO;AC-0001;100"], "una transferencia sin saldo consume número de operación");
await caso("numeracion-monto", ["ALTA;Ana", "DEPOSITO;AC-0001;0", "DEPOSITO;AC-0001;100"], "un depósito rechazado consume número de operación");
await caso("numeracion-anula", ["ALTA;Ana", "DEPOSITO;AC-0001;100", "ANULA;OP-0001", "DEPOSITO;AC-0001;100"], "anular consume número de operación");

console.log("listo");
