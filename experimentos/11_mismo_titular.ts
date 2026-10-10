// Verifica la hipótesis del id 2921: ¿una transferencia entre cuentas del MISMO titular se salta el
// límite de 50000? Única diferencia hallada en 248 líneas aleatorias.
// Ejecutar: node --env-file=.env experimentos/11_mismo_titular.ts
import { appendFileSync } from "node:fs";
import { send, reset } from "../src/probe.ts";
import { firmar } from "../src/control.ts";

const salida = new URL("../analisis/11_mismo_titular.md", import.meta.url);
appendFileSync(salida, "# Transferencias entre cuentas del mismo titular\n\n| caso | id | mensaje | status | respuesta |\n|---|---|---|---|---|\n");

async function caso(nombre: string, pasos: string[], pregunta: string) {
  const seq = `tit-${nombre}`;
  await reset(seq);
  for (const p of pasos) {
    const m = firmar(p);
    const r = await send({ seq, body: { m }, hipotesis: `${pregunta} (${nombre})` });
    appendFileSync(salida, `| ${nombre} | ${r.id} | ${m} | ${r.status} | ${r.raw} |\n`);
  }
}

// A. Mismo titular, con saldo suficiente: ¿pasa un monto por encima del límite?
await caso("mismo-con-saldo", ["ALTA;Ana", "ALTA;Ana", "DEPOSITO;AC-0001;900000", "TRANSFER;AC-0001;AC-0002;50001", "CONSULTA;AC-0002"], "mismo titular y saldo suficiente: ¿se salta el límite?");
// B. Distinto titular, mismo escenario: control del experimento
await caso("distinto-con-saldo", ["ALTA;Ana", "ALTA;Beto", "DEPOSITO;AC-0001;900000", "TRANSFER;AC-0001;AC-0002;50001"], "distinto titular: debe dar E506");
// C. Mismo titular sin saldo: reproduce exactamente el id 2921
await caso("mismo-sin-saldo", ["ALTA;Ana", "ALTA;Ana", "TRANSFER;AC-0002;AC-0001;50001"], "reproducir el id 2921: mismo titular, saldo 0");
// D. ¿Hay otro límite más alto para el mismo titular?
await caso("mismo-monto-enorme", ["ALTA;Ana", "ALTA;Ana", "DEPOSITO;AC-0001;9999999999", "TRANSFER;AC-0001;AC-0002;999999999"], "mismo titular: ¿hay algún límite?");
// E. ¿La comparación de nombres distingue mayúsculas?
await caso("mayusculas", ["ALTA;Ana", "ALTA;ANA", "DEPOSITO;AC-0001;900000", "TRANSFER;AC-0001;AC-0002;50001"], "¿Ana y ANA cuentan como el mismo titular?");

console.log("listo");
