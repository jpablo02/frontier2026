// Hipótesis del tercer cambio de v2 (transcripts/05-revision-v2.txt, sección 1, más el caso de saldo
// menor a un peso de la sección 2). Cada caso empieza con /__reset.
// Ejecutar UNA vez: node --env-file=.env experimentos/08_hipotesis_v2.ts
import { appendFileSync } from "node:fs";
import { send, reset } from "../src/probe.ts";
import { firmar } from "../src/control.ts";

const salida = new URL("../analisis/08_hipotesis_v2.md", import.meta.url);
appendFileSync(
  salida,
  `# Hipótesis del tercer cambio (v2)\n\nCorrida: ${new Date().toISOString()}\n\n| caso | id | mensaje | status | respuesta |\n|---|---|---|---|---|\n`,
);

// Un paso es un mensaje sin control (se firma) o un request armado a mano.
type Paso = string | { m?: string; crudo?: string; auth?: string; path?: string; etiqueta: string };
const TOPE = 150;
let usados = 0;

const celda = (s: string) => s.replace(/\|/g, "\\|").replace(/\n/g, " ");

async function caso(nombre: string, pasos: Paso[], hipotesis: string) {
  if (usados + pasos.length + 1 > TOPE) throw new Error(`tope de ${TOPE} requests alcanzado en ${nombre}`);
  const seq = `hip-${nombre}`;
  const rr = await reset(seq);
  usados++;
  appendFileSync(salida, `| ${nombre} | ${rr.id} | POST /__reset | ${rr.status} | ${celda(rr.raw)} |\n`);
  for (const p of pasos) {
    let r;
    let etiqueta: string;
    if (typeof p === "string") {
      const m = firmar(p);
      etiqueta = m;
      r = await send({ seq, body: { m }, hipotesis: `${hipotesis} (${nombre})` });
    } else {
      const m = p.crudo ?? (p.m !== undefined ? firmar(p.m) : undefined);
      etiqueta = p.etiqueta;
      r = await send({
        seq,
        path: p.path,
        auth: p.auth,
        body: m === undefined ? undefined : { m },
        hipotesis: `${hipotesis} (${nombre}: ${p.etiqueta})`,
      });
    }
    usados++;
    appendFileSync(salida, `| ${nombre} | ${r.id} | ${celda(etiqueta)} | ${r.status} | ${celda(r.raw)} |\n`);
  }
}

const dos = ["ALTA;Ana", "ALTA;Beto"];

// 1. Límite acumulado mayor a 60000
await caso(
  "h01-limite-acumulado",
  [...dos, "DEPOSITO;AC-0001;900000", ...Array(4).fill("TRANSFER;AC-0001;AC-0002;50000"), "CONSULTA;AC-0001", "CONSULTA;AC-0002"],
  "H1: ¿hay límite acumulado de transferencias por encima de 60000? Réplica: 200 OP-0002..OP-0005",
);

// 2. ALTA con nombre repetido
await caso(
  "h02-alta-repetida",
  ["ALTA;Ana", "ALTA;Ana", "CONSULTA;AC-0002"],
  "H2: ¿ALTA rechaza un nombre repetido? Réplica: 201 AC-0001 y 201 AC-0002",
);

// 3. Sugerencias para nombres parecidos a comandos reales
await caso(
  "h03-sugerencias",
  [...dos, "CONSULTAR;AC-0001", "DEPOSITAR;AC-0001;100", "TRANSFERIR;AC-0001;AC-0002;100", "ANULAR;OP-0001", "ALTAS;Ana", "PINGG"],
  "H3: ¿hay sugerencia para comandos mal escritos parecidos a los reales? Réplica: E301 sin sugerencia",
);

// 4. El comando HALT
await caso(
  "h04-halt",
  [...dos, "HALT", "PING", "HALT;AC-0001", "CONSULTA;AC-0001"],
  "H4: ¿HALT existe y qué hace? Réplica: E301 sin sugerencia",
);

// 5. Montos con 2 decimales
await caso(
  "h05-dos-decimales",
  [...dos, "DEPOSITO;AC-0001;12.34", "CONSULTA;AC-0001"],
  "H5: ¿se aceptan montos con 2 decimales? Réplica: E303 y saldo 0.00",
);

// 6. Monto mínimo de depósito
await caso(
  "h06-deposito-minimo",
  [...dos, "DEPOSITO;AC-0001;1", "DEPOSITO;AC-0001;99", "CONSULTA;AC-0001"],
  "H6: ¿hay un monto mínimo de depósito? Réplica: 200, 200 y saldo 1.00",
);

// 7. Saldo máximo por cuenta
await caso(
  "h07-saldo-maximo",
  [...dos, "DEPOSITO;AC-0001;9999999999", "DEPOSITO;AC-0001;9999999999", "CONSULTA;AC-0001"],
  "H7: ¿hay un saldo máximo por cuenta? Réplica: 200, 200 y 199999999.98",
);

// 8. Largo del nombre
await caso(
  "h08-nombre-largo",
  ["ALTA;" + "A".repeat(136), "CONSULTA;AC-0001"],
  "H8: ¿ALTA valida el largo del nombre (136 letras)? Réplica: 201",
);

// 9. Máximo de cuentas por token
await caso(
  "h09-max-cuentas",
  [...Array.from({ length: 12 }, (_, i) => `ALTA;N${String.fromCharCode(65 + i)}`), "CONSULTA;AC-0012"],
  "H9: ¿hay un máximo de cuentas por token? Réplica: AC-0001..AC-0012",
);

// 10. PING con control mal formado
await caso(
  "h10-ping-control",
  [{ crudo: "PING;XX", etiqueta: "PING;XX" }],
  "H10: ¿PING valida el formato del control? Réplica: E201",
);

// 11. Variantes de auth no repetidas en v2 (fetch recorta el espacio final de "Bearer ")
const ping = "PING";
await caso(
  "h11-auth",
  [
    { m: ping, auth: "Bearer xyz", etiqueta: "/msg PING auth=Bearer xyz" },
    { m: ping, auth: "Bearer ", etiqueta: "/msg PING auth=Bearer (vacío)" },
    { m: ping, auth: "Basic abc", etiqueta: "/msg PING auth=Basic abc" },
    { m: ping, auth: "Bearer xyz", path: "/nada", etiqueta: "/nada PING auth=Bearer xyz" },
    { m: ping, auth: "Bearer ", path: "/nada", etiqueta: "/nada PING auth=Bearer (vacío)" },
    { m: ping, auth: "Basic abc", path: "/nada", etiqueta: "/nada PING auth=Basic abc" },
  ],
  "H11: ¿cambió la respuesta a auth inválida? Réplica: 401 E001 en /msg, 404 E404 en ruta inexistente",
);

// 12. Saldos menores a un peso (sección 2)
await caso(
  "h12-saldo-centavos",
  [...dos, "DEPOSITO;AC-0001;5", "TRANSFER;AC-0001;AC-0002;5", "ANULA;OP-0001", "CONSULTA;AC-0001", "CONSULTA;AC-0002"],
  "H12: ¿cómo se formatea un saldo de valor absoluto menor a 100? Réplica: -0.05 y 0.05",
);

appendFileSync(salida, `\nRequests usados: ${usados}\n`);
console.log(`listo: ${usados} requests`);
