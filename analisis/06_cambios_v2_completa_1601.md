# Cambios de la versión 2 (incidente)

Se repitieron 451 requests de la versión 1 a las 16:01. Diferencias: 28.

| id v1 | id v2 | request | respuesta v1 | respuesta v2 |
|---|---|---|---|---|
| 6 | 1825 | CONSULTA;AC-0001;14 | 200 {"cuenta_id":"AC-0001","saldo":0} | 200 {"cuenta_id":"AC-0001","saldo":"0.00"} |
| 9 | 1828 | CONSULTA;AC-0002;11 | 200 {"cuenta_id":"AC-0002","saldo":40000} | 200 {"cuenta_id":"AC-0002","saldo":"400.00"} |
| 11 | 1830 | TRANSFER;AC-0001;AC-0002;100000;12 | 200 {"status":"recieved","operacionId":"OP-0003"} | 422 {"error":"E506","mensaje":"límite excedido"} |
| 12 | 1831 | CONSULTa;AC-0001;14 | 200 {"cuenta_id":"AC-0001","saldo":110000} | 200 {"cuenta_id":"AC-0001","saldo":"2100.00"} |
| 14 | 1833 | ANULA;OP-0003;66 | 200 {"ok":true,"anulada":"OP-0003"} | 404 {"error":"E402","mensaje":"operación inexistente"} |
| 15 | 1834 | ANULA;OP-0003;66 | 200 {"ok":false,"motivo":"ya anulada"} | 404 {"error":"E402","mensaje":"operación inexistente"} |
| 19 | 1838 | DEPOSITO;AC-0002;700;35 | 200 {"status":"recieved","operacionId":"OP-0004"} | 200 {"status":"recieved","operacionId":"OP-0003"} |
| 20 | 1839 | CONSULTA;AC-0002;11 | 200 {"cuenta_id":"AC-0002","saldo":40700} | 200 {"cuenta_id":"AC-0002","saldo":"407.00"} |
| 162 | 1959 | CONSULTA;AC-0001;14 | 200 {"cuenta_id":"AC-0001","saldo":0} | 200 {"cuenta_id":"AC-0001","saldo":"0.00"} |
| 328 | 2125 | CONSULTA;AC-0001;14 | 200 {"cuenta_id":"AC-0001","saldo":0} | 200 {"cuenta_id":"AC-0001","saldo":"0.00"} |
| 360 | 2157 | TRANSFER;AC-0001;AC-0002;60000;32 | 200 {"status":"recieved","operacionId":"OP-0002"} | 422 {"error":"E506","mensaje":"límite excedido"} |
| 361 | 2158 | TRANSFER;AC-0001;AC-0002;60000;32 | 200 {"status":"recieved","operacionId":"OP-0003"} | 422 {"error":"E506","mensaje":"límite excedido"} |
| 366 | 2163 | TRANSFER;AC-0001;AC-0002;100000;12 | 200 {"status":"recieved","operacionId":"OP-0002"} | 422 {"error":"E506","mensaje":"límite excedido"} |
| 367 | 2164 | TRANSFER;AC-0001;AC-0002;1;41 | 200 {"status":"recieved","operacionId":"OP-0003"} | 200 {"status":"recieved","operacionId":"OP-0002"} |
| 439 | 2236 | CONSULTA;AC-0001;14 | 200 {"cuenta_id":"AC-0001","saldo":1800} | 200 {"cuenta_id":"AC-0001","saldo":"18.00"} |
| 440 | 2237 | CONSULTA;AC-0002;11 | 200 {"cuenta_id":"AC-0002","saldo":-800} | 200 {"cuenta_id":"AC-0002","saldo":"-8.00"} |
| 447 | 2244 | CONSULTA;AC-0001;14 | 200 {"cuenta_id":"AC-0001","saldo":-1000} | 200 {"cuenta_id":"AC-0001","saldo":"-10.00"} |
| 453 | 2250 | CONSULTA;AC-0001;14 | 200 {"cuenta_id":"AC-0001","saldo":0} | 200 {"cuenta_id":"AC-0001","saldo":"0.00"} |
| 467 | 2264 | CONSULTA;AC-0001;14 | 200 {"cuenta_id":"AC-0001","saldo":0} | 200 {"cuenta_id":"AC-0001","saldo":"0.00"} |
| 485 | 2282 | CONSULTA;AC-0001;14 | 200 {"cuenta_id":"AC-0001","saldo":0} | 200 {"cuenta_id":"AC-0001","saldo":"0.00"} |
| 488 | 2285 | CONSULTA;AC-0002;11 | 200 {"cuenta_id":"AC-0002","saldo":40000} | 200 {"cuenta_id":"AC-0002","saldo":"400.00"} |
| 490 | 2287 | TRANSFER;AC-0001;AC-0002;100000;12 | 200 {"status":"recieved","operacionId":"OP-0003"} | 422 {"error":"E506","mensaje":"límite excedido"} |
| 491 | 2288 | CONSULTa;AC-0001;14 | 200 {"cuenta_id":"AC-0001","saldo":110000} | 200 {"cuenta_id":"AC-0001","saldo":"2100.00"} |
| 493 | 2290 | ANULA;OP-0003;66 | 200 {"ok":true,"anulada":"OP-0003"} | 404 {"error":"E402","mensaje":"operación inexistente"} |
| 494 | 2291 | ANULA;OP-0003;66 | 200 {"ok":false,"motivo":"ya anulada"} | 404 {"error":"E402","mensaje":"operación inexistente"} |
| 498 | 2295 | DEPOSITO;AC-0002;700;35 | 200 {"status":"recieved","operacionId":"OP-0004"} | 200 {"status":"recieved","operacionId":"OP-0003"} |
| 499 | 2296 | CONSULTA;AC-0002;11 | 200 {"cuenta_id":"AC-0002","saldo":40700} | 200 {"cuenta_id":"AC-0002","saldo":"407.00"} |
| 501 | 2298 | DEPOSITO;AC-0001;9999999999;4 | 200 {"status":"recieved","operacionId":"OP-0005"} | 200 {"status":"recieved","operacionId":"OP-0004"} |
