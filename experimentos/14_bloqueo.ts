// Regla nueva descubierta en el id 3449: tras varios rechazos por límite, la cuenta origen responde
// 423 E510 "cuenta bloqueada". Mide cuántos rechazos hacen falta, qué cuenta `intentos` y qué alcanza.
// Ejecutar: node --env-file=.env experimentos/14_bloqueo.ts
import { appendFileSync } from "node:fs";
import { send, reset } from "../src/probe.ts";
import { firmar } from "../src/control.ts";

const salida = new URL("../analisis/14_bloqueo.md", import.meta.url);
appendFileSync(salida, "# Bloqueo de cuenta por intentos (E510)\n\n| caso | id | mensaje | status | respuesta |\n|---|---|---|---|---|\n");

async function caso(nombre: string, pasos: string[], pregunta: string) {
  const seq = `blq-${nombre}`;
  await reset(seq);
  for (const p of pasos) {
    const m = firmar(p);
    const r = await send({ seq, body: { m }, hipotesis: `${pregunta} (${nombre})` });
    appendFileSync(salida, `| ${nombre} | ${r.id} | ${m} | ${r.status} | ${r.raw} |\n`);
  }
}

const base = ["ALTA;Ana", "ALTA;Beto", "DEPOSITO;AC-0001;900000"];
const over = "TRANSFER;AC-0001;AC-0002;60000";   // supera el límite de 50000 -> E506
const ok = "TRANSFER;AC-0001;AC-0002;1000";      // válida

// 1. ¿Cuántos E506 seguidos hacen falta? Probamos 1, 2 y 3 antes de una transferencia válida.
await caso("tras-1", [...base, over, ok], "¿1 rechazo basta para bloquear?");
await caso("tras-2", [...base, over, over, ok], "¿2 rechazos bastan?");
await caso("tras-3", [...base, over, over, over, ok], "¿3 rechazos bloquean?");

// 2. ¿Cómo evoluciona `intentos` tras el bloqueo?
await caso("intentos", [...base, over, over, over, ok, ok, ok], "cómo evoluciona el campo intentos");

// 3. ¿Tienen que ser seguidos? Una válida en medio debería reiniciar el contador.
await caso("interrumpido", [...base, over, over, ok, over, ok], "¿una operación válida reinicia el contador?");

// 4. ¿Qué errores cuentan? Tres E507 (saldo) en vez de E506.
await caso("por-saldo", ["ALTA;Ana", "ALTA;Beto", "TRANSFER;AC-0001;AC-0002;100", "TRANSFER;AC-0001;AC-0002;100", "TRANSFER;AC-0001;AC-0002;100", "DEPOSITO;AC-0001;900000", "TRANSFER;AC-0001;AC-0002;1000"], "¿los rechazos por saldo (E507) también bloquean?");

// 5. ¿Qué alcanza el bloqueo? Con la cuenta bloqueada: consulta, depósito, recibir y anular.
await caso("alcance", [...base, over, over, over, "CONSULTA;AC-0001", "DEPOSITO;AC-0001;500", "DEPOSITO;AC-0002;900000", "TRANSFER;AC-0002;AC-0001;1000", "CONSULTA;AC-0001"], "¿el bloqueo afecta consulta, depósito y recibir transferencias?");

// 6. ¿El bloqueo persiste? Varias transferencias más desde la cuenta bloqueada.
await caso("persiste", [...base, over, over, over, ok, ok, "CONSULTA;AC-0001"], "¿el bloqueo se mantiene o se levanta solo?");

console.log("listo");
