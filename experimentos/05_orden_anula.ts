// Casos definidos por Juan Pablo: órdenes, cuentas duplicadas, mensajes vacíos y montos cero.
// Ejecutar: node --env-file=.env experimentos/05_orden_anula.ts
import { appendFileSync } from "node:fs";
import { send, reset } from "../src/probe.ts";
import { firmar } from "../src/control.ts";

const salida = new URL("../analisis/05_casos_juan.md", import.meta.url);
appendFileSync(salida, "# Casos definidos por Juan Pablo\n\n| caso | id | mensaje | status | respuesta |\n|---|---|---|---|---|\n");

async function caso(nombre: string, pasos: string[], pregunta: string) {
  const seq = `juan-${nombre}`;
  await reset(seq);
  for (const p of pasos) {
    const m = firmar(p);
    const r = await send({ seq, body: { m }, hipotesis: `${pregunta} (${nombre})` });
    appendFileSync(salida, `| ${nombre} | ${r.id} | ${m} | ${r.status} | ${r.raw} |\n`);
  }
}

const dos = ["ALTA;Ana", "ALTA;Beto"];

await caso("orden-estandar", [...dos, "CREAR_ORDEN_ID_9948_TOTAL_1500"], "verificar si la orden se crea en estado pendiente");
await caso("anulacion-directa", [...dos, "ANULAR_ORDEN_ID_9948"], "confirmar si el estado cambia a anulado inmediatamente");
await caso("anular-inexistente", [...dos, "ANULAR_ORDEN_ID_0000"], "validar que el sistema devuelva error de ID no encontrado");
await caso("formato-invalido", [...dos, "ESTO_NO_ES_UN_COMANDO_VALIDO"], "verificar que el log registre un fallo de parseo");
await caso("cuenta-duplicada", [...dos, "CREAR_CUENTA_REPETIDA"], "comprobar si el sistema ignora o rechaza la duplicidad");
await caso("mensaje-vacio", [...dos, ""], "confirmar que no rompa el hilo de ejecución del log");
await caso("monto-cero", [...dos, "CREAR_ORDEN_ID_9949_TOTAL_0"], "verificar si se permiten órdenes con valor cero");

console.log("listo");
