# Prompt 11 — Cerrar los supuestos que quedan (tiempo limitado)

Contexto: hackathon Frontier (Lab10), Reto 2. Reemplazo compatible de un servicio de juguete de los
organizadores (un "banco" ficticio). El README oficial autoriza esto: "Scripts y fuzzers propios
están permitidos" y "Nada de lo que hagas con tu token es irreversible: POST /__reset lo repara".
Token personal, 8 req/s, todo queda en `experimentos.jsonl`, que se entrega a los jueces.

No leas `.env` ni archivos `.env*`. No modifiques `src/replica.ts` ni `ESPECIFICACION.md`.

**Hay prisa: el cierre es a las 20:00 y son pasadas las 18:00.** Prioriza y sé eficiente.

## Dónde estamos

La corrida 2 del set oculto dio **87/100**: 40/40 en fáciles, 36/40 en regulares y 11/20 en
difíciles. Quedan 13 tests fallando: 10 por status distinto y 3 por cuerpo; 4 caen en el primer
request y 9 más adelante en la secuencia.

Como los fáciles están perfectos y fallan 4 en el primer request, esos 4 deben ser casos de un
mensaje que caen en las categorías regular o difícil.

## Qué hacer

Lee `ESPECIFICACION.md` (fíjate en las filas marcadas **supuesto** y **probable**),
`analisis/CORRIDAS.md`, `analisis/12_aleatorias2.md` (sección de huecos de cobertura) y
`experimentos/11_mismo_titular.ts` (patrón).

Escribe y ejecuta **un solo** experimento dirigido, `experimentos/13_cierre.ts` (prefijo de `seq`
`fin-`, tope 150 requests), que cierre las dudas con mayor probabilidad de estar en esos 13 tests.
Prioriza, en este orden:

1. **Titulares con espacios o variantes** (lo que la ronda 2 no alcanzó a probar con saldo
   suficiente): `Ana` contra `Ana ` y contra ` Ana`; `Ana` contra `Aná`; nombre vacío contra nombre
   vacío; nombres numéricos iguales. Siempre con depósito previo y monto 50001.
2. **Anular una transferencia de más de 50000 entre cuentas del mismo titular**, y consultar los dos
   saldos después.
3. **Desempates de sugerencia**: nombres a la misma distancia de dos comandos reales, por ejemplo
   `ALT`, `AL`, `HALTA`, `ATLA`, `ANULAR` y otros que se te ocurran, para ver qué desempata el
   original.
4. **El argumento de HALT**: `HALT;AC-0009`, `HALT;cualquiercosa`, y HALT con 2 argumentos. **No
   mandes ninguna palabra de confirmación**, porque el mensaje dice que detiene el servicio.
5. Si sobra presupuesto, cualquier otro supuesto de la spec que creas que puede estar en esos 13.

Después levanta la réplica en local (puerto 8099) y compara:
`DESDE_ID=<primer id de esta ronda> node --env-file=.env src/diff.ts http://localhost:8099`.
Apágala al terminar.

## Entrega

- Cada diferencia entre el original y la réplica, con su id y la regla exacta que la explica.
- Si no hay diferencias, dilo claramente: significa que esos supuestos ya eran correctos.
- Sé breve en la respuesta final. No hagas commit.
