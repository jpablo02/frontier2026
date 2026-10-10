Escribí `README.md` y `ESPECIFICACION.md`. No llamé al servicio, no leí `.env` y no hice commit.

`experimentos.jsonl` y `analisis/canary.md` aparecen modificados porque el canario sigue corriendo y agregó la vuelta de las 15:00 (ids 507-533, sin cambios). Yo no los toqué. Esa vuelta la cité en la sección 6 como CAM-02. Por eso el borrador dice "sin cambios hasta el momento" y cita también las 15:00, además de la línea base de las 14:50. El marcador `<!-- INCIDENTE: completar -->` está en su lugar.

Un script revisó cada id citado contra el log: el status y el código de error coinciden con lo que afirma cada fila. La fórmula del dígito de control coincide con los 341 mensajes del log que tienen un control bien formado, sin excepciones; PING queda aparte porque no valida el control.

## Comportamientos por sección

| Sección | Total | Confirmado | Probable | Supuesto |
|---|---|---|---|---|
| 1. Entrada | 18 | 12 | 5 | 1 |
| 2. Integridad | 14 | 9 | 3 | 2 |
| 3. Comandos | 43 | 32 | 7 | 4 |
| 4. Memoria | 10 | 9 | 0 | 1 |
| 5. Errores | 21 | 7 | 12 | 2 |
| 6. Cambios | 3 | 3 | 0 | 0 |
| 7. Riesgos | 10 | 10 | 0 | 0 |
| **Total** | **119** | **82** | **27** | **10** |

La mayoría de los "probable" están en el orden de los errores: cada par se midió con un solo request.

## Contradicciones entre el log y el código

1. **Comentarios `// SUPUESTO:` desactualizados en `src/replica.ts`.** Cinco ya están medidos, y en todos el código hace lo mismo que el original:
   - monto inválido antes que cuenta inexistente (ids 403, 407);
   - origen igual a destino antes que cuenta inexistente (411);
   - límite antes que saldo (419);
   - el corte del límite entre 100001 y 119999 (340-355);
   - la anulación que deja saldo negativo (440, 447).

   El de origen igual a destino dice "no medido", pero el id 411 lo midió.
2. **Ids mal citados en un comentario.** Dice "ids 392-399" para el monto de 11 dígitos, pero el 392 es un `ALTA`. Los ids correctos son 393, 396 y 399.
3. **`.env.example` está incompleto.** No trae `TEAM_TOKEN` ni `CAJA_NEGRA_TOKEN`, que usan la réplica, el comparador y la sonda. Lo dejé dicho en el README.
4. **Header `X-Req`.** En el original es un contador que no vuelve a cero con `/__reset` (ids 21 y 23). La réplica no lo envía. No resta puntos porque el set no compara headers.
5. **`PING;XX`.** El ejemplo del formato del log en el README del reto sugiere que responde `pong`. La réplica responde "control mal formado" (E201). No está medido, así que quedó como supuesto (INT-13).
6. **Token aceptado.** El original rechaza el token del equipo (ids 36, 44, 52) y la réplica solo acepta ese, como pide el contrato del reto. Es a propósito; lo aclaré en ENT-10.
