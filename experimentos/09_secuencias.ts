// Segunda ronda de hipótesis: secuencias largas (6-19 pasos) que acumulan estado, interacciones de
// ANULA no probadas, cuentas en negativo y el umbral/desempate de la sugerencia de E301.
// Ejecutar UNA vez: node --env-file=.env experimentos/09_secuencias.ts
// Lo esperado en cada paso es lo que respondería src/replica.ts (modelo vigente, v2).
import { appendFileSync, writeFileSync } from "node:fs";
import { send, reset } from "../src/probe.ts";
import { firmar, control } from "../src/control.ts";

const TOPE = 200;
const salida = new URL("../analisis/09_secuencias.md", import.meta.url);
writeFileSync(
  salida,
  `# Secuencias largas y zonas sin explorar\n\nCorrida: ${new Date().toISOString()}\n\n| caso | id | mensaje | status | respuesta |\n|---|---|---|---|---|\n`,
);

let usados = 0;
let primerId = 0;
let ultimoId = 0;

// Un paso es [mensaje, lo esperado]. Si el mensaje empieza con "!", se manda tal cual (sin firmar).
type Paso = [string, string];
const malControl = (p: string) => `${p};${control(p) === 98 ? 97 : control(p) + 1}`;

async function caso(nombre: string, pregunta: string, pasos: Paso[]) {
  if (usados + pasos.length + 1 > TOPE) throw new Error(`tope de ${TOPE} requests: no se corre ${nombre}`);
  const seq = `sec-${nombre}`;
  const r0 = await reset(seq);
  usados++;
  primerId ||= r0.id;
  ultimoId = r0.id;
  appendFileSync(salida, `| ${nombre} | ${r0.id} | POST /__reset | ${r0.status} | ${r0.raw} |\n`);
  for (const [p, esperado] of pasos) {
    const m = p.startsWith("!") ? p.slice(1) : firmar(p);
    const r = await send({ seq, body: { m }, hipotesis: `${pregunta} — espera ${esperado} (${nombre})` });
    usados++;
    ultimoId = r.id;
    appendFileSync(salida, `| ${nombre} | ${r.id} | ${m} | ${r.status} | ${r.raw} |\n`);
  }
}

const A = "AC-0001", B = "AC-0002", C = "AC-0003", D = "AC-0004";
const alta = (n: number): Paso[] => ["Ana", "Beto", "Caro", "Dani"].slice(0, n).map((x, i) => [`ALTA;${x}`, `201 AC-000${i + 1}`]);

// S1. Cadena entre 3 cuentas: el saldo viaja A→B→C→A y cada consulta refleja todo el recorrido.
await caso("s01-cadena-3", "transferencias en cadena entre 3 cuentas acumulan bien", [
  ...alta(3),
  [`DEPOSITO;${A};30000`, "200 OP-0001"],
  [`TRANSFER;${A};${B};20000`, "200 OP-0002"],
  [`TRANSFER;${B};${C};15000`, "200 OP-0003"],
  [`TRANSFER;${C};${A};5000`, "200 OP-0004"],
  [`CONSULTA;${A}`, '"150.00"'],
  [`CONSULTA;${B}`, '"50.00"'],
  [`CONSULTA;${C}`, '"100.00"'],
]);

// S2. Anular una transferencia devuelve fondos utilizables: se puede volver a transferir lo mismo.
await caso("s02-anula-retransfiere", "anular una transferencia y volver a transferir el mismo monto", [
  ...alta(2),
  [`DEPOSITO;${A};1000`, "200 OP-0001"],
  [`TRANSFER;${A};${B};1000`, "200 OP-0002"],
  [`TRANSFER;${A};${B};1`, "422 E507 (saldo 0)"],
  ["ANULA;OP-0002", "200 ok:true"],
  [`TRANSFER;${A};${B};1000`, "200 OP-0003 (la anulación no consume número)"],
  [`CONSULTA;${A}`, '"0.00"'],
  [`CONSULTA;${B}`, '"10.00"'],
  ["ANULA;OP-0003", "200 ok:true"],
  ["ANULA;OP-0002", "200 ok:false ya anulada"],
  [`CONSULTA;${A}`, '"10.00"'],
  [`CONSULTA;${B}`, '"0.00"'],
]);

// S3. Anular en orden inverso deja todo en cero.
await caso("s03-anula-inversa", "anular una cadena en orden inverso vuelve todo a cero", [
  ...alta(3),
  [`DEPOSITO;${A};1000`, "200 OP-0001"],
  [`TRANSFER;${A};${B};300`, "200 OP-0002"],
  [`TRANSFER;${B};${C};200`, "200 OP-0003"],
  ["ANULA;OP-0003", "200 ok:true"],
  ["ANULA;OP-0002", "200 ok:true"],
  ["ANULA;OP-0001", "200 ok:true"],
  [`CONSULTA;${A}`, '"0.00"'],
  [`CONSULTA;${B}`, '"0.00"'],
  [`CONSULTA;${C}`, '"0.00"'],
]);

// S4. La misma cadena anulada en orden directo pasa por saldos negativos intermedios.
await caso("s04-anula-directa", "anular en orden directo pasa por negativos y termina en cero", [
  ...alta(3),
  [`DEPOSITO;${A};1000`, "200 OP-0001"],
  [`TRANSFER;${A};${B};300`, "200 OP-0002"],
  [`TRANSFER;${B};${C};200`, "200 OP-0003"],
  ["ANULA;OP-0001", "200 ok:true (A=-300)"],
  [`CONSULTA;${A}`, '"-3.00"'],
  ["ANULA;OP-0002", "200 ok:true (A=0, B=-200)"],
  [`CONSULTA;${B}`, '"-2.00"'],
  ["ANULA;OP-0003", "200 ok:true"],
  [`CONSULTA;${A}`, '"0.00"'],
  [`CONSULTA;${B}`, '"0.00"'],
  [`CONSULTA;${C}`, '"0.00"'],
]);

// S5. Transferir desde una cuenta negativa: E507 hasta que el saldo vuelva a alcanzar.
await caso("s05-desde-negativo", "transferir desde una cuenta que quedó negativa", [
  ...alta(2),
  [`DEPOSITO;${A};1000`, "200 OP-0001"],
  [`TRANSFER;${A};${B};1000`, "200 OP-0002"],
  ["ANULA;OP-0001", "200 ok:true (A=-1000)"],
  [`TRANSFER;${A};${B};1`, "422 E507"],
  [`DEPOSITO;${A};500`, "200 OP-0003 (A=-500)"],
  [`CONSULTA;${A}`, '"-5.00"'],
  [`TRANSFER;${A};${B};1`, "422 E507"],
  [`DEPOSITO;${A};1500`, "200 OP-0004 (A=1000)"],
  [`TRANSFER;${A};${B};1000`, "200 OP-0005"],
  [`CONSULTA;${A}`, '"0.00"'],
  [`CONSULTA;${B}`, '"20.00"'],
]);

// S6. Una cuenta intermedia queda negativa al anular la transferencia que la fondeó; sigue recibiendo.
await caso("s06-negativo-intermedio", "operar sobre una cuenta intermedia en negativo", [
  ...alta(3),
  [`DEPOSITO;${A};1000`, "200 OP-0001"],
  [`TRANSFER;${A};${B};1000`, "200 OP-0002"],
  [`TRANSFER;${B};${C};1000`, "200 OP-0003"],
  ["ANULA;OP-0002", "200 ok:true (A=1000, B=-1000)"],
  [`CONSULTA;${B}`, '"-10.00"'],
  [`TRANSFER;${A};${B};400`, "200 OP-0004 (B=-600)"],
  [`TRANSFER;${B};${C};1`, "422 E507"],
  ["ANULA;OP-0003", "200 ok:true (B=400, C=0)"],
  [`CONSULTA;${A}`, '"6.00"'],
  [`CONSULTA;${B}`, '"4.00"'],
  [`CONSULTA;${C}`, '"0.00"'],
]);

// S7. Diez depósitos de tamaños mezclados se suman exactos (sin redondeo) y se anula el más grande.
await caso("s07-muchos-depositos", "muchos depósitos se suman sin perder precisión", [
  ...alta(1),
  ...[1, 10, 100, 1000, 7, 13, 99, 250, 49999, 9999999999].map((n, i): Paso => [`DEPOSITO;${A};${n}`, `200 OP-${String(i + 1).padStart(4, "0")}`]),
  [`CONSULTA;${A}`, '"100000514.78"'],
  ["ANULA;OP-0010", "200 ok:true"],
  [`CONSULTA;${A}`, '"514.79"'],
]);

// S8. Todos los errores intercalados en una secuencia no tocan el estado ni los contadores.
const malo = `DEPOSITO;${A};100`;
await caso("s08-errores-intercalados", "los errores intercalados no cambian estado ni contadores", [
  ...alta(2),
  [`DEPOSITO;${A};5000`, "200 OP-0001"],
  ["!" + malControl(malo), "400 E202"],
  [`SALDO;${A}`, "400 E301 sin sugerencia"],
  [`DEPOSITO;${A}`, "400 E302"],
  [`DEPOSITO;${A};0`, "400 E303"],
  [`TRANSFER;${A};${A};10`, "400 E304"],
  [`TRANSFER;${A};AC-0009;10`, "404 E401"],
  [`TRANSFER;${A};${B};50001`, "422 E506"],
  [`TRANSFER;${A};${B};5001`, "422 E507"],
  [`HALT;${A}`, "409 E520 (mismo mensaje que el id 2518)"],
  ["!PING;XX", "200 pong"],
  [`DEPOSITO;${A};1`, "200 OP-0002"],
  ["ALTA;Caro", "201 AC-0003"],
  [`CONSULTA;${A}`, '"50.01"'],
]);

// S9. Contadores AC- y OP- intercalados; una operación rechazada no deja un id anulable.
await caso("s09-contadores", "contadores intercalados y ANULA sobre ids que no llegaron a existir", [
  ["ANULA;OP-0001", "404 E402 (estado vacío tras reset)"],
  ...alta(1),
  [`DEPOSITO;${A};100`, "200 OP-0001"],
  ["ALTA;Beto", "201 AC-0002"],
  [`TRANSFER;${A};${B};50`, "200 OP-0002"],
  ["ALTA;Caro", "201 AC-0003"],
  [`TRANSFER;${A};${C};100`, "422 E507"],
  ["ANULA;OP-0003", "404 E402"],
  [`DEPOSITO;${C};10`, "200 OP-0003"],
  ["ANULA;OP-0003", "200 ok:true"],
  [`CONSULTA;${C}`, '"0.00"'],
  [`CONSULTA;${B}`, '"0.50"'],
]);

// S10. Cuatro cuentas, seis transferencias al límite exacto, una anulación y re-transferencia.
await caso("s10-limite-4-cuentas", "el límite de 50000 sigue siendo por operación entre varias cuentas", [
  ...alta(4),
  [`DEPOSITO;${A};400000`, "200 OP-0001"],
  [`TRANSFER;${A};${B};50000`, "200 OP-0002"],
  [`TRANSFER;${A};${C};50000`, "200 OP-0003"],
  [`TRANSFER;${A};${D};50000`, "200 OP-0004"],
  [`TRANSFER;${B};${C};50000`, "200 OP-0005"],
  [`TRANSFER;${C};${D};50000`, "200 OP-0006"],
  [`TRANSFER;${D};${A};50000`, "200 OP-0007"],
  ["ANULA;OP-0002", "200 ok:true (B=-50000)"],
  [`TRANSFER;${A};${B};50000`, "200 OP-0008"],
  [`TRANSFER;${A};${B};50001`, "422 E506"],
  [`CONSULTA;${A}`, '"3000.00"'],
  [`CONSULTA;${B}`, '"0.00"'],
  [`CONSULTA;${C}`, '"500.00"'],
  [`CONSULTA;${D}`, '"500.00"'],
]);

// S11. Saldo exacto tras varios depósitos: 1 de más da E507, el exacto pasa.
await caso("s11-saldo-exacto", "saldo exacto acumulado con varios depósitos", [
  ...alta(2),
  [`DEPOSITO;${A};100`, "200 OP-0001"],
  [`DEPOSITO;${A};23`, "200 OP-0002"],
  [`TRANSFER;${A};${B};124`, "422 E507"],
  [`TRANSFER;${A};${B};123`, "200 OP-0003"],
  [`TRANSFER;${A};${B};1`, "422 E507"],
  [`TRANSFER;${B};${A};123`, "200 OP-0004"],
  ["ANULA;OP-0003", "200 ok:true (A=246, B=-123)"],
  [`CONSULTA;${A}`, '"2.46"'],
  [`CONSULTA;${B}`, '"-1.23"'],
]);

// S12. Anular un depósito máximo ya gastado y volver a depositar: saldos grandes y negativos.
await caso("s12-deposito-max-anulado", "anular un depósito máximo gastado deja negativo y se recupera", [
  ...alta(2),
  [`DEPOSITO;${A};9999999999`, "200 OP-0001"],
  [`TRANSFER;${A};${B};50000`, "200 OP-0002"],
  ["ANULA;OP-0001", "200 ok:true (A=-50000)"],
  [`CONSULTA;${A}`, '"-500.00"'],
  [`DEPOSITO;${A};9999999999`, "200 OP-0003"],
  [`CONSULTA;${A}`, '"99999499.99"'],
  ["ANULA;OP-0002", "200 ok:true"],
  [`CONSULTA;${A}`, '"99999999.99"'],
  [`CONSULTA;${B}`, '"0.00"'],
]);

// S13. Sugerencia de E301: palabras cortas, empates y minúsculas (la réplica desempata por el orden
// PING, ALTA, CONSULTA, DEPOSITO, TRANSFER, ANULA, HALT y sugiere hasta distancia 2).
await caso("s13-sugerencia-umbral", "umbral y desempate de la sugerencia en E301", [
  ["PI;X", "E301 sugerencia PING (distancia 2, palabra corta)"],
  ["AL;X", "E301 sugerencia ALTA (empate ALTA/HALT a 2)"],
  ["ALT;X", "E301 sugerencia ALTA (empate ALTA/HALT a 1)"],
  ["HALTA;X", "E301 sugerencia ALTA (empate ALTA/HALT a 1)"],
  ["ATLA;X", "E301 sugerencia ALTA (empate ALTA/ANULA a 2 en Levenshtein)"],
  ["consultar;X", "E301 sugerencia CONSULTA (en mayúsculas)"],
  ["TRANSFERENCIA;X", "E301 sin sugerencia (distancia 5)"],
]);

// S14. PING y control: variantes no medidas.
await caso("s14-ping-control", "PING ignora el control también con argumentos y en minúsculas", [
  ["!PING;AC-0001;XX", "400 E302 (salta E201)"],
  ["!ping;XX", "200 pong"],
  ["!PING;-1", "200 pong"],
  ["!CONSULTA;AC-0001;0", "400 E202 (0 bien formado)"],
]);

appendFileSync(salida, `\nRequests usados: ${usados} (ids ${primerId}–${ultimoId}, pueden incluir líneas del canario si soltó el candado)\n`);
console.log(`listo: ${usados} requests, ids ${primerId}-${ultimoId}`);
