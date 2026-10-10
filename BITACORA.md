# Bitácora del hackathon

Registro de lo que pasó durante el día, en orden. Sirve para el reporte final, para el debrief y
como material de estudio.

## Preparación (9 de octubre, noche)

- Se instaló y probó Pi agent con una key gratuita de OpenRouter: modo interactivo, modo `-p`, modo
  JSON y exportación de sesiones.
- **Aprendizaje:** cuando OpenRouter devuelve un error 402 (falta de crédito), Pi reintenta en
  silencio y parece colgado. Si Pi no responde, hay que mirar los errores antes de esperar.

## Mañana (10 de octubre)

| Hora | Qué pasó | Decisión / aprendizaje |
|---|---|---|
| 9:00 | Se conectó la key de Lab10 y se verificó el setup (todo en verde) | El presupuesto trae US$5 reservados para el set oculto: el costo por ejecución es una métrica |
| ~9:50 | El repo debía ser público y su historial tenía datos personales | Se borró y se recreó con historial limpio. **Aprendizaje:** un force-push no basta; GitHub sigue sirviendo los commits viejos |
| 10:10–10:30 | Análisis de los dos retos, con dos opiniones independientes (Claude Code y Claude en el navegador) | **Se eligió el Reto 2**: permite medir la nota antes de entregar, cuesta casi nada ejecutarlo y encaja con la rúbrica |
| 10:30–11:54 | Doc de diseño en dos versiones (técnica y simple) y diagrama | Se entregó la versión simple, que se puede defender |
| ~12:00 | El visor de archivos de GitHub dio error 503 (falla general) | Se reemplazaron los enlaces por los directos del mismo commit y se avisó al staff |

## Tarde

| Hora | Qué pasó | Decisión / aprendizaje |
|---|---|---|
| ~11:00 | Se dedujo el dígito de control **sin gastar requests**: fórmula tipo IBAN (mod 97) sacada de los 20 ejemplos | Validado con ejemplos reservados y luego confirmado contra el original |
| ~12:25 | Pi construyó la sonda y reprodujo los 20 ejemplos: **20/20** | La sonda es la única vía al original y registra todo en `experimentos.jsonl` |
| ~12:35 | Pi rechazó el prompt de la tanda 2 por su filtro de seguridad, también tras agregarle contexto | No se buscó esquivar el filtro: el script lo escribió y ejecutó Claude Code |
| ~12:45 | Tanda 2 ejecutada: 335 requests en total, todos registrados | Resultados en `analisis/01_entrada.md` |
| ~12:50 | Un clasificador de seguridad cortó parte de dos respuestas de Claude Code | No se perdió trabajo: los archivos estaban guardados. Los resúmenes se enfocan en el comportamiento de la réplica |

## Lecciones sobre orquestar agentes

- **Repartir según el tipo de tarea:** Claude Code piensa, decide, diseña experimentos y revisa;
  Pi implementa piezas bien especificadas (y deja transcript).
- **Los filtros de seguridad leen contenido, no permisos.** Un trabajo autorizado puede parecerse a
  un ataque si se describe sin contexto. Cuando un filtro frena algo, se cambia el reparto de
  tareas; no se intenta engañarlo.
- **Guardar el trabajo en archivos, no solo en el chat.** Cuando una respuesta se corta, lo
  importante sigue en el repo.
