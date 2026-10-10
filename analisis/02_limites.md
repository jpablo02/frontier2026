# Límites, montos y numeración

| caso | id | mensaje | status | respuesta |
|---|---|---|---|---|
| transfer-100001 | 337 | ALTA;Ana;50 | 201 | {"cuentaId":"AC-0001"} |
| transfer-100001 | 338 | ALTA;Beto;11 | 201 | {"cuentaId":"AC-0002"} |
| transfer-100001 | 339 | DEPOSITO;AC-0001;900000;77 | 200 | {"status":"recieved","operacionId":"OP-0001"} |
| transfer-100001 | 340 | TRANSFER;AC-0001;AC-0002;100001;9 | 422 | {"error":"E506","mensaje":"límite excedido"} |
| transfer-105000 | 342 | ALTA;Ana;50 | 201 | {"cuentaId":"AC-0001"} |
| transfer-105000 | 343 | ALTA;Beto;11 | 201 | {"cuentaId":"AC-0002"} |
| transfer-105000 | 344 | DEPOSITO;AC-0001;900000;77 | 200 | {"status":"recieved","operacionId":"OP-0001"} |
| transfer-105000 | 345 | TRANSFER;AC-0001;AC-0002;105000;47 | 422 | {"error":"E506","mensaje":"límite excedido"} |
| transfer-110000 | 347 | ALTA;Ana;50 | 201 | {"cuentaId":"AC-0001"} |
| transfer-110000 | 348 | ALTA;Beto;11 | 201 | {"cuentaId":"AC-0002"} |
| transfer-110000 | 349 | DEPOSITO;AC-0001;900000;77 | 200 | {"status":"recieved","operacionId":"OP-0001"} |
| transfer-110000 | 350 | TRANSFER;AC-0001;AC-0002;110000;82 | 422 | {"error":"E506","mensaje":"límite excedido"} |
| transfer-119999 | 352 | ALTA;Ana;50 | 201 | {"cuentaId":"AC-0001"} |
| transfer-119999 | 353 | ALTA;Beto;11 | 201 | {"cuentaId":"AC-0002"} |
| transfer-119999 | 354 | DEPOSITO;AC-0001;900000;77 | 200 | {"status":"recieved","operacionId":"OP-0001"} |
| transfer-119999 | 355 | TRANSFER;AC-0001;AC-0002;119999;58 | 422 | {"error":"E506","mensaje":"límite excedido"} |
| acumulado-60-60 | 357 | ALTA;Ana;50 | 201 | {"cuentaId":"AC-0001"} |
| acumulado-60-60 | 358 | ALTA;Beto;11 | 201 | {"cuentaId":"AC-0002"} |
| acumulado-60-60 | 359 | DEPOSITO;AC-0001;900000;77 | 200 | {"status":"recieved","operacionId":"OP-0001"} |
| acumulado-60-60 | 360 | TRANSFER;AC-0001;AC-0002;60000;32 | 200 | {"status":"recieved","operacionId":"OP-0002"} |
| acumulado-60-60 | 361 | TRANSFER;AC-0001;AC-0002;60000;32 | 200 | {"status":"recieved","operacionId":"OP-0003"} |
| acumulado-100-1 | 363 | ALTA;Ana;50 | 201 | {"cuentaId":"AC-0001"} |
| acumulado-100-1 | 364 | ALTA;Beto;11 | 201 | {"cuentaId":"AC-0002"} |
| acumulado-100-1 | 365 | DEPOSITO;AC-0001;900000;77 | 200 | {"status":"recieved","operacionId":"OP-0001"} |
| acumulado-100-1 | 366 | TRANSFER;AC-0001;AC-0002;100000;12 | 200 | {"status":"recieved","operacionId":"OP-0002"} |
| acumulado-100-1 | 367 | TRANSFER;AC-0001;AC-0002;1;41 | 200 | {"status":"recieved","operacionId":"OP-0003"} |
| deposito-999999999 | 369 | ALTA;Ana;50 | 201 | {"cuentaId":"AC-0001"} |
| deposito-999999999 | 370 | DEPOSITO;AC-0001;999999999;4 | 200 | {"status":"recieved","operacionId":"OP-0001"} |
| deposito-1000000000 | 372 | ALTA;Ana;50 | 201 | {"cuentaId":"AC-0001"} |
| deposito-1000000000 | 373 | DEPOSITO;AC-0001;1000000000;46 | 200 | {"status":"recieved","operacionId":"OP-0001"} |
| deposito-9999999999 | 375 | ALTA;Ana;50 | 201 | {"cuentaId":"AC-0001"} |
| deposito-9999999999 | 376 | DEPOSITO;AC-0001;9999999999;4 | 200 | {"status":"recieved","operacionId":"OP-0001"} |
| numeracion-saldo | 378 | ALTA;Ana;50 | 201 | {"cuentaId":"AC-0001"} |
| numeracion-saldo | 379 | ALTA;Beto;11 | 201 | {"cuentaId":"AC-0002"} |
| numeracion-saldo | 380 | TRANSFER;AC-0001;AC-0002;500;85 | 422 | {"error":"E507","mensaje":"saldo insuficiente"} |
| numeracion-saldo | 381 | DEPOSITO;AC-0001;100;82 | 200 | {"status":"recieved","operacionId":"OP-0001"} |
| numeracion-monto | 383 | ALTA;Ana;50 | 201 | {"cuentaId":"AC-0001"} |
| numeracion-monto | 384 | DEPOSITO;AC-0001;0;31 | 400 | {"error":"E303","mensaje":"monto inválido"} |
| numeracion-monto | 385 | DEPOSITO;AC-0001;100;82 | 200 | {"status":"recieved","operacionId":"OP-0001"} |
| numeracion-anula | 387 | ALTA;Ana;50 | 201 | {"cuentaId":"AC-0001"} |
| numeracion-anula | 388 | DEPOSITO;AC-0001;100;82 | 200 | {"status":"recieved","operacionId":"OP-0001"} |
| numeracion-anula | 389 | ANULA;OP-0001;72 | 200 | {"ok":true,"anulada":"OP-0001"} |
| numeracion-anula | 390 | DEPOSITO;AC-0001;100;82 | 200 | {"status":"recieved","operacionId":"OP-0002"} |
