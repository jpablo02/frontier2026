# Bloqueo de cuenta por intentos (E510)

| caso | id | mensaje | status | respuesta |
|---|---|---|---|---|
| tras-1 | 3531 | ALTA;Ana;50 | 201 | {"cuentaId":"AC-0001"} |
| tras-1 | 3532 | ALTA;Beto;11 | 201 | {"cuentaId":"AC-0002"} |
| tras-1 | 3533 | DEPOSITO;AC-0001;900000;77 | 200 | {"status":"recieved","operacionId":"OP-0001"} |
| tras-1 | 3534 | TRANSFER;AC-0001;AC-0002;60000;32 | 422 | {"error":"E506","mensaje":"límite excedido"} |
| tras-1 | 3535 | TRANSFER;AC-0001;AC-0002;1000;37 | 200 | {"status":"recieved","operacionId":"OP-0002"} |
| tras-2 | 3537 | ALTA;Ana;50 | 201 | {"cuentaId":"AC-0001"} |
| tras-2 | 3538 | ALTA;Beto;11 | 201 | {"cuentaId":"AC-0002"} |
| tras-2 | 3539 | DEPOSITO;AC-0001;900000;77 | 200 | {"status":"recieved","operacionId":"OP-0001"} |
| tras-2 | 3540 | TRANSFER;AC-0001;AC-0002;60000;32 | 422 | {"error":"E506","mensaje":"límite excedido"} |
| tras-2 | 3541 | TRANSFER;AC-0001;AC-0002;60000;32 | 422 | {"error":"E506","mensaje":"límite excedido"} |
| tras-2 | 3542 | TRANSFER;AC-0001;AC-0002;1000;37 | 200 | {"status":"recieved","operacionId":"OP-0002"} |
| tras-3 | 3544 | ALTA;Ana;50 | 201 | {"cuentaId":"AC-0001"} |
| tras-3 | 3545 | ALTA;Beto;11 | 201 | {"cuentaId":"AC-0002"} |
| tras-3 | 3546 | DEPOSITO;AC-0001;900000;77 | 200 | {"status":"recieved","operacionId":"OP-0001"} |
| tras-3 | 3547 | TRANSFER;AC-0001;AC-0002;60000;32 | 422 | {"error":"E506","mensaje":"límite excedido"} |
| tras-3 | 3548 | TRANSFER;AC-0001;AC-0002;60000;32 | 422 | {"error":"E506","mensaje":"límite excedido"} |
| tras-3 | 3549 | TRANSFER;AC-0001;AC-0002;60000;32 | 422 | {"error":"E506","mensaje":"límite excedido"} |
| tras-3 | 3550 | TRANSFER;AC-0001;AC-0002;1000;37 | 423 | {"error":"E510","mensaje":"cuenta bloqueada","intentos":1} |
| intentos | 3552 | ALTA;Ana;50 | 201 | {"cuentaId":"AC-0001"} |
| intentos | 3553 | ALTA;Beto;11 | 201 | {"cuentaId":"AC-0002"} |
| intentos | 3554 | DEPOSITO;AC-0001;900000;77 | 200 | {"status":"recieved","operacionId":"OP-0001"} |
| intentos | 3555 | TRANSFER;AC-0001;AC-0002;60000;32 | 422 | {"error":"E506","mensaje":"límite excedido"} |
| intentos | 3556 | TRANSFER;AC-0001;AC-0002;60000;32 | 422 | {"error":"E506","mensaje":"límite excedido"} |
| intentos | 3557 | TRANSFER;AC-0001;AC-0002;60000;32 | 422 | {"error":"E506","mensaje":"límite excedido"} |
| intentos | 3558 | TRANSFER;AC-0001;AC-0002;1000;37 | 423 | {"error":"E510","mensaje":"cuenta bloqueada","intentos":1} |
| intentos | 3559 | TRANSFER;AC-0001;AC-0002;1000;37 | 423 | {"error":"E510","mensaje":"cuenta bloqueada","intentos":2} |
| intentos | 3560 | TRANSFER;AC-0001;AC-0002;1000;37 | 423 | {"error":"E510","mensaje":"cuenta bloqueada","intentos":3} |
| interrumpido | 3562 | ALTA;Ana;50 | 201 | {"cuentaId":"AC-0001"} |
| interrumpido | 3563 | ALTA;Beto;11 | 201 | {"cuentaId":"AC-0002"} |
| interrumpido | 3564 | DEPOSITO;AC-0001;900000;77 | 200 | {"status":"recieved","operacionId":"OP-0001"} |
| interrumpido | 3565 | TRANSFER;AC-0001;AC-0002;60000;32 | 422 | {"error":"E506","mensaje":"límite excedido"} |
| interrumpido | 3566 | TRANSFER;AC-0001;AC-0002;60000;32 | 422 | {"error":"E506","mensaje":"límite excedido"} |
| interrumpido | 3567 | TRANSFER;AC-0001;AC-0002;1000;37 | 200 | {"status":"recieved","operacionId":"OP-0002"} |
| interrumpido | 3568 | TRANSFER;AC-0001;AC-0002;60000;32 | 422 | {"error":"E506","mensaje":"límite excedido"} |
| interrumpido | 3569 | TRANSFER;AC-0001;AC-0002;1000;37 | 200 | {"status":"recieved","operacionId":"OP-0003"} |
| por-saldo | 3571 | ALTA;Ana;50 | 201 | {"cuentaId":"AC-0001"} |
| por-saldo | 3572 | ALTA;Beto;11 | 201 | {"cuentaId":"AC-0002"} |
| por-saldo | 3573 | TRANSFER;AC-0001;AC-0002;100;24 | 422 | {"error":"E507","mensaje":"saldo insuficiente"} |
| por-saldo | 3574 | TRANSFER;AC-0001;AC-0002;100;24 | 422 | {"error":"E507","mensaje":"saldo insuficiente"} |
| por-saldo | 3575 | TRANSFER;AC-0001;AC-0002;100;24 | 422 | {"error":"E507","mensaje":"saldo insuficiente"} |
| por-saldo | 3576 | DEPOSITO;AC-0001;900000;77 | 200 | {"status":"recieved","operacionId":"OP-0001"} |
| por-saldo | 3577 | TRANSFER;AC-0001;AC-0002;1000;37 | 200 | {"status":"recieved","operacionId":"OP-0002"} |
| alcance | 3579 | ALTA;Ana;50 | 201 | {"cuentaId":"AC-0001"} |
| alcance | 3580 | ALTA;Beto;11 | 201 | {"cuentaId":"AC-0002"} |
| alcance | 3581 | DEPOSITO;AC-0001;900000;77 | 200 | {"status":"recieved","operacionId":"OP-0001"} |
| alcance | 3582 | TRANSFER;AC-0001;AC-0002;60000;32 | 422 | {"error":"E506","mensaje":"límite excedido"} |
| alcance | 3583 | TRANSFER;AC-0001;AC-0002;60000;32 | 422 | {"error":"E506","mensaje":"límite excedido"} |
| alcance | 3584 | TRANSFER;AC-0001;AC-0002;60000;32 | 422 | {"error":"E506","mensaje":"límite excedido"} |
| alcance | 3585 | CONSULTA;AC-0001;14 | 200 | {"cuenta_id":"AC-0001","saldo":"9000.00"} |
| alcance | 3586 | DEPOSITO;AC-0001;500;46 | 200 | {"status":"recieved","operacionId":"OP-0002"} |
| alcance | 3587 | DEPOSITO;AC-0002;900000;93 | 200 | {"status":"recieved","operacionId":"OP-0003"} |
| alcance | 3588 | TRANSFER;AC-0002;AC-0001;1000;14 | 200 | {"status":"recieved","operacionId":"OP-0004"} |
| alcance | 3589 | CONSULTA;AC-0001;14 | 200 | {"cuenta_id":"AC-0001","saldo":"9015.00"} |
| persiste | 3591 | ALTA;Ana;50 | 201 | {"cuentaId":"AC-0001"} |
| persiste | 3592 | ALTA;Beto;11 | 201 | {"cuentaId":"AC-0002"} |
| persiste | 3593 | DEPOSITO;AC-0001;900000;77 | 200 | {"status":"recieved","operacionId":"OP-0001"} |
| persiste | 3594 | TRANSFER;AC-0001;AC-0002;60000;32 | 422 | {"error":"E506","mensaje":"límite excedido"} |
| persiste | 3595 | TRANSFER;AC-0001;AC-0002;60000;32 | 422 | {"error":"E506","mensaje":"límite excedido"} |
| persiste | 3596 | TRANSFER;AC-0001;AC-0002;60000;32 | 422 | {"error":"E506","mensaje":"límite excedido"} |
| persiste | 3597 | TRANSFER;AC-0001;AC-0002;1000;37 | 423 | {"error":"E510","mensaje":"cuenta bloqueada","intentos":1} |
| persiste | 3598 | TRANSFER;AC-0001;AC-0002;1000;37 | 423 | {"error":"E510","mensaje":"cuenta bloqueada","intentos":2} |
| persiste | 3599 | CONSULTA;AC-0001;14 | 200 | {"cuenta_id":"AC-0001","saldo":"9000.00"} |
