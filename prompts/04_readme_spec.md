# Prompt 04 — README y borrador de la especificación

Contexto: hackathon Frontier (Lab10), Reto 2. Construimos un reemplazo compatible de un servicio de
juguete de los organizadores (un "banco" ficticio). Esta tarea es solo de documentación: no llames
a ningún servicio, no ejecutes los experimentos y no leas `.env` ni archivos `.env*`.

Lee: `frontier-reto-2/README.md` (formato exigido de la especificación), `DISENO.md`,
`BITACORA.md`, `src/replica.ts`, `src/probe.ts`, `src/control.ts`, `src/diff.ts`,
`experimentos/canary.ts`, todos los archivos de `analisis/` y `experimentos.jsonl`.

## 1. `README.md` (raíz del repo)

Para que otra persona entienda y corra el proyecto. En español, breve y claro:
- Qué es (un párrafo) y estado actual (comparador local al 100%, corrida oficial 1: 60/100).
- Estructura del repo: qué hay en `src/`, `experimentos/`, `analisis/`, `prompts/`,
  `transcripts/`, `docs/`.
- Cómo correr la réplica en local (`npm start` con `TEAM_TOKEN` y `PORT`) y el comparador
  (`npm run diff`). Variables de entorno según `.env.example` (nunca valores reales).
- Cómo se despliega (Railway, 1 instancia, sin modo serverless) y por qué.
- Cómo funcionan la sonda, el log de experimentos, el candado entre procesos y el canario.
- Enlaces a `DISENO.md`, `ESPECIFICACION.md`, `BITACORA.md`.

## 2. `ESPECIFICACION.md` (borrador)

Sigue **exactamente** la estructura del README del reto: secciones 1 a 7 (Entrada, Integridad,
Comandos, Memoria entre requests, Errores, Cambios durante el día, Riesgos), cada una con tabla
`ID | Comportamiento | Evidencia | Confianza`.

Reglas estrictas, porque una afirmación falsa resta puntos:
- **Cada comportamiento cita ids reales de `experimentos.jsonl`** que lo prueban. Verifica cada id
  leyendo esa línea: el request y la respuesta deben mostrar exactamente lo que afirmas.
- Confianza: `confirmado` solo si hay **al menos 2 líneas** del log que lo muestran; `probable` si
  hay una sola; `supuesto` si no hay evidencia y es lo que hace la réplica por defecto (busca los
  comentarios `// SUPUESTO:` en `src/replica.ts`).
- Textos de respuesta copiados **literal**, incluidos espacios finales, tildes y faltas de
  ortografía (por ejemplo `"recieved"` y `"comando desconocido "`).
- Integridad: describe la fórmula del dígito de control con un ejemplo calculado paso a paso.
- Errores: tabla con código, status, cuerpo exacto y posición en el orden de evaluación.
- Sección 6 (Cambios durante el día): por ahora, escribe que el canario tomó línea base a las 14:50
  sin cambios hasta el momento, y deja un marcador `<!-- INCIDENTE: completar -->`.
- No inventes comandos ni reglas que no estén en el log o en el código.

## 3. Entrega

- Al final, dame: número de comportamientos por sección, cuántos `confirmado`/`probable`/`supuesto`,
  y cualquier contradicción que hayas encontrado entre el log y `src/replica.ts`.
- No hagas commit.
