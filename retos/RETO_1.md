# Reto 1 — El agente que opera lo que no tiene API

> Texto literal del dashboard (10 oct 2026, 09:47 BOG). No editar esta sección.

**Resumen:** Un agente que aprende a operar sistemas sin API, por pantalla, y ejecuta tareas en lenguaje natural en apps que nunca ha visto.

## Brief

Tenemos un sistema de gestión que usamos hace 15 años. No tiene API, no tiene documentación y el proveedor desapareció. Todo se hace a mano: clics, formularios, ventanas emergentes, reportes que se exportan uno por uno. Queremos un agente que aprenda a usar ese sistema como lo haría un empleado nuevo y que ejecute tareas que le pidamos en lenguaje natural, aunque nunca las haya hecho antes. Tenemos 5 sistemas como estos, así que el agente se debe poder adaptar a cualquiera.

## Restricciones

- No uses herramientas ni proveedores externos que hagan esto por ti.
- Las apps se acceden igual que la de pruebas.
- Entregable: el agente desplegado y accesible desde internet desde las 20:00 hasta que termine el demo day, con el contrato de abajo.

## Contrato del entrypoint

Desplegado por tu equipo, accesible desde internet desde las 20:00 hasta que termine el demo day. Todas las llamadas llevan `Authorization: Bearer <token>`. Despliégalo donde quieras.

| Llamada | Comportamiento |
|---|---|
| Header en todas | `Authorization: Bearer <token>` — token del equipo |
| `GET /health` | Responde 200 cuando el servicio está listo |
| `POST /tasks` | Recibe la tarea en lenguaje natural y el escritorio (URL y contraseña). Responde `{"task_id": "…"}` en **menos de 2 segundos** |
| `GET /tasks/{task_id}` | Devuelve estado (`en_curso`, `terminada`, `fallida`) y resumen |

Cada tarea tiene **5 minutos**. Se evalúa sobre **una app que tu agente no ha visto**, en un escritorio limpio de evaluación. El formato del resumen y las reglas de evaluación están en el **README de tu material**.

---

## Notas de análisis (nuestras)

- **"Escritorio (URL y contraseña)"**: no es una web app suelta; parece un escritorio remoto (VNC/noVNC o similar). Hay que confirmarlo con la app de pruebas. Si es un escritorio, Playwright del DOM no basta: hace falta visión (capturas + coordenadas). Esto define toda la arquitectura.
- **POST /tasks < 2 s**: obliga a procesar asíncrono (cola/worker); el agente no puede correr dentro de la request.
- **5 min por tarea**: presupuesto de pasos y de tiempo explícito; cortar y reportar `fallida` antes del límite.
- **App nunca vista**: nada hardcodeado por app; exploración + memoria dentro de la tarea.
- **Costo**: la reserva de US$5 paga el set oculto. Costo por tarea es métrica de diseño.
- **Desplegado y público**: necesitamos hosting con navegador/visión (no serverless de 10 s).
- **Pendiente leer**: README del material (formato del resumen, reglas de evaluación), app de pruebas.
