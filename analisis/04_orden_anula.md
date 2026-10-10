# Orden de errores y anulaciones

| caso | id | mensaje | status | respuesta |
|---|---|---|---|---|
| monto-vs-cuenta-deposito | 401 | ALTA;Ana;50 | 201 | {"cuentaId":"AC-0001"} |
| monto-vs-cuenta-deposito | 402 | ALTA;Beto;11 | 201 | {"cuentaId":"AC-0002"} |
| monto-vs-cuenta-deposito | 403 | DEPOSITO;AC-0009;0;82 | 400 | {"error":"E303","mensaje":"monto inválido"} |
| monto-vs-cuenta-transfer | 405 | ALTA;Ana;50 | 201 | {"cuentaId":"AC-0001"} |
| monto-vs-cuenta-transfer | 406 | ALTA;Beto;11 | 201 | {"cuentaId":"AC-0002"} |
| monto-vs-cuenta-transfer | 407 | TRANSFER;AC-0009;AC-0002;0;63 | 400 | {"error":"E303","mensaje":"monto inválido"} |
| iguales-vs-cuenta | 409 | ALTA;Ana;50 | 201 | {"cuentaId":"AC-0001"} |
| iguales-vs-cuenta | 410 | ALTA;Beto;11 | 201 | {"cuentaId":"AC-0002"} |
| iguales-vs-cuenta | 411 | TRANSFER;AC-0009;AC-0009;100;33 | 400 | {"error":"E304","mensaje":"origen y destino iguales"} |
| iguales-vs-monto | 413 | ALTA;Ana;50 | 201 | {"cuentaId":"AC-0001"} |
| iguales-vs-monto | 414 | ALTA;Beto;11 | 201 | {"cuentaId":"AC-0002"} |
| iguales-vs-monto | 415 | TRANSFER;AC-0001;AC-0001;0;74 | 400 | {"error":"E303","mensaje":"monto inválido"} |
| limite-vs-saldo | 417 | ALTA;Ana;50 | 201 | {"cuentaId":"AC-0001"} |
| limite-vs-saldo | 418 | ALTA;Beto;11 | 201 | {"cuentaId":"AC-0002"} |
| limite-vs-saldo | 419 | TRANSFER;AC-0001;AC-0002;120000;55 | 422 | {"error":"E506","mensaje":"límite excedido"} |
| cuenta-vs-limite | 421 | ALTA;Ana;50 | 201 | {"cuentaId":"AC-0001"} |
| cuenta-vs-limite | 422 | ALTA;Beto;11 | 201 | {"cuentaId":"AC-0002"} |
| cuenta-vs-limite | 423 | TRANSFER;AC-0009;AC-0002;120000;19 | 404 | {"error":"E401","mensaje":"cuenta inexistente"} |
| destino-vs-saldo | 425 | ALTA;Ana;50 | 201 | {"cuentaId":"AC-0001"} |
| destino-vs-saldo | 426 | ALTA;Beto;11 | 201 | {"cuentaId":"AC-0002"} |
| destino-vs-saldo | 427 | TRANSFER;AC-0001;AC-0009;500;37 | 404 | {"error":"E401","mensaje":"cuenta inexistente"} |
| iguales-vs-limite | 429 | ALTA;Ana;50 | 201 | {"cuentaId":"AC-0001"} |
| iguales-vs-limite | 430 | ALTA;Beto;11 | 201 | {"cuentaId":"AC-0002"} |
| iguales-vs-limite | 431 | TRANSFER;AC-0001;AC-0001;120000;39 | 400 | {"error":"E304","mensaje":"origen y destino iguales"} |
| anula-saldo-negativo | 433 | ALTA;Ana;50 | 201 | {"cuentaId":"AC-0001"} |
| anula-saldo-negativo | 434 | ALTA;Beto;11 | 201 | {"cuentaId":"AC-0002"} |
| anula-saldo-negativo | 435 | DEPOSITO;AC-0001;1000;35 | 200 | {"status":"recieved","operacionId":"OP-0001"} |
| anula-saldo-negativo | 436 | TRANSFER;AC-0001;AC-0002;800;58 | 200 | {"status":"recieved","operacionId":"OP-0002"} |
| anula-saldo-negativo | 437 | TRANSFER;AC-0002;AC-0001;800;46 | 200 | {"status":"recieved","operacionId":"OP-0003"} |
| anula-saldo-negativo | 438 | ANULA;OP-0002;69 | 200 | {"ok":true,"anulada":"OP-0002"} |
| anula-saldo-negativo | 439 | CONSULTA;AC-0001;14 | 200 | {"cuenta_id":"AC-0001","saldo":1800} |
| anula-saldo-negativo | 440 | CONSULTA;AC-0002;11 | 200 | {"cuenta_id":"AC-0002","saldo":-800} |
| anula-deposito-gastado | 442 | ALTA;Ana;50 | 201 | {"cuentaId":"AC-0001"} |
| anula-deposito-gastado | 443 | ALTA;Beto;11 | 201 | {"cuentaId":"AC-0002"} |
| anula-deposito-gastado | 444 | DEPOSITO;AC-0001;1000;35 | 200 | {"status":"recieved","operacionId":"OP-0001"} |
| anula-deposito-gastado | 445 | TRANSFER;AC-0001;AC-0002;1000;37 | 200 | {"status":"recieved","operacionId":"OP-0002"} |
| anula-deposito-gastado | 446 | ANULA;OP-0001;72 | 200 | {"ok":true,"anulada":"OP-0001"} |
| anula-deposito-gastado | 447 | CONSULTA;AC-0001;14 | 200 | {"cuenta_id":"AC-0001","saldo":-1000} |
| anula-minusculas | 449 | ALTA;Ana;50 | 201 | {"cuentaId":"AC-0001"} |
| anula-minusculas | 450 | ALTA;Beto;11 | 201 | {"cuentaId":"AC-0002"} |
| anula-minusculas | 451 | DEPOSITO;AC-0001;1000;35 | 200 | {"status":"recieved","operacionId":"OP-0001"} |
| anula-minusculas | 452 | anula;OP-0001;72 | 200 | {"ok":true,"anulada":"OP-0001"} |
| anula-minusculas | 453 | CONSULTA;AC-0001;14 | 200 | {"cuenta_id":"AC-0001","saldo":0} |
| anula-op-minusculas | 455 | ALTA;Ana;50 | 201 | {"cuentaId":"AC-0001"} |
| anula-op-minusculas | 456 | ALTA;Beto;11 | 201 | {"cuentaId":"AC-0002"} |
| anula-op-minusculas | 457 | DEPOSITO;AC-0001;1000;35 | 200 | {"status":"recieved","operacionId":"OP-0001"} |
| anula-op-minusculas | 458 | ANULA;op-0001;72 | 404 | {"error":"E402","mensaje":"operación inexistente"} |
| anula-repetida-tras-deposito | 460 | ALTA;Ana;50 | 201 | {"cuentaId":"AC-0001"} |
| anula-repetida-tras-deposito | 461 | ALTA;Beto;11 | 201 | {"cuentaId":"AC-0002"} |
| anula-repetida-tras-deposito | 462 | DEPOSITO;AC-0001;1000;35 | 200 | {"status":"recieved","operacionId":"OP-0001"} |
| anula-repetida-tras-deposito | 463 | ANULA;OP-0001;72 | 200 | {"ok":true,"anulada":"OP-0001"} |
| anula-repetida-tras-deposito | 464 | DEPOSITO;AC-0001;500;46 | 200 | {"status":"recieved","operacionId":"OP-0002"} |
| anula-repetida-tras-deposito | 465 | ANULA;OP-0001;72 | 200 | {"ok":false,"motivo":"ya anulada"} |
| anula-repetida-tras-deposito | 466 | ANULA;OP-0002;69 | 200 | {"ok":true,"anulada":"OP-0002"} |
| anula-repetida-tras-deposito | 467 | CONSULTA;AC-0001;14 | 200 | {"cuenta_id":"AC-0001","saldo":0} |
| cuenta-minusculas | 469 | ALTA;Ana;50 | 201 | {"cuentaId":"AC-0001"} |
| cuenta-minusculas | 470 | ALTA;Beto;11 | 201 | {"cuentaId":"AC-0002"} |
| cuenta-minusculas | 471 | CONSULTA;ac-0001;14 | 404 | {"error":"E401","mensaje":"cuenta inexistente"} |
| cuenta-corta | 473 | ALTA;Ana;50 | 201 | {"cuentaId":"AC-0001"} |
| cuenta-corta | 474 | ALTA;Beto;11 | 201 | {"cuentaId":"AC-0002"} |
| cuenta-corta | 475 | CONSULTA;AC-1;5 | 404 | {"error":"E401","mensaje":"cuenta inexistente"} |
| cuenta-larga | 477 | ALTA;Ana;50 | 201 | {"cuentaId":"AC-0001"} |
| cuenta-larga | 478 | ALTA;Beto;11 | 201 | {"cuentaId":"AC-0002"} |
| cuenta-larga | 479 | CONSULTA;AC-00001;61 | 404 | {"error":"E401","mensaje":"cuenta inexistente"} |

## Conclusiones (confirmadas contra el original)

| Hallazgo | Evidencia (ids) |
|---|---|
| Dentro de un comando el orden es: monto inválido (E303) → origen = destino (E304) → cuenta inexistente (E401) → límite (E506) → saldo (E507) | 403, 407, 411, 415, 419, 423, 427, 431 |
| ANULA permite saldos negativos, tanto en transferencias como en depósitos ya gastados | 440, 447 |
| ANULA acepta el comando en minúsculas, pero el número de operación debe ir en mayúsculas (`op-0001` → E402) | 452, 458 |
| Una segunda anulación responde `ok:false` "ya anulada" aunque haya operaciones nuevas en medio | 465 |
| Los identificadores de cuenta deben ir exactos: minúsculas, sin ceros o con ceros de más → E401 | 471, 475, 479 |

La réplica ya cumplía todo esto: el comparador local da 500/500.
