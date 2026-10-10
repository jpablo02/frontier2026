# Prompt 09 — Secuencias aleatorias largas (búsqueda a ciegas)

Contexto: hackathon Frontier (Lab10), Reto 2. Reemplazo compatible de un servicio de juguete de los
organizadores (un "banco" ficticio). El README oficial autoriza esto: "Scripts y fuzzers propios
están permitidos" y "Nada de lo que hagas con tu token es irreversible: POST /__reset lo repara".
Usamos nuestro token personal, respetamos sus límites (10 req/s y 8.000/día; vamos a 8 req/s) y
todo queda en `experimentos.jsonl`, que se entrega a los jueces.

No leas `.env` ni archivos `.env*`. No modifiques `src/replica.ts` ni `ESPECIFICACION.md`.

## Por qué esta ronda

El set oculto acaba de revelar su desglose. En la corrida 1 sacamos 34/40 en los casos fáciles,
23/40 en los regulares y **3/20 en los difíciles**. El motivo más frecuente de fallo fue
"caen más adelante en la secuencia" (23 casos): la réplica arranca bien y se desvía a mitad.

Tu ronda anterior (`experimentos/09_secuencias.ts`, 14 secuencias escritas a mano) coincidió al
100%. Eso prueba que **las secuencias que se nos ocurren a mano no se parecen a las suyas**. Por eso
ahora toca buscar a ciegas, con secuencias generadas al azar.

## Qué hacer

Lee `experimentos/09_secuencias.ts` (patrón), `src/probe.ts`, `src/control.ts` y `ESPECIFICACION.md`.

Escribe `experimentos/10_aleatorias.ts`:

1. **Generador con semilla fija** (para que sea reproducible; por ejemplo un PRNG simple con semilla
   42), que arme secuencias de **6 a 12 mensajes** eligiendo al azar entre todos los comandos
   conocidos (PING, ALTA, CONSULTA, DEPOSITO, TRANSFER, ANULA, HALT) y también mensajes inválidos
   (comando desconocido, aridad mal, control mal, monto raro, cuenta inexistente).
2. Los argumentos salen al azar del estado ya creado en la secuencia (cuentas `AC-NNNN` existentes,
   operaciones `OP-NNNN` existentes) y, a veces, de valores inexistentes. Los montos se eligen de un
   conjunto que cubra los bordes: 1, 99, 100, 49999, 50000, 50001, 99999999, 9999999999, 0,
   negativos y no numéricos.
3. **Unas 25 secuencias**, con `reset(seq)` al inicio de cada una, prefijo `alea-`, `firmar()` para
   el control válido (y controles mal formados a propósito en algunos casos). Tope: 250 requests.
4. Ejecútalo **una sola vez**: `node --env-file=.env experimentos/10_aleatorias.ts`.
5. Después levanta la réplica en local en un puerto libre (por ejemplo 8099) y compárala contra lo
   que acabas de grabar: `DESDE_ID=<primer id de esta ronda> node --env-file=.env src/diff.ts
   http://localhost:8099`. Apágala al terminar.
6. Escribe `analisis/10_aleatorias.md` con la tabla de resultados y, sobre todo, **cada diferencia**
   entre el original y la réplica, con el mensaje exacto, lo que respondió cada uno y en qué paso de
   la secuencia ocurrió.

## Entrega

- Cuántos requests usaste y cuántas secuencias.
- **Cada diferencia encontrada**, con su id del log. Si no hay ninguna, dilo claramente.
- Si hay diferencias, intenta deducir la regla exacta que las explica, sin modificar la réplica.

No hagas commit. Hay un canario corriendo contra el mismo token; `src/probe.ts` ya serializa los
resets con un candado, así que solo usa `reset()` como en el patrón.
