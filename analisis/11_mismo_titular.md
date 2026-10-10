# Transferencias entre cuentas del mismo titular

| caso | id | mensaje | status | respuesta |
|---|---|---|---|---|
| mismo-con-saldo | 3111 | ALTA;Ana;50 | 201 | {"cuentaId":"AC-0001"} |
| mismo-con-saldo | 3112 | ALTA;Ana;50 | 201 | {"cuentaId":"AC-0002"} |
| mismo-con-saldo | 3113 | DEPOSITO;AC-0001;900000;77 | 200 | {"status":"recieved","operacionId":"OP-0001"} |
| mismo-con-saldo | 3114 | TRANSFER;AC-0001;AC-0002;50001;56 | 200 | {"status":"recieved","operacionId":"OP-0002"} |
| mismo-con-saldo | 3115 | CONSULTA;AC-0002;11 | 200 | {"cuenta_id":"AC-0002","saldo":"500.01"} |
| distinto-con-saldo | 3117 | ALTA;Ana;50 | 201 | {"cuentaId":"AC-0001"} |
| distinto-con-saldo | 3118 | ALTA;Beto;11 | 201 | {"cuentaId":"AC-0002"} |
| distinto-con-saldo | 3119 | DEPOSITO;AC-0001;900000;77 | 200 | {"status":"recieved","operacionId":"OP-0001"} |
| distinto-con-saldo | 3120 | TRANSFER;AC-0001;AC-0002;50001;56 | 422 | {"error":"E506","mensaje":"límite excedido"} |
| mismo-sin-saldo | 3122 | ALTA;Ana;50 | 201 | {"cuentaId":"AC-0001"} |
| mismo-sin-saldo | 3123 | ALTA;Ana;50 | 201 | {"cuentaId":"AC-0002"} |
| mismo-sin-saldo | 3124 | TRANSFER;AC-0002;AC-0001;50001;20 | 422 | {"error":"E507","mensaje":"saldo insuficiente"} |
| mismo-monto-enorme | 3126 | ALTA;Ana;50 | 201 | {"cuentaId":"AC-0001"} |
| mismo-monto-enorme | 3127 | ALTA;Ana;50 | 201 | {"cuentaId":"AC-0002"} |
| mismo-monto-enorme | 3128 | DEPOSITO;AC-0001;9999999999;4 | 200 | {"status":"recieved","operacionId":"OP-0001"} |
| mismo-monto-enorme | 3129 | TRANSFER;AC-0001;AC-0002;999999999;87 | 200 | {"status":"recieved","operacionId":"OP-0002"} |
| mayusculas | 3131 | ALTA;Ana;50 | 201 | {"cuentaId":"AC-0001"} |
| mayusculas | 3132 | ALTA;ANA;50 | 201 | {"cuentaId":"AC-0002"} |
| mayusculas | 3133 | DEPOSITO;AC-0001;900000;77 | 200 | {"status":"recieved","operacionId":"OP-0001"} |
| mayusculas | 3134 | TRANSFER;AC-0001;AC-0002;50001;56 | 422 | {"error":"E506","mensaje":"límite excedido"} |
