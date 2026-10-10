# Hipótesis del tercer cambio (v2)

Corrida: 2026-10-10T21:46:24.670Z

| caso | id | mensaje | status | respuesta |
|---|---|---|---|---|
| h01-limite-acumulado | 2490 | POST /__reset | 200 | {"ok":true} |
| h01-limite-acumulado | 2491 | ALTA;Ana;50 | 201 | {"cuentaId":"AC-0001"} |
| h01-limite-acumulado | 2492 | ALTA;Beto;11 | 201 | {"cuentaId":"AC-0002"} |
| h01-limite-acumulado | 2493 | DEPOSITO;AC-0001;900000;77 | 200 | {"status":"recieved","operacionId":"OP-0001"} |
| h01-limite-acumulado | 2494 | TRANSFER;AC-0001;AC-0002;50000;59 | 200 | {"status":"recieved","operacionId":"OP-0002"} |
| h01-limite-acumulado | 2495 | TRANSFER;AC-0001;AC-0002;50000;59 | 200 | {"status":"recieved","operacionId":"OP-0003"} |
| h01-limite-acumulado | 2496 | TRANSFER;AC-0001;AC-0002;50000;59 | 200 | {"status":"recieved","operacionId":"OP-0004"} |
| h01-limite-acumulado | 2497 | TRANSFER;AC-0001;AC-0002;50000;59 | 200 | {"status":"recieved","operacionId":"OP-0005"} |
| h01-limite-acumulado | 2498 | CONSULTA;AC-0001;14 | 200 | {"cuenta_id":"AC-0001","saldo":"7000.00"} |
| h01-limite-acumulado | 2499 | CONSULTA;AC-0002;11 | 200 | {"cuenta_id":"AC-0002","saldo":"2000.00"} |
| h02-alta-repetida | 2500 | POST /__reset | 200 | {"ok":true} |
| h02-alta-repetida | 2501 | ALTA;Ana;50 | 201 | {"cuentaId":"AC-0001"} |
| h02-alta-repetida | 2502 | ALTA;Ana;50 | 201 | {"cuentaId":"AC-0002"} |
| h02-alta-repetida | 2503 | CONSULTA;AC-0002;11 | 200 | {"cuenta_id":"AC-0002","saldo":"0.00"} |
| h03-sugerencias | 2504 | POST /__reset | 200 | {"ok":true} |
| h03-sugerencias | 2505 | ALTA;Ana;50 | 201 | {"cuentaId":"AC-0001"} |
| h03-sugerencias | 2506 | ALTA;Beto;11 | 201 | {"cuentaId":"AC-0002"} |
| h03-sugerencias | 2507 | CONSULTAR;AC-0001;66 | 400 | {"error":"E301","mensaje":"comando desconocido ","sugerencia":"CONSULTA"} |
| h03-sugerencias | 2508 | DEPOSITAR;AC-0001;100;20 | 400 | {"error":"E301","mensaje":"comando desconocido ","sugerencia":"DEPOSITO"} |
| h03-sugerencias | 2509 | TRANSFERIR;AC-0001;AC-0002;100;52 | 400 | {"error":"E301","mensaje":"comando desconocido ","sugerencia":"TRANSFER"} |
| h03-sugerencias | 2510 | ANULAR;OP-0001;13 | 400 | {"error":"E301","mensaje":"comando desconocido ","sugerencia":"ANULA"} |
| h03-sugerencias | 2511 | ALTAS;Ana;79 | 400 | {"error":"E301","mensaje":"comando desconocido ","sugerencia":"ALTA"} |
| h03-sugerencias | 2512 | PINGG;28 | 400 | {"error":"E301","mensaje":"comando desconocido ","sugerencia":"PING"} |
| h04-halt | 2513 | POST /__reset | 200 | {"ok":true} |
| h04-halt | 2514 | ALTA;Ana;50 | 201 | {"cuentaId":"AC-0001"} |
| h04-halt | 2515 | ALTA;Beto;11 | 201 | {"cuentaId":"AC-0002"} |
| h04-halt | 2516 | HALT;71 | 400 | {"error":"E302","mensaje":"aridad inválida"} |
| h04-halt | 2517 | PING;64 | 200 | {"pong":true} |
| h04-halt | 2518 | HALT;AC-0001;82 | 409 | {"error":"E520","mensaje":"operación destructiva: detiene el servicio; reenvía con confirmación"} |
| h04-halt | 2519 | CONSULTA;AC-0001;14 | 200 | {"cuenta_id":"AC-0001","saldo":"0.00"} |
| h05-dos-decimales | 2520 | POST /__reset | 200 | {"ok":true} |
| h05-dos-decimales | 2521 | ALTA;Ana;50 | 201 | {"cuentaId":"AC-0001"} |
| h05-dos-decimales | 2522 | ALTA;Beto;11 | 201 | {"cuentaId":"AC-0002"} |
| h05-dos-decimales | 2523 | DEPOSITO;AC-0001;12.34;12 | 400 | {"error":"E303","mensaje":"monto inválido"} |
| h05-dos-decimales | 2524 | CONSULTA;AC-0001;14 | 200 | {"cuenta_id":"AC-0001","saldo":"0.00"} |
| h06-deposito-minimo | 2525 | POST /__reset | 200 | {"ok":true} |
| h06-deposito-minimo | 2526 | ALTA;Ana;50 | 201 | {"cuentaId":"AC-0001"} |
| h06-deposito-minimo | 2527 | ALTA;Beto;11 | 201 | {"cuentaId":"AC-0002"} |
| h06-deposito-minimo | 2528 | DEPOSITO;AC-0001;1;28 | 200 | {"status":"recieved","operacionId":"OP-0001"} |
| h06-deposito-minimo | 2529 | DEPOSITO;AC-0001;99;4 | 200 | {"status":"recieved","operacionId":"OP-0002"} |
| h06-deposito-minimo | 2530 | CONSULTA;AC-0001;14 | 200 | {"cuenta_id":"AC-0001","saldo":"1.00"} |
| h07-saldo-maximo | 2531 | POST /__reset | 200 | {"ok":true} |
| h07-saldo-maximo | 2532 | ALTA;Ana;50 | 201 | {"cuentaId":"AC-0001"} |
| h07-saldo-maximo | 2533 | ALTA;Beto;11 | 201 | {"cuentaId":"AC-0002"} |
| h07-saldo-maximo | 2534 | DEPOSITO;AC-0001;9999999999;4 | 200 | {"status":"recieved","operacionId":"OP-0001"} |
| h07-saldo-maximo | 2535 | DEPOSITO;AC-0001;9999999999;4 | 200 | {"status":"recieved","operacionId":"OP-0002"} |
| h07-saldo-maximo | 2536 | CONSULTA;AC-0001;14 | 200 | {"cuenta_id":"AC-0001","saldo":"199999999.98"} |
| h08-nombre-largo | 2537 | POST /__reset | 200 | {"ok":true} |
| h08-nombre-largo | 2538 | ALTA;AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA;49 | 201 | {"cuentaId":"AC-0001"} |
| h08-nombre-largo | 2539 | CONSULTA;AC-0001;14 | 200 | {"cuenta_id":"AC-0001","saldo":"0.00"} |
| h09-max-cuentas | 2540 | POST /__reset | 200 | {"ok":true} |
| h09-max-cuentas | 2541 | ALTA;NA;61 | 201 | {"cuentaId":"AC-0001"} |
| h09-max-cuentas | 2542 | ALTA;NB;58 | 201 | {"cuentaId":"AC-0002"} |
| h09-max-cuentas | 2543 | ALTA;NC;55 | 201 | {"cuentaId":"AC-0003"} |
| h09-max-cuentas | 2544 | ALTA;ND;52 | 201 | {"cuentaId":"AC-0004"} |
| h09-max-cuentas | 2545 | ALTA;NE;49 | 201 | {"cuentaId":"AC-0005"} |
| h09-max-cuentas | 2546 | ALTA;NF;46 | 201 | {"cuentaId":"AC-0006"} |
| h09-max-cuentas | 2547 | ALTA;NG;43 | 201 | {"cuentaId":"AC-0007"} |
| h09-max-cuentas | 2548 | ALTA;NH;40 | 201 | {"cuentaId":"AC-0008"} |
| h09-max-cuentas | 2549 | ALTA;NI;37 | 201 | {"cuentaId":"AC-0009"} |
| h09-max-cuentas | 2550 | ALTA;NJ;19 | 201 | {"cuentaId":"AC-0010"} |
| h09-max-cuentas | 2551 | ALTA;NK;16 | 201 | {"cuentaId":"AC-0011"} |
| h09-max-cuentas | 2552 | ALTA;NL;13 | 201 | {"cuentaId":"AC-0012"} |
| h09-max-cuentas | 2553 | CONSULTA;AC-0012;78 | 200 | {"cuenta_id":"AC-0012","saldo":"0.00"} |
| h10-ping-control | 2554 | POST /__reset | 200 | {"ok":true} |
| h10-ping-control | 2555 | PING;XX | 200 | {"pong":true} |
| h11-auth | 2556 | POST /__reset | 200 | {"ok":true} |
| h11-auth | 2557 | /msg PING auth=Bearer xyz | 401 | {"error":"E001","mensaje":"no autorizado"} |
| h11-auth | 2558 | /msg PING auth=Bearer (vacío) | 401 | {"error":"E001","mensaje":"no autorizado"} |
| h11-auth | 2559 | /msg PING auth=Basic abc | 401 | {"error":"E001","mensaje":"no autorizado"} |
| h11-auth | 2560 | /nada PING auth=Bearer xyz | 404 | {"error":"E404","mensaje":"ruta desconocida"} |
| h11-auth | 2561 | /nada PING auth=Bearer (vacío) | 404 | {"error":"E404","mensaje":"ruta desconocida"} |
| h11-auth | 2562 | /nada PING auth=Basic abc | 404 | {"error":"E404","mensaje":"ruta desconocida"} |
| h12-saldo-centavos | 2563 | POST /__reset | 200 | {"ok":true} |
| h12-saldo-centavos | 2564 | ALTA;Ana;50 | 201 | {"cuentaId":"AC-0001"} |
| h12-saldo-centavos | 2565 | ALTA;Beto;11 | 201 | {"cuentaId":"AC-0002"} |
| h12-saldo-centavos | 2566 | DEPOSITO;AC-0001;5;16 | 200 | {"status":"recieved","operacionId":"OP-0001"} |
| h12-saldo-centavos | 2567 | TRANSFER;AC-0001;AC-0002;5;29 | 200 | {"status":"recieved","operacionId":"OP-0002"} |
| h12-saldo-centavos | 2568 | ANULA;OP-0001;72 | 200 | {"ok":true,"anulada":"OP-0001"} |
| h12-saldo-centavos | 2569 | CONSULTA;AC-0001;14 | 200 | {"cuenta_id":"AC-0001","saldo":"-0.05"} |
| h12-saldo-centavos | 2570 | CONSULTA;AC-0002;11 | 200 | {"cuenta_id":"AC-0002","saldo":"0.05"} |

Requests usados: 81

## Comparación con la réplica (lo esperado según transcripts/05-revision-v2.txt)

| H | réplica | original | veredicto |
|---|---|---|---|
| 1 límite acumulado | 200 OP-0002..0005 | igual (2494-2497); saldos 7000.00 / 2000.00 | descartada |
| 2 ALTA repetida | 201 AC-0001, AC-0002 | igual (2501-2502) | descartada |
| 3 sugerencias | E301 sin sugerencia | E301 **con** `sugerencia` = comando real más parecido (2507-2512) | **diferencia** |
| 4 HALT | E301 | `HALT;71` → 400 E302 (2516); `HALT;AC-0001;82` → **409 E520** (2518) | **diferencia** |
| 5 dos decimales | E303 | igual (2523) | descartada |
| 6 depósito mínimo | 200, 200, "1.00" | igual (2528-2530) | descartada |
| 7 saldo máximo | 200, 200, "199999999.98" | igual (2534-2536) | descartada |
| 8 nombre de 136 letras | 201 | igual (2538) | descartada |
| 9 12 cuentas | AC-0001..AC-0012 | igual (2541-2553) | descartada |
| 10 PING;XX | 400 E201 | **200 pong** (2555) | **diferencia** |
| 11 auth | 401 E001 / 404 E404 | igual (2557-2562) | descartada |
| 12 saldo < 1 peso | "-0.05" / "0.05" | igual (2569-2570) | descartada (confirma formatoSaldo) |

### Diferencias, descritas con precisión

- **H3 — sugerencia en E301.** El campo `sugerencia` trae el comando real más cercano: CONSULTAR→CONSULTA,
  DEPOSITAR→DEPOSITO, TRANSFERIR→TRANSFER, ANULAR→ANULA, ALTAS→ALTA, PINGG→PING (todos a distancia de edición 1–2).
  Junto con AYUDA→ANULA y HELP→HALT (distancia 2) y los 35 nombres lejanos sin sugerencia de v1, apunta a
  "comando con distancia de edición ≤ 2 (umbral sin medir)", con HALT incluido en la lista de comandos. El umbral exacto
  (¿2? ¿relativo al largo?) y el desempate siguen abiertos.
- **H4 — HALT existe.** Aridad 1: sin argumentos da E302 (400). Con un argumento da 409
  `{"error":"E520","mensaje":"operación destructiva: detiene el servicio; reenvía con confirmación"}`. El estado no cambió
  (2519). **No** se mandó la confirmación: el mensaje dice que detiene el servicio y no está claro que `/__reset` lo arregle.
- **H10 — PING ignora el control por completo.** `PING;XX` da 200 y no E201. Con el id 30 (`PING;65`), PING se salta
  E201 y E202. Falta medir si también se salta E104 (`PING;`).

### ¿Cuál es el tercer cambio de v2?

Ninguna de las tres diferencias tiene un antecedente en v1 en el log: antes de 1793 nunca se mandó un nombre parecido a un
comando, ni HALT, ni PING con un control no numérico. Son huecos de la réplica, pero con esta evidencia **no se puede
saber cuál, si alguna, es el cambio de v2**. Puede que sean comportamientos que ya existían. La candidata más fuerte es
H3: el ticket habla de cambios que se ven en tests de un solo request, y la sugerencia toca todo comando mal escrito.
Pero eso es una inferencia, no algo medido.
