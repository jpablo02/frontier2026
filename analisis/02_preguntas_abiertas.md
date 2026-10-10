# Preguntas abiertas sobre el banco

Lo que todavía no sabemos y que la réplica hoy resuelve con un supuesto. La corrida 1 dio 60/100:
la mayoría de las fallas deberían estar aquí. Ordenadas por impacto estimado.

## 1. Límite de transferencia

| Pregunta | Supuesto actual de la réplica | Por qué importa |
|---|---|---|
| ¿Cuál es el monto máximo de una transferencia? Sabemos que 100.000 pasa y 120.000 no | Máximo 100.000, inclusivo | Aparece en cualquier secuencia con transferencias |
| ¿El límite es por transferencia o acumulado? (por ejemplo, ¿dos de 60.000 seguidas pasan?) | Por transferencia | En secuencias largas cambia el resultado |
| Si es acumulado: ¿anular una transferencia libera ese cupo? ¿Es por cuenta de origen? | — | Idem |

## 2. Montos

| Pregunta | Supuesto actual | Por qué importa |
|---|---|---|
| ¿Cuál es el monto máximo de un depósito? Sabemos que 500.000 pasa y 999.999.999.999 no | Hasta 9 dígitos | Montos grandes son un caso de prueba típico |
| ¿Un depósito tiene límite propio, como la transferencia? | No | Idem |

## 3. Orden de errores dentro de un comando

| Pregunta | Supuesto actual | Por qué importa |
|---|---|---|
| Monto inválido y cuenta inexistente a la vez, ¿cuál se reporta? | Monto inválido primero | Los tests de un solo mensaje combinan fallas |
| Origen igual a destino y cuenta inexistente a la vez | Origen = destino primero | Idem |
| Límite excedido y saldo insuficiente a la vez (cuenta sin dinero que transfiere 120.000) | Límite primero | Idem |
| Cuenta inexistente y límite excedido a la vez | — | Idem |

## 4. Anulaciones

| Pregunta | Supuesto actual | Por qué importa |
|---|---|---|
| Si anulo una transferencia y el destino ya gastó ese dinero, ¿qué pasa? | Se anula igual y el saldo queda negativo | Secuencias largas |
| ¿Anular consume un número de operación? | No | Afecta los números `OP-` siguientes |
| ¿Se puede anular una anulación? | — | — |

## 5. Numeración

| Pregunta | Supuesto actual | Por qué importa |
|---|---|---|
| ¿Una transferencia rechazada por saldo insuficiente consume número de operación? (por límite excedido no consume) | No | Un número corrido arruina toda la secuencia |
| ¿Un depósito rechazado consume número? | No | Idem |
| ¿Formatos distintos de cuenta (`ac-0001` en minúsculas, `AC-1`) se aceptan? | No | Tests de un solo mensaje |

## 6. Sugerencias del comando desconocido

| Pregunta | Supuesto actual | Por qué importa |
|---|---|---|
| Cuando un comando no existe, a veces la respuesta trae una "sugerencia" de comando parecido. ¿Cuál es la regla? ¿Qué tan parecido debe ser el nombre? | Solo para los dos nombres ya vistos | Cualquier comando mal escrito en un test de un mensaje cambia el cuerpo |
| Una de las sugerencias apunta a un comando que no estaba en los ejemplos. ¿Qué hace, qué argumentos recibe y qué responde? | No existe | Podría ser un comando completo que no estamos replicando |

## 7. PING

| Pregunta | Supuesto actual | Por qué importa |
|---|---|---|
| PING ignora el valor del control. ¿Ignora también el formato (`PING;XX`)? | Ignora el valor | Tests de un mensaje |
