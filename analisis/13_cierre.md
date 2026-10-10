# Cierre de supuestos (fin-)

| caso | id | mensaje | status | respuesta |
|---|---|---|---|---|
| tit-espacios | 3440 | `{"m":"ALTA;Ana;50"}` | 201 | {"cuentaId":"AC-0001"} |
| tit-espacios | 3441 | `{"m":"ALTA;Ana ;50"}` | 201 | {"cuentaId":"AC-0002"} |
| tit-espacios | 3442 | `{"m":"ALTA; Ana;50"}` | 201 | {"cuentaId":"AC-0003"} |
| tit-espacios | 3443 | `{"m":"ALTA;Aná;45"}` | 201 | {"cuentaId":"AC-0004"} |
| tit-espacios | 3444 | `{"m":"ALTA;Ana;50"}` | 201 | {"cuentaId":"AC-0005"} |
| tit-espacios | 3445 | `{"m":"DEPOSITO;AC-0001;900000;77"}` | 200 | {"status":"recieved","operacionId":"OP-0001"} |
| tit-espacios | 3446 | `{"m":"TRANSFER;AC-0001;AC-0002;50001;56"}` | 422 | {"error":"E506","mensaje":"límite excedido"} |
| tit-espacios | 3447 | `{"m":"TRANSFER;AC-0001;AC-0003;50001;77"}` | 422 | {"error":"E506","mensaje":"límite excedido"} |
| tit-espacios | 3448 | `{"m":"TRANSFER;AC-0001;AC-0004;50001;98"}` | 422 | {"error":"E506","mensaje":"límite excedido"} |
| tit-espacios | 3449 | `{"m":"TRANSFER;AC-0001;AC-0005;50001;22"}` | 423 | {"error":"E510","mensaje":"cuenta bloqueada","intentos":1} |
| tit-espacios | 3450 | `{"m":"CONSULTA;AC-0001;14"}` | 200 | {"cuenta_id":"AC-0001","saldo":"9000.00"} |
| tit-espacios | 3451 | `{"m":"CONSULTA;AC-0002;11"}` | 200 | {"cuenta_id":"AC-0002","saldo":"0.00"} |
| tit-espacios | 3452 | `{"m":"CONSULTA;AC-0003;8"}` | 200 | {"cuenta_id":"AC-0003","saldo":"0.00"} |
| tit-espacios | 3453 | `{"m":"CONSULTA;AC-0004;5"}` | 200 | {"cuenta_id":"AC-0004","saldo":"0.00"} |
| tit-raros | 3455 | `{"m":"ALTA; ;85"}` | 201 | {"cuentaId":"AC-0001"} |
| tit-raros | 3456 | `{"m":"ALTA; ;85"}` | 201 | {"cuentaId":"AC-0002"} |
| tit-raros | 3457 | `{"m":"ALTA;123;18"}` | 201 | {"cuentaId":"AC-0003"} |
| tit-raros | 3458 | `{"m":"ALTA;123;18"}` | 201 | {"cuentaId":"AC-0004"} |
| tit-raros | 3459 | `{"m":"ALTA;7;44"}` | 201 | {"cuentaId":"AC-0005"} |
| tit-raros | 3460 | `{"m":"ALTA;07;38"}` | 201 | {"cuentaId":"AC-0006"} |
| tit-raros | 3461 | `{"m":"ALTA;Aná;45"}` | 201 | {"cuentaId":"AC-0007"} |
| tit-raros | 3462 | `{"m":"ALTA;Aná;45"}` | 201 | {"cuentaId":"AC-0008"} |
| tit-raros | 3463 | `{"m":"DEPOSITO;AC-0001;900000;77"}` | 200 | {"status":"recieved","operacionId":"OP-0001"} |
| tit-raros | 3464 | `{"m":"DEPOSITO;AC-0003;900000;12"}` | 200 | {"status":"recieved","operacionId":"OP-0002"} |
| tit-raros | 3465 | `{"m":"DEPOSITO;AC-0005;900000;44"}` | 200 | {"status":"recieved","operacionId":"OP-0003"} |
| tit-raros | 3466 | `{"m":"DEPOSITO;AC-0007;900000;76"}` | 200 | {"status":"recieved","operacionId":"OP-0004"} |
| tit-raros | 3467 | `{"m":"TRANSFER;AC-0001;AC-0002;50001;56"}` | 200 | {"status":"recieved","operacionId":"OP-0005"} |
| tit-raros | 3468 | `{"m":"TRANSFER;AC-0003;AC-0004;50001;68"}` | 200 | {"status":"recieved","operacionId":"OP-0006"} |
| tit-raros | 3469 | `{"m":"TRANSFER;AC-0005;AC-0006;50001;80"}` | 422 | {"error":"E506","mensaje":"límite excedido"} |
| tit-raros | 3470 | `{"m":"TRANSFER;AC-0007;AC-0008;50001;92"}` | 200 | {"status":"recieved","operacionId":"OP-0007"} |
| tit-raros | 3471 | `{"m":"TRANSFER;AC-0001;AC-0003;50001;77"}` | 422 | {"error":"E506","mensaje":"límite excedido"} |
| tit-raros | 3472 | `{"m":"CONSULTA;AC-0002;11"}` | 200 | {"cuenta_id":"AC-0002","saldo":"500.01"} |
| tit-raros | 3473 | `{"m":"CONSULTA;AC-0006;96"}` | 200 | {"cuenta_id":"AC-0006","saldo":"0.00"} |
| anula-mismo | 3475 | `{"m":"ALTA;Ana;50"}` | 201 | {"cuentaId":"AC-0001"} |
| anula-mismo | 3476 | `{"m":"ALTA;Ana;50"}` | 201 | {"cuentaId":"AC-0002"} |
| anula-mismo | 3477 | `{"m":"ALTA;Beto;11"}` | 201 | {"cuentaId":"AC-0003"} |
| anula-mismo | 3478 | `{"m":"DEPOSITO;AC-0001;100000;6"}` | 200 | {"status":"recieved","operacionId":"OP-0001"} |
| anula-mismo | 3479 | `{"m":"TRANSFER;AC-0001;AC-0002;60000;32"}` | 200 | {"status":"recieved","operacionId":"OP-0002"} |
| anula-mismo | 3480 | `{"m":"CONSULTA;AC-0001;14"}` | 200 | {"cuenta_id":"AC-0001","saldo":"400.00"} |
| anula-mismo | 3481 | `{"m":"CONSULTA;AC-0002;11"}` | 200 | {"cuenta_id":"AC-0002","saldo":"600.00"} |
| anula-mismo | 3482 | `{"m":"ANULA;OP-0002;69"}` | 200 | {"ok":true,"anulada":"OP-0002"} |
| anula-mismo | 3483 | `{"m":"CONSULTA;AC-0001;14"}` | 200 | {"cuenta_id":"AC-0001","saldo":"1000.00"} |
| anula-mismo | 3484 | `{"m":"CONSULTA;AC-0002;11"}` | 200 | {"cuenta_id":"AC-0002","saldo":"0.00"} |
| anula-mismo | 3485 | `{"m":"ANULA;OP-0002;69"}` | 200 | {"ok":false,"motivo":"ya anulada"} |
| anula-mismo | 3486 | `{"m":"TRANSFER;AC-0001;AC-0002;100000;12"}` | 200 | {"status":"recieved","operacionId":"OP-0003"} |
| anula-mismo | 3487 | `{"m":"TRANSFER;AC-0002;AC-0003;50000;65"}` | 200 | {"status":"recieved","operacionId":"OP-0004"} |
| anula-mismo | 3488 | `{"m":"ANULA;OP-0003;66"}` | 200 | {"ok":true,"anulada":"OP-0003"} |
| anula-mismo | 3489 | `{"m":"CONSULTA;AC-0001;14"}` | 200 | {"cuenta_id":"AC-0001","saldo":"1000.00"} |
| anula-mismo | 3490 | `{"m":"CONSULTA;AC-0002;11"}` | 200 | {"cuenta_id":"AC-0002","saldo":"-500.00"} |
| anula-mismo | 3491 | `{"m":"CONSULTA;AC-0003;8"}` | 200 | {"cuenta_id":"AC-0003","saldo":"500.00"} |
| sugerencia | 3493 | `{"m":"PITA;x;20"}` | 400 | {"error":"E301","mensaje":"comando desconocido ","sugerencia":"ALTA"} |
| sugerencia | 3494 | `{"m":"HANG;x;16"}` | 400 | {"error":"E301","mensaje":"comando desconocido ","sugerencia":"HALT"} |
| sugerencia | 3495 | `{"m":"PALA;x;87"}` | 400 | {"error":"E301","mensaje":"comando desconocido ","sugerencia":"ALTA"} |
| sugerencia | 3496 | `{"m":"HULA;x;76"}` | 400 | {"error":"E301","mensaje":"comando desconocido ","sugerencia":"ANULA"} |
| sugerencia | 3497 | `{"m":"ANGA;x;92"}` | 400 | {"error":"E301","mensaje":"comando desconocido ","sugerencia":"ALTA"} |
| sugerencia | 3498 | `{"m":"AULA;x;23"}` | 400 | {"error":"E301","mensaje":"comando desconocido ","sugerencia":"ANULA"} |
| sugerencia | 3499 | `{"m":"HALA;x;56"}` | 400 | {"error":"E301","mensaje":"comando desconocido ","sugerencia":"HALT"} |
| sugerencia | 3500 | `{"m":"PALT;x;61"}` | 400 | {"error":"E301","mensaje":"comando desconocido ","sugerencia":"HALT"} |
| sugerencia | 3501 | `{"m":"IPGN;x;32"}` | 400 | {"error":"E301","mensaje":"comando desconocido "} |
| sugerencia | 3502 | `{"m":"TARNSFRE;x;35"}` | 400 | {"error":"E301","mensaje":"comando desconocido "} |
| sugerencia | 3503 | `{"m":"ALT;x;23"}` | 400 | {"error":"E301","mensaje":"comando desconocido ","sugerencia":"ALTA"} |
| sugerencia | 3504 | `{"m":"ANULAR;x;66"}` | 400 | {"error":"E301","mensaje":"comando desconocido ","sugerencia":"ANULA"} |
| halt | 3506 | `{"m":"ALTA;Ana;50"}` | 201 | {"cuentaId":"AC-0001"} |
| halt | 3507 | `{"m":"HALT;AC-0009;58"}` | 409 | {"error":"E520","mensaje":"operación destructiva: detiene el servicio; reenvía con confirmación"} |
| halt | 3508 | `{"m":"HALT;AC-0001;82"}` | 409 | {"error":"E520","mensaje":"operación destructiva: detiene el servicio; reenvía con confirmación"} |
| halt | 3509 | `{"m":"HALT;cualquiercosa;52"}` | 409 | {"error":"E520","mensaje":"operación destructiva: detiene el servicio; reenvía con confirmación"} |
| halt | 3510 | `{"m":"HALT;a;b;78"}` | 400 | {"error":"E302","mensaje":"aridad inválida"} |
| halt | 3511 | `{"m":"halt;x;42"}` | 409 | {"error":"E520","mensaje":"operación destructiva: detiene el servicio; reenvía con confirmación"} |
| halt | 3512 | `{"m":"HALT;0;22"}` | 409 | {"error":"E520","mensaje":"operación destructiva: detiene el servicio; reenvía con confirmación"} |
| halt | 3513 | `{"m":"CONSULTA;AC-0001;14"}` | 200 | {"cuenta_id":"AC-0001","saldo":"0.00"} |
| otros | 3515 | `"no json"` | 401 | {"error":"E001","mensaje":"no autorizado"} |
| otros | 3516 | `{"m":"CONSULTA;AC-0001;0"}` | 400 | {"error":"E202","mensaje":"control inválido"} |
| otros | 3517 | `{"m":"CONSULTA;AC-0001;00"}` | 400 | {"error":"E202","mensaje":"control inválido"} |
| otros | 3518 | `{"m":"ALTA;Ana;50"}` | 201 | {"cuentaId":"AC-0001"} |
| otros | 3519 | `{"m":"ALTA;Beto;11"}` | 201 | {"cuentaId":"AC-0002"} |
| otros | 3520 | `{"m":"TRANSFER;AC-0001;ac-0001;100;17"}` | 404 | {"error":"E401","mensaje":"cuenta inexistente"} |
| otros | 3521 | `{"m":"DEPOSITO;AC-0001;+5;16"}` | 400 | {"error":"E303","mensaje":"monto inválido"} |
| otros | 3522 | `{"m":"DEPOSITO;AC-0001;50;54"}` | 200 | {"status":"recieved","operacionId":"OP-0001"} |
| otros | 3523 | `{"m":"TRANSFER;AC-0001;AC-0002;50;87"}` | 200 | {"status":"recieved","operacionId":"OP-0002"} |
| otros | 3524 | `{"m":"ANULA;OP-0001;72"}` | 200 | {"ok":true,"anulada":"OP-0001"} |
| otros | 3525 | `{"m":"CONSULTA;AC-0001;14"}` | 200 | {"cuenta_id":"AC-0001","saldo":"-0.50"} |
| otros | 3526 | `{"m":"DEPOSITO;AC-0002;9999999999;51"}` | 200 | {"status":"recieved","operacionId":"OP-0003"} |
| otros | 3527 | `{"m":"DEPOSITO;AC-0002;9999999999;51"}` | 200 | {"status":"recieved","operacionId":"OP-0004"} |
| otros | 3528 | `{"m":"CONSULTA;AC-0002;11"}` | 200 | {"cuenta_id":"AC-0002","saldo":"200000000.48"} |
| otros | 3529 | `{"m":"CONSULTA; AC-0001;14"}` | 404 | {"error":"E401","mensaje":"cuenta inexistente"} |

## Diff contra la réplica (`DESDE_ID=3439`): 86/91, 5 diferencias

| id | original | réplica | regla |
|---|---|---|---|
| 3449 | 423 `{"error":"E510","mensaje":"cuenta bloqueada","intentos":1}` | 200 OP-0002 | **Regla nueva (E510)**: tras 3 E506 del mismo origen (3446-3448), la siguiente TRANSFER de esa cuenta da 423 E510, aunque sea entre el mismo titular. Umbral, si cuenta consecutivos, qué cuenta `intentos` y si afecta a DEPOSITO: sin medir. CONSULTA sigue funcionando |
| 3450 | saldo `"9000.00"` | `"8499.99"` | consecuencia de 3449 |
| 3493 | PITA → `ALTA` | `PING` | empate de distancia: gana el **orden alfabético** (ALTA < PING) |
| 3494 | HANG → `HALT` | `PING` | ídem (HALT < PING). Mínima distancia sí se respeta (AULA→ANULA, HALA→HALT, PALT→HALT) |
| 3517 | `CONSULTA;AC-0001;00` → E202 | E201 | el control es `^\d{1,2}$`: `00` es formato válido; INT-04 "sin cero a la izquierda" solo estaba probado con 3 dígitos |

Confirmados sin diferencia: titular comparado tal cual (`Ana`≠`Ana `≠` Ana`≠`Aná`, `7`≠`07`; ` `=` `, `123`=`123`, `Aná`=`Aná`); anular >50000 entre mismo titular revierte normal; HALT responde E520 con cualquier argumento, E302 con 2; 401 antes que 400; control `0` → E202; `-0.50`; `ac-0001` en destino → E401 (no E304).
