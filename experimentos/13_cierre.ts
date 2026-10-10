// Cierre de supuestos antes de las 20:00 (prompt 11). Un solo experimento dirigido, tope 150 requests.
// Prioridad: 1) titulares con espacios/tildes/números, 2) anular >50000 entre mismo titular,
// 3) desempates de sugerencia, 4) argumento de HALT (sin confirmación), 5) otros supuestos.
// Ejecutar: node --env-file=.env experimentos/13_cierre.ts
import { appendFileSync, writeFileSync } from "node:fs";
import { send, reset } from "../src/probe.ts";
import { firmar } from "../src/control.ts";

const salida = new URL("../analisis/13_cierre.md", import.meta.url);
writeFileSync(salida, "# Cierre de supuestos (fin-)\n\n| caso | id | mensaje | status | respuesta |\n|---|---|---|---|---|\n");
let total = 0;
const TOPE = 150;

async function caso(nombre: string, pasos: (string | { raw: unknown; auth?: string })[], pregunta: string) {
  const seq = `fin-${nombre}`;
  await reset(seq); total++;
  for (const p of pasos) {
    if (total >= TOPE) throw new Error("tope alcanzado");
    const body = typeof p === "string" ? { m: firmar(p) } : p.raw;
    const auth = typeof p === "string" ? "ok" : (p.auth ?? "ok");
    const r = await send({ seq, body, auth, hipotesis: `${pregunta} (${nombre})` }); total++;
    const m = JSON.stringify(body).replace(/\|/g, "\\|");
    appendFileSync(salida, `| ${nombre} | ${r.id} | \`${m}\` | ${r.status} | ${r.raw.replace(/\|/g, "\\|")} |\n`);
  }
}

// 1. Titulares variantes. Depósito previo amplio en AC-0001 y 50001 hacia cada variante.
await caso("tit-espacios", [
  "ALTA;Ana", "ALTA;Ana ", "ALTA; Ana", "ALTA;Aná", "ALTA;Ana",
  "DEPOSITO;AC-0001;900000",
  "TRANSFER;AC-0001;AC-0002;50001", // Ana vs "Ana "
  "TRANSFER;AC-0001;AC-0003;50001", // Ana vs " Ana"
  "TRANSFER;AC-0001;AC-0004;50001", // Ana vs Aná
  "TRANSFER;AC-0001;AC-0005;50001", // Ana vs Ana (control)
  "CONSULTA;AC-0001", "CONSULTA;AC-0002", "CONSULTA;AC-0003", "CONSULTA;AC-0004",
], "¿el titular se recorta, ignora tildes o se compara tal cual?");

await caso("tit-raros", [
  "ALTA; ", "ALTA; ", "ALTA;123", "ALTA;123", "ALTA;7", "ALTA;07", "ALTA;Aná", "ALTA;Aná",
  "DEPOSITO;AC-0001;900000", "DEPOSITO;AC-0003;900000", "DEPOSITO;AC-0005;900000", "DEPOSITO;AC-0007;900000",
  "TRANSFER;AC-0001;AC-0002;50001", // " " vs " "
  "TRANSFER;AC-0003;AC-0004;50001", // 123 vs 123
  "TRANSFER;AC-0005;AC-0006;50001", // 7 vs 07 (¿comparación numérica?)
  "TRANSFER;AC-0007;AC-0008;50001", // Aná vs Aná
  "TRANSFER;AC-0001;AC-0003;50001", // " " vs 123 (distinto)
  "CONSULTA;AC-0002", "CONSULTA;AC-0006",
], "titular de solo espacio, numérico y con tilde, iguales entre sí");

// 2. Anular transferencia >50000 entre mismo titular.
await caso("anula-mismo", [
  "ALTA;Ana", "ALTA;Ana", "ALTA;Beto",
  "DEPOSITO;AC-0001;100000",
  "TRANSFER;AC-0001;AC-0002;60000",
  "CONSULTA;AC-0001", "CONSULTA;AC-0002",
  "ANULA;OP-0002",
  "CONSULTA;AC-0001", "CONSULTA;AC-0002",
  "ANULA;OP-0002",
  "TRANSFER;AC-0001;AC-0002;100000", // tras anular, todo el saldo de vuelta: ¿pasa?
  "TRANSFER;AC-0002;AC-0003;50000",  // destino gasta parte (titular distinto, en el límite)
  "ANULA;OP-0003",                   // revierte dejando AC-0002 negativa
  "CONSULTA;AC-0001", "CONSULTA;AC-0002", "CONSULTA;AC-0003",
], "anular una transferencia >50000 entre mismo titular y consultar saldos");

// 3. Desempates de sugerencia (Levenshtein, comandos a la misma distancia).
// PITA: PING 2 / ALTA 2 (orden de lista → PING; alfabético → ALTA)
// HANG: PING 2 / HALT 2 (lista → PING; alfabético → HALT)
// PALA: ALTA 2 / HALT 2 · HULA: ANULA 2 / HALT 2 · ANGA: ALTA 2 / ANULA 2
// AULA: ANULA 1 / ALTA 2 · HALA: HALT 1 / ALTA 2 · PALT: HALT 1 / ALTA 2 (¿mínimo o primero ≤2?)
// IPGN, TARNSFRE: Damerau ≤2 pero Levenshtein >2 (¿cuenta transposiciones?)
await caso("sugerencia", [
  "PITA;x", "HANG;x", "PALA;x", "HULA;x", "ANGA;x", "AULA;x", "HALA;x", "PALT;x",
  "IPGN;x", "TARNSFRE;x", "ALT;x", "ANULAR;x",
], "desempate de sugerencias");

// 4. Argumento de HALT. Sin ninguna palabra de confirmación.
await caso("halt", [
  "ALTA;Ana",
  "HALT;AC-0009", "HALT;AC-0001", "HALT;cualquiercosa", "HALT;a;b", "halt;x", "HALT;0",
  "CONSULTA;AC-0001",
], "¿HALT valida su argumento?");

// 5. Otros supuestos.
await caso("otros", [
  { raw: "no json", auth: "none" },                  // ENT-11 / ERR-03: ¿401 antes que 400?
  { raw: { m: "CONSULTA;AC-0001;0" } },               // INT-14: control "0"
  { raw: { m: "CONSULTA;AC-0001;00" } },              // control "00"
  "ALTA;Ana", "ALTA;Beto",
  "TRANSFER;AC-0001;ac-0001;100",                    // ¿E304 compara normalizado? (o E401)
  "DEPOSITO;AC-0001;+5",                             // monto con signo +
  "DEPOSITO;AC-0001;50",
  "TRANSFER;AC-0001;AC-0002;50",
  "ANULA;OP-0001",                                   // deja AC-0001 en -50
  "CONSULTA;AC-0001",                                // ¿"-0.50"?
  "DEPOSITO;AC-0002;9999999999", "DEPOSITO;AC-0002;9999999999",
  "CONSULTA;AC-0002",                                // saldo grande
  "CONSULTA; AC-0001",
], "otros supuestos: auth vs cuerpo, control 0, formato de saldo");

console.log(`listo: ${total} requests`);
