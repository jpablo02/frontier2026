# Prompt 07 — Revisión del código de la réplica

Contexto: hackathon Frontier (Lab10), Reto 2. `src/replica.ts` es un reemplazo compatible de un
servicio de juguete de los organizadores (un "banco" ficticio). Lo van a evaluar con 100 tests
ocultos que comparan status y cuerpo exactos contra el original: 40 de un solo request, 45
secuencias de 2 a 5 y 15 secuencias de 6 a 12. Una secuencia falla entera si falla un paso.

Esta tarea es **solo de lectura y análisis**. No llames a ningún servicio, no ejecutes experimentos,
no leas `.env` ni archivos `.env*`, y **no modifiques ningún archivo**.

Lee `src/replica.ts` completo, `ESPECIFICACION.md`, `analisis/08_hipotesis_v2.md` y
`analisis/01_entrada.md`.

Hace un momento encontramos un error de este tipo: al agregar el comando `HALT` se añadió su
aridad y su handler, pero no su entrada en `PASOS_COMANDO`. El lookup devolvía `undefined`, la
función reventaba y la réplica respondía `500` en vez del `409` correcto. **Busca errores de esa
familia.**

## Qué revisar

1. **Caminos que revientan.** Cualquier entrada que haga lanzar una excepción: lookups que devuelven
   `undefined`, accesos con `!` a valores que pueden no existir, índices fuera de rango, conversiones
   numéricas que dan `NaN`. Para cada uno: qué mensaje exacto lo provoca y qué responde la réplica.
2. **Coherencia entre las tablas.** `ARIDAD`, `PASOS_COMANDO`, `EJECUTAR` y `COMANDOS_CONOCIDOS`
   deben estar alineadas. Señala cualquier comando presente en una y ausente en otra.
3. **Estado y secuencias largas.** Las secuencias de 6 a 12 pasos son 15 de los 100 tests. Revisa
   los contadores `AC-`/`OP-`, los saldos, las anulaciones y `__reset`: ¿hay algún camino donde un
   error consuma un número que no debería, o donde el estado quede inconsistente? ¿Qué pasa al pasar
   de `AC-9999` a `AC-10000`?
4. **Formato exacto de las respuestas.** Claves, tipos (string contra número), textos literales,
   tildes y el espacio final de `"comando desconocido "`. Compara contra lo que muestra
   `analisis/01_entrada.md` y la spec.
5. **Orden de validaciones.** Verifica que el orden implementado coincida con el documentado y con
   la evidencia citada.

## Entrega

Una lista de hallazgos ordenada por gravedad. Cada uno con: línea de `src/replica.ts`, el mensaje
exacto que lo dispara, qué responde hoy la réplica, qué debería responder según la evidencia, y si
es un error confirmado o una sospecha. Si no encuentras nada en algún punto, dilo explícitamente.
No propongas parches: solo identifica.
