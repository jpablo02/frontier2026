# Prompt 06 — Verificar tus propias hipótesis del tercer cambio

Contexto: hackathon Frontier (Lab10), Reto 2. Los organizadores desplegaron la versión 2 de su
servicio de juguete (un "banco" ficticio) y anunciaron que cambiaron 3 comportamientos. Encontramos
2. En `transcripts/05-revision-v2.txt` está **tu propio análisis anterior**, con 11 hipótesis sobre
dónde puede estar el tercero, cada una con los mensajes exactos y los controles ya calculados.

Ahora toca comprobarlas contra el servicio. El README oficial del reto autoriza esto de forma
explícita: "Scripts y fuzzers propios están permitidos" y "Nada de lo que hagas con tu token es
irreversible: POST /__reset lo repara". Usamos nuestro token personal, respetamos el límite que
fijan ellos (10 req/s y 8.000/día; vamos a 8 req/s) y cada request queda registrado en
`experimentos.jsonl`, que se entrega a los jueces.

No leas `.env` ni archivos `.env*`. Los tokens llegan por `node --env-file=.env`.

## Qué hacer

1. Lee `transcripts/05-revision-v2.txt` (tu análisis), `experimentos/04_orden_anula.ts` (el patrón a
   seguir), `src/probe.ts` y `src/control.ts`.
2. Escribe `experimentos/08_hipotesis_v2.ts` siguiendo el mismo patrón que `04_orden_anula.ts`:
   - `seq` con prefijo `hip-`, un `reset(seq)` por caso, `firmar()` para el control.
   - Una `hipotesis` en español por request, que diga qué estás comprobando.
   - Escribe los resultados en `analisis/08_hipotesis_v2.md` con la tabla
     `| caso | id | mensaje | status | respuesta |`.
3. Incluye **las 11 hipótesis** de tu análisis, en ese orden, con los mensajes que ya propusiste.
   Agrega también el caso de saldos menores a un peso (`"0.05"` / `"-0.05"`) que mencionaste en la
   sección 2. Tope: 150 requests.
4. Ejecútalo **una sola vez**: `node --env-file=.env experimentos/08_hipotesis_v2.ts`.
5. Compara cada respuesta con lo que tu análisis decía que responde hoy nuestra réplica. Reporta:
   - Qué hipótesis quedaron **descartadas** (el original responde igual que la réplica).
   - Qué hipótesis revelan una **diferencia**: ahí está el tercer cambio. Cita los ids del log.
   - Si encuentras una diferencia, descríbela con precisión (regla exacta, valores de frontera), sin
     cambiar `src/replica.ts`.

## Importante

- No modifiques `src/replica.ts`, `ESPECIFICACION.md` ni ningún archivo fuera de
  `experimentos/08_hipotesis_v2.ts` y `analisis/08_hipotesis_v2.md`.
- No hagas commit.
- Hay un canario corriendo en otro proceso contra el mismo token; `src/probe.ts` ya tiene un candado
  que serializa los resets, así que no hagas nada especial, solo usa `reset()` como en el patrón.
- En tu respuesta final: cuántos requests usaste, qué hipótesis descartaste y cuál reveló el cambio.
