# Prompt 05 — Revisión crítica antes de la corrida 2

Contexto: hackathon Frontier (Lab10), Reto 2. Tenemos un reemplazo compatible de un servicio de
juguete de los organizadores (un "banco" ficticio). A las 16:00 los organizadores desplegaron una
"versión 2" del servicio y anunciaron en un ticket que **cambiaron exactamente 3 comportamientos**.
Nosotros encontramos 2 y los aplicamos a la réplica. **Falta 1 por encontrar.**

Esta tarea es de **análisis**, no de ejecución. No llames a ningún servicio, no corras experimentos,
no leas `.env` ni archivos `.env*`, y no modifiques código.

Lee: `ESPECIFICACION.md`, `src/replica.ts`, `analisis/06_cambios_v2_completa_1601.md`,
`analisis/07_limite_v2.md`, `analisis/canary_v2.md`, `analisis/02_preguntas_abiertas.md`,
`analisis/01_entrada.md`, `analisis/02_limites.md`, `analisis/04_orden_anula.md` y
`frontier-reto-2/README.md` (cómo se evalúa).

Los 2 cambios encontrados en la versión 2:
1. El límite de TRANSFER bajó de 100000 a 50000 (50000 pasa, 50001 falla).
2. CONSULTA devuelve el saldo como string con 2 decimales, con el valor interno dividido entre 100
   (40000 → `"400.00"`, -800 → `"-8.00"`, 12345 → `"123.45"`).

Método con el que encontramos esos 2: repetimos contra la versión 2 las 451 llamadas que teníamos
grabadas de la versión 1 y comparamos. El tercer cambio **no apareció** ahí, así que está en algo
que nunca le preguntamos a la versión 1.

## Lo que necesito de ti

1. **Dónde puede estar el tercer cambio.** Dame entre 8 y 12 hipótesis concretas, ordenadas por
   probabilidad, cada una con: qué mensaje exacto habría que mandar para comprobarla, qué responde
   hoy nuestra réplica y por qué ese lugar es sospechoso. Pista: los 2 cambios encontrados son
   "de dinero" (montos y formato de saldo); evalúa si el tercero seguiría ese patrón, pero
   considera también otras zonas.

2. **Coherencia de la réplica con los 2 cambios ya aplicados.** Revisa `src/replica.ts` buscando
   lugares donde el cambio de formato del saldo o el nuevo límite deberían haberse propagado y no
   lo hicieron (por ejemplo, otros sitios donde se devuelva un monto, comparaciones de saldo,
   mensajes de error relacionados). Cita línea y explica el riesgo.

3. **Coherencia de la especificación.** Di qué partes de `ESPECIFICACION.md` quedaron desactualizadas
   por la versión 2 y deben corregirse antes de la entrega de las 20:00. Una afirmación falsa resta
   puntos.

4. **Veredicto.** Con 2 corridas oficiales restantes y el cierre a las 20:00: ¿conviene gastar la
   corrida 2 ahora, o primero buscar el tercer cambio? Argumenta con el peso de cada criterio de la
   rúbrica y di qué información daría la corrida que no podamos obtener de otra forma.

Responde en español, directo y en viñetas. No inventes: si algo no está en los archivos, dilo.
