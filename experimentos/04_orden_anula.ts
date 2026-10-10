// Preguntas abiertas 3 y 4: orden de errores dentro de un comando y anulaciones en casos borde.
// Ejecutar: node --env-file=.env experimentos/04_orden_anula.ts
import { appendFileSync } from "node:fs";
import { send, reset } from "../src/probe.ts";
import { firmar } from "../src/control.ts";

const salida = new URL("../analisis/04_orden_anula.md", import.meta.url);
appendFileSync(salida, "# Orden de errores y anulaciones\n\n| caso | id | mensaje | status | respuesta |\n|---|---|---|---|---|\n");

async function caso(nombre: string, pasos: string[], pregunta: string) {
  const seq = `orden-${nombre}`;
  await reset(seq);
  for (const p of pasos) {
    const m = firmar(p);
    const r = await send({ seq, body: { m }, hipotesis: `${pregunta} (${nombre})` });
    appendFileSync(salida, `| ${nombre} | ${r.id} | ${m} | ${r.status} | ${r.raw} |\n`);
  }
}

const dos = ["ALTA;Ana", "ALTA;Beto"];

// 3. Orden de errores dentro de un comando
await caso("monto-vs-cuenta-deposito", [...dos, "DEPOSITO;AC-0009;0"], "monto inválido vs cuenta inexistente");
await caso("monto-vs-cuenta-transfer", [...dos, "TRANSFER;AC-0009;AC-0002;0"], "monto inválido vs cuenta inexistente");
await caso("iguales-vs-cuenta", [...dos, "TRANSFER;AC-0009;AC-0009;100"], "origen=destino vs cuenta inexistente");
await caso("iguales-vs-monto", [...dos, "TRANSFER;AC-0001;AC-0001;0"], "origen=destino vs monto inválido");
await caso("limite-vs-saldo", [...dos, "TRANSFER;AC-0001;AC-0002;120000"], "límite excedido vs saldo insuficiente");
await caso("cuenta-vs-limite", [...dos, "TRANSFER;AC-0009;AC-0002;120000"], "cuenta inexistente vs límite excedido");
await caso("destino-vs-saldo", [...dos, "TRANSFER;AC-0001;AC-0009;500"], "destino inexistente vs saldo insuficiente");
await caso("iguales-vs-limite", [...dos, "TRANSFER;AC-0001;AC-0001;120000"], "origen=destino vs límite excedido");

// 4. Anulaciones
await caso("anula-saldo-negativo", [...dos, "DEPOSITO;AC-0001;1000", "TRANSFER;AC-0001;AC-0002;800", "TRANSFER;AC-0002;AC-0001;800", "ANULA;OP-0002", "CONSULTA;AC-0001", "CONSULTA;AC-0002"], "anular una transferencia cuando el destino ya gastó el dinero");
await caso("anula-deposito-gastado", [...dos, "DEPOSITO;AC-0001;1000", "TRANSFER;AC-0001;AC-0002;1000", "ANULA;OP-0001", "CONSULTA;AC-0001"], "anular un depósito ya gastado");
await caso("anula-minusculas", [...dos, "DEPOSITO;AC-0001;1000", "anula;OP-0001", "CONSULTA;AC-0001"], "ANULA en minúsculas");
await caso("anula-op-minusculas", [...dos, "DEPOSITO;AC-0001;1000", "ANULA;op-0001"], "número de operación en minúsculas");
await caso("anula-repetida-tras-deposito", [...dos, "DEPOSITO;AC-0001;1000", "ANULA;OP-0001", "DEPOSITO;AC-0001;500", "ANULA;OP-0001", "ANULA;OP-0002", "CONSULTA;AC-0001"], "anulaciones repetidas y numeración");

// 5. Formatos de cuenta
await caso("cuenta-minusculas", [...dos, "CONSULTA;ac-0001"], "cuenta en minúsculas");
await caso("cuenta-corta", [...dos, "CONSULTA;AC-1"], "cuenta sin ceros");
await caso("cuenta-larga", [...dos, "CONSULTA;AC-00001"], "cuenta con un cero de más");

console.log("listo");
