# Casos definidos por Juan Pablo

| caso | id | mensaje | status | respuesta |
|---|---|---|---|---|
| orden-estandar | 589 | ALTA;Ana;50 | 201 | {"cuentaId":"AC-0001"} |
| orden-estandar | 590 | ALTA;Beto;11 | 201 | {"cuentaId":"AC-0002"} |
| orden-estandar | 591 | CREAR_ORDEN_ID_9948_TOTAL_1500;30 | 400 | {"error":"E301","mensaje":"comando desconocido "} |
| anulacion-directa | 593 | ALTA;Ana;50 | 201 | {"cuentaId":"AC-0001"} |
| anulacion-directa | 594 | ALTA;Beto;11 | 201 | {"cuentaId":"AC-0002"} |
| anulacion-directa | 595 | ANULAR_ORDEN_ID_9948;87 | 400 | {"error":"E301","mensaje":"comando desconocido "} |
| anular-inexistente | 597 | ALTA;Ana;50 | 201 | {"cuentaId":"AC-0001"} |
| anular-inexistente | 598 | ALTA;Beto;11 | 201 | {"cuentaId":"AC-0002"} |
| anular-inexistente | 599 | ANULAR_ORDEN_ID_0000;55 | 400 | {"error":"E301","mensaje":"comando desconocido "} |
| formato-invalido | 601 | ALTA;Ana;50 | 201 | {"cuentaId":"AC-0001"} |
| formato-invalido | 602 | ALTA;Beto;11 | 201 | {"cuentaId":"AC-0002"} |
| formato-invalido | 603 | ESTO_NO_ES_UN_COMANDO_VALIDO;75 | 400 | {"error":"E301","mensaje":"comando desconocido "} |
| cuenta-duplicada | 605 | ALTA;Ana;50 | 201 | {"cuentaId":"AC-0001"} |
| cuenta-duplicada | 606 | ALTA;Beto;11 | 201 | {"cuentaId":"AC-0002"} |
| cuenta-duplicada | 607 | CREAR_CUENTA_REPETIDA;4 | 400 | {"error":"E301","mensaje":"comando desconocido "} |
| mensaje-vacio | 609 | ALTA;Ana;50 | 201 | {"cuentaId":"AC-0001"} |
| mensaje-vacio | 610 | ALTA;Beto;11 | 201 | {"cuentaId":"AC-0002"} |
| mensaje-vacio | 611 | ;98 | 400 | {"error":"E104","mensaje":"segmento vacío"} |
| monto-cero | 613 | ALTA;Ana;50 | 201 | {"cuentaId":"AC-0001"} |
| monto-cero | 614 | ALTA;Beto;11 | 201 | {"cuentaId":"AC-0002"} |
| monto-cero | 615 | CREAR_ORDEN_ID_9949_TOTAL_0;47 | 400 | {"error":"E301","mensaje":"comando desconocido "} |
