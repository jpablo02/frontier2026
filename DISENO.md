# [Nombre del sistema]

**Reto:** [1 o 2]
**Autor:** Juan Pablo Rios
**Fecha:** 10 de octubre de 2026

> Plantilla. Cada sección responde directamente a lo que la rúbrica define como
> nota 4. Borrar estas citas antes de entregar.

---

## Qué resuelve este sistema

> Rúbrica — nota 1: *"Repite el brief sin tomar decisiones."*
> Nota 4: *"Nombra supuestos, casos difíciles y lo que deja fuera, con razones."*

[Una o dos frases. No repetir el brief: decir qué decidí que significa, y cuál es
el límite del sistema.]

---

## Supuestos

[Qué estoy asumiendo que el brief no dice explícitamente. Cada supuesto con una
línea de por qué es razonable asumirlo.]

- **Supuesto:** …
  **Por qué:** …

---

## Qué queda fuera, y por qué

[Lo que decidí NO resolver. Esta sección sube la nota: demuestra criterio, no
omisión. Un sistema que lo intenta todo en 10 horas no hace nada bien.]

- **Fuera:** …
  **Razón:** …

---

## Casos difíciles

[Dónde se rompe esto. Ser específico.]

| Caso | Qué pasa | Cómo lo manejo |
|---|---|---|
| El servicio externo no responde | | |
| Entrada inesperada / malformada | | |
| Operación parcialmente completada | | |
| Carga concurrente | | |

---

## Arquitectura

[Diagrama. Si es mermaid, va inline; si es imagen, enlazarla.]

```
[diagrama aquí]
```

**Componentes:**

| Componente | Responsabilidad | Por qué existe |
|---|---|---|
| | | |

---

## Decisiones y alternativas descartadas

> Rúbrica — nota 1: *"Un diagrama sin decisiones detrás."*
> Nota 4: *"Cada decisión dice qué alternativa descartó y por qué."*

| Decisión | Alternativa considerada | Por qué la descarté |
|---|---|---|
| | | |

---

## Cómo mido que funciona

> Rúbrica — nota 1: *"No hay forma de medir el resultado."*
> Nota 4: *"Casos de prueba y métricas concretas desde el diseño."*

**Casos de prueba:**

| # | Entrada | Salida esperada | Por qué importa |
|---|---|---|---|
| 1 | | | |

**Métricas con objetivo:**

| Métrica | Objetivo | Cómo la mido |
|---|---|---|
| | | |

**Cómo sabría que está fallando en producción:**

[Señales concretas, no "monitoreo".]
