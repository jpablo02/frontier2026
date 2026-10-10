// Pregunta abierta 2: monto máximo exacto de un depósito (10 dígitos pasa, 12 no).
// Ejecutar: node --env-file=.env experimentos/03_monto_max.ts
import { send, reset } from "../src/probe.ts";
import { firmar } from "../src/control.ts";

for (const monto of ["10000000000", "99999999999", "100000000000"]) {
  const seq = `monto-max-${monto.length}d-${monto[0]}`;
  await reset(seq);
  await send({ seq, body: { m: firmar("ALTA;Ana") }, hipotesis: "setup: crear AC-0001" });
  const r = await send({ seq, body: { m: firmar(`DEPOSITO;AC-0001;${monto}`) }, hipotesis: `monto máximo de un depósito: ${monto.length} dígitos` });
  console.log(`${monto} (${monto.length} dígitos) -> ${r.status} ${r.raw}`);
}
