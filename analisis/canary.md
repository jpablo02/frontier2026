# Canario

Línea base tomada a las 14:50 (seq `canary-1450`, 26 mensajes). Ids regenerados tras corregir la numeración del log.

- 15:00: sin cambios (seq `canary-1500`)
- 15:10: sin cambios (seq `canary-1510`)
- 15:20: sin cambios (seq `canary-1520`)
- 15:30: sin cambios (seq `canary-1530`)
- 15:40: sin cambios (seq `canary-1540`)
- 15:51: sin cambios (seq `canary-1551`)

## CAMBIO DETECTADO a las 16:01 (seq `canary-1601`)

| id antes | id ahora | mensaje | antes | ahora |
|---|---|---|---|---|
| 485 | 1798 | CONSULTA;AC-0001;14 | 200 {"cuenta_id":"AC-0001","saldo":0} | 200 {"cuenta_id":"AC-0001","saldo":"0.00"} |
| 488 | 1801 | CONSULTA;AC-0002;11 | 200 {"cuenta_id":"AC-0002","saldo":40000} | 200 {"cuenta_id":"AC-0002","saldo":"400.00"} |
| 490 | 1803 | TRANSFER;AC-0001;AC-0002;100000;12 | 200 {"status":"recieved","operacionId":"OP-0003"} | 422 {"error":"E506","mensaje":"límite excedido"} |
| 491 | 1804 | CONSULTa;AC-0001;14 | 200 {"cuenta_id":"AC-0001","saldo":110000} | 200 {"cuenta_id":"AC-0001","saldo":"2100.00"} |
| 493 | 1806 | ANULA;OP-0003;66 | 200 {"ok":true,"anulada":"OP-0003"} | 404 {"error":"E402","mensaje":"operación inexistente"} |
| 494 | 1807 | ANULA;OP-0003;66 | 200 {"ok":false,"motivo":"ya anulada"} | 404 {"error":"E402","mensaje":"operación inexistente"} |
| 498 | 1811 | DEPOSITO;AC-0002;700;35 | 200 {"status":"recieved","operacionId":"OP-0004"} | 200 {"status":"recieved","operacionId":"OP-0003"} |
| 499 | 1812 | CONSULTA;AC-0002;11 | 200 {"cuenta_id":"AC-0002","saldo":40700} | 200 {"cuenta_id":"AC-0002","saldo":"407.00"} |
| 501 | 1814 | DEPOSITO;AC-0001;9999999999;4 | 200 {"status":"recieved","operacionId":"OP-0005"} | 200 {"status":"recieved","operacionId":"OP-0004"} |
