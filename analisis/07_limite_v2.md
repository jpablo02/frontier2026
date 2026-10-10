# Límite de transferencia en la versión 2

| caso | id | mensaje | status | respuesta |
|---|---|---|---|---|
| transfer-40001 | 2334 | ALTA;Ana;50 | 201 | {"cuentaId":"AC-0001"} |
| transfer-40001 | 2335 | ALTA;Beto;11 | 201 | {"cuentaId":"AC-0002"} |
| transfer-40001 | 2336 | DEPOSITO;AC-0001;900000;77 | 200 | {"status":"recieved","operacionId":"OP-0001"} |
| transfer-40001 | 2337 | TRANSFER;AC-0001;AC-0002;40001;83 | 200 | {"status":"recieved","operacionId":"OP-0002"} |
| transfer-45000 | 2339 | ALTA;Ana;50 | 201 | {"cuentaId":"AC-0001"} |
| transfer-45000 | 2340 | ALTA;Beto;11 | 201 | {"cuentaId":"AC-0002"} |
| transfer-45000 | 2341 | DEPOSITO;AC-0001;900000;77 | 200 | {"status":"recieved","operacionId":"OP-0001"} |
| transfer-45000 | 2342 | TRANSFER;AC-0001;AC-0002;45000;24 | 200 | {"status":"recieved","operacionId":"OP-0002"} |
| transfer-49999 | 2344 | ALTA;Ana;50 | 201 | {"cuentaId":"AC-0001"} |
| transfer-49999 | 2345 | ALTA;Beto;11 | 201 | {"cuentaId":"AC-0002"} |
| transfer-49999 | 2346 | DEPOSITO;AC-0001;900000;77 | 200 | {"status":"recieved","operacionId":"OP-0001"} |
| transfer-49999 | 2347 | TRANSFER;AC-0001;AC-0002;49999;62 | 200 | {"status":"recieved","operacionId":"OP-0002"} |
| transfer-50000 | 2349 | ALTA;Ana;50 | 201 | {"cuentaId":"AC-0001"} |
| transfer-50000 | 2350 | ALTA;Beto;11 | 201 | {"cuentaId":"AC-0002"} |
| transfer-50000 | 2351 | DEPOSITO;AC-0001;900000;77 | 200 | {"status":"recieved","operacionId":"OP-0001"} |
| transfer-50000 | 2352 | TRANSFER;AC-0001;AC-0002;50000;59 | 200 | {"status":"recieved","operacionId":"OP-0002"} |
| transfer-50001 | 2354 | ALTA;Ana;50 | 201 | {"cuentaId":"AC-0001"} |
| transfer-50001 | 2355 | ALTA;Beto;11 | 201 | {"cuentaId":"AC-0002"} |
| transfer-50001 | 2356 | DEPOSITO;AC-0001;900000;77 | 200 | {"status":"recieved","operacionId":"OP-0001"} |
| transfer-50001 | 2357 | TRANSFER;AC-0001;AC-0002;50001;56 | 422 | {"error":"E506","mensaje":"límite excedido"} |
| transfer-55000 | 2359 | ALTA;Ana;50 | 201 | {"cuentaId":"AC-0001"} |
| transfer-55000 | 2360 | ALTA;Beto;11 | 201 | {"cuentaId":"AC-0002"} |
| transfer-55000 | 2361 | DEPOSITO;AC-0001;900000;77 | 200 | {"status":"recieved","operacionId":"OP-0001"} |
| transfer-55000 | 2362 | TRANSFER;AC-0001;AC-0002;55000;94 | 422 | {"error":"E506","mensaje":"límite excedido"} |
| transfer-59999 | 2364 | ALTA;Ana;50 | 201 | {"cuentaId":"AC-0001"} |
| transfer-59999 | 2365 | ALTA;Beto;11 | 201 | {"cuentaId":"AC-0002"} |
| transfer-59999 | 2366 | DEPOSITO;AC-0001;900000;77 | 200 | {"status":"recieved","operacionId":"OP-0001"} |
| transfer-59999 | 2367 | TRANSFER;AC-0001;AC-0002;59999;35 | 422 | {"error":"E506","mensaje":"límite excedido"} |
| acumulado-30-30 | 2369 | ALTA;Ana;50 | 201 | {"cuentaId":"AC-0001"} |
| acumulado-30-30 | 2370 | ALTA;Beto;11 | 201 | {"cuentaId":"AC-0002"} |
| acumulado-30-30 | 2371 | DEPOSITO;AC-0001;900000;77 | 200 | {"status":"recieved","operacionId":"OP-0001"} |
| acumulado-30-30 | 2372 | TRANSFER;AC-0001;AC-0002;30000;16 | 200 | {"status":"recieved","operacionId":"OP-0002"} |
| acumulado-30-30 | 2373 | TRANSFER;AC-0001;AC-0002;30000;16 | 200 | {"status":"recieved","operacionId":"OP-0003"} |
| deposito-grande | 2375 | ALTA;Ana;50 | 201 | {"cuentaId":"AC-0001"} |
| deposito-grande | 2376 | DEPOSITO;AC-0001;9999999999;4 | 200 | {"status":"recieved","operacionId":"OP-0001"} |
| deposito-grande | 2377 | CONSULTA;AC-0001;14 | 200 | {"cuenta_id":"AC-0001","saldo":"99999999.99"} |
| saldo-impar | 2379 | ALTA;Ana;50 | 201 | {"cuentaId":"AC-0001"} |
| saldo-impar | 2380 | DEPOSITO;AC-0001;12345;96 | 200 | {"status":"recieved","operacionId":"OP-0001"} |
| saldo-impar | 2381 | CONSULTA;AC-0001;14 | 200 | {"cuenta_id":"AC-0001","saldo":"123.45"} |
