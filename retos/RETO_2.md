# Reto 2 — La caja negra

> Texto literal del dashboard (10 oct 2026, 09:47 BOG). No editar esta sección.

**Resumen:** Descubre cómo se comporta un servicio sin documentación y construye un reemplazo que responda exactamente igual.

## Brief

Heredamos un servicio que lleva 10 años en producción. Nadie sabe qué hace exactamente. No hay código fuente, no hay documentación y las dos personas que lo escribieron ya no están. Sabemos que recibe mensajes y responde, y que si lo apagamos la empresa se cae. Necesitamos entenderlo por completo y construir un reemplazo que se comporte exactamente igual, incluidos sus errores.

## Restricciones

- No uses herramientas que hagan el trabajo por ti. Scripts y fuzzers propios sí.
- El reemplazo no puede llamar al original ni a otro reemplazo.
- Entregables: el reemplazo desplegado, la especificación y el log de experimentos. El formato de los tres está en el **README de tu material**.

---

## Notas de análisis (nuestras)

- Es ingeniería inversa por caja negra: experimentos → hipótesis → spec → reemplazo → diff contra el original.
- **"Incluidos sus errores"**: los casos raros (entradas inválidas, límites, estado) valen tanto como el camino feliz. El set oculto seguramente compara respuesta por respuesta.
- **Log de experimentos es entregable**: encaja con "medir antes de diagnosticar" y con la rúbrica (evidencia escrita).
- **Riesgo**: si el servicio tiene estado o aleatoriedad/tiempo, replicarlo exacto es difícil.
- **Pendiente leer**: README del material (formato de spec, log y reemplazo), protocolo del servicio.
