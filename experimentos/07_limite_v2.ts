// Incidente: límite de transferencia y formato del saldo en la versión 2.
// Ejecutar: node --env-file=.env experimentos/07_limite_v2.ts
import { appendFileSync } from "node:fs";
import { send, reset } from "../src/probe.ts";
import { firmar } from "../src/control.ts";

const salida = new URL("../analisis/07_limite_v2.md", import.meta.url);
appendFileSync(salida, "# Límite de transferencia en la versión 2\n\n| caso | id | mensaje | status | respuesta |\n|---|---|---|---|---|\n");

async function caso(nombre: string, pasos: string[], pregunta: string) {
  const seq = `v2lim-${nombre}`;
  await reset(seq);
  for (const p of pasos) {
    const m = firmar(p);
    const r = await send({ seq, body: { m }, hipotesis: `${pregunta} (${nombre})` });
    appendFileSync(salida, `| ${nombre} | ${r.id} | ${m} | ${r.status} | ${r.raw} |\n`);
  }
}

const inicio = ["ALTA;Ana", "ALTA;Beto", "DEPOSITO;AC-0001;900000"];

for (const monto of ["40001", "45000", "49999", "50000", "50001", "55000", "59999"])
  await caso(`transfer-${monto}`, [...inicio, `TRANSFER;AC-0001;AC-0002;${monto}`], "v2: monto máximo de una transferencia");

await caso("acumulado-30-30", [...inicio, "TRANSFER;AC-0001;AC-0002;30000", "TRANSFER;AC-0001;AC-0002;30000"], "v2: ¿el límite es acumulado?");
await caso("deposito-grande", ["ALTA;Ana", "DEPOSITO;AC-0001;9999999999", "CONSULTA;AC-0001"], "v2: formato de saldo con monto grande");
await caso("saldo-impar", ["ALTA;Ana", "DEPOSITO;AC-0001;12345", "CONSULTA;AC-0001"], "v2: formato de saldo con centavos");

console.log("listo");
