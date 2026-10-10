# Tanda 2 — resultados crudos

Generado por `experimentos/01_entrada.ts`. Cada fila cita su `id` en `experimentos.jsonl`.

## Grupo A

| id | caso | status | cuerpo |
|---|---|---|---|
| 34 | POST /msg auth=ok | 200 | {"pong":true} |
| 35 | POST /msg auth=none | 401 | {"error":"E001","mensaje":"no autorizado"} |
| 36 | POST /msg auth=team | 401 | {"error":"E001","mensaje":"no autorizado"} |
| 37 | POST /msg auth=raw | 401 | {"error":"E001","mensaje":"no autorizado"} |
| 38 | POST /msg auth=lower | 401 | {"error":"E001","mensaje":"no autorizado"} |
| 39 | POST /msg auth=Bearer xyz | 401 | {"error":"E001","mensaje":"no autorizado"} |
| 40 | POST /msg auth=Bearer  | 401 | {"error":"E001","mensaje":"no autorizado"} |
| 41 | POST /msg auth=Basic abc | 401 | {"error":"E001","mensaje":"no autorizado"} |
| 42 | POST /__reset auth=ok | 200 | {"ok":true} |
| 43 | POST /__reset auth=none | 401 | {"error":"E001","mensaje":"no autorizado"} |
| 44 | POST /__reset auth=team | 401 | {"error":"E001","mensaje":"no autorizado"} |
| 45 | POST /__reset auth=raw | 401 | {"error":"E001","mensaje":"no autorizado"} |
| 46 | POST /__reset auth=lower | 401 | {"error":"E001","mensaje":"no autorizado"} |
| 47 | POST /__reset auth=Bearer xyz | 401 | {"error":"E001","mensaje":"no autorizado"} |
| 48 | POST /__reset auth=Bearer  | 401 | {"error":"E001","mensaje":"no autorizado"} |
| 49 | POST /__reset auth=Basic abc | 401 | {"error":"E001","mensaje":"no autorizado"} |
| 50 | GET /health auth=ok | 200 | {"ok":true} |
| 51 | GET /health auth=none | 401 | {"error":"E001","mensaje":"no autorizado"} |
| 52 | GET /health auth=team | 401 | {"error":"E001","mensaje":"no autorizado"} |
| 53 | GET /health auth=raw | 401 | {"error":"E001","mensaje":"no autorizado"} |
| 54 | GET /health auth=lower | 401 | {"error":"E001","mensaje":"no autorizado"} |
| 55 | GET /health auth=Bearer xyz | 401 | {"error":"E001","mensaje":"no autorizado"} |
| 56 | GET /health auth=Bearer  | 401 | {"error":"E001","mensaje":"no autorizado"} |
| 57 | GET /health auth=Basic abc | 401 | {"error":"E001","mensaje":"no autorizado"} |
| 58 | GET /noexiste auth=ok | 404 | {"error":"E404","mensaje":"ruta desconocida"} |
| 59 | GET /noexiste auth=none | 404 | {"error":"E404","mensaje":"ruta desconocida"} |
| 60 | GET /noexiste auth=team | 404 | {"error":"E404","mensaje":"ruta desconocida"} |
| 61 | GET /noexiste auth=raw | 404 | {"error":"E404","mensaje":"ruta desconocida"} |
| 62 | GET /noexiste auth=lower | 404 | {"error":"E404","mensaje":"ruta desconocida"} |
| 63 | GET /noexiste auth=Bearer xyz | 404 | {"error":"E404","mensaje":"ruta desconocida"} |
| 64 | GET /noexiste auth=Bearer  | 404 | {"error":"E404","mensaje":"ruta desconocida"} |
| 65 | GET /noexiste auth=Basic abc | 404 | {"error":"E404","mensaje":"ruta desconocida"} |
| 66 | GET / auth=ok | 404 | {"error":"E404","mensaje":"ruta desconocida"} |
| 67 | GET / auth=none | 404 | {"error":"E404","mensaje":"ruta desconocida"} |
| 68 | GET / auth=team | 404 | {"error":"E404","mensaje":"ruta desconocida"} |
| 69 | GET / auth=raw | 404 | {"error":"E404","mensaje":"ruta desconocida"} |
| 70 | GET / auth=lower | 404 | {"error":"E404","mensaje":"ruta desconocida"} |
| 71 | GET / auth=Bearer xyz | 404 | {"error":"E404","mensaje":"ruta desconocida"} |
| 72 | GET / auth=Bearer  | 404 | {"error":"E404","mensaje":"ruta desconocida"} |
| 73 | GET / auth=Basic abc | 404 | {"error":"E404","mensaje":"ruta desconocida"} |

## Grupo B

| id | caso | status | cuerpo |
|---|---|---|---|
| 75 | GET /msg | 404 | {"error":"E404","mensaje":"ruta desconocida"} |
| 76 | POST /msg | 200 | {"pong":true} |
| 77 | PUT /msg | 404 | {"error":"E404","mensaje":"ruta desconocida"} |
| 78 | DELETE /msg | 404 | {"error":"E404","mensaje":"ruta desconocida"} |
| 79 | PATCH /msg | 404 | {"error":"E404","mensaje":"ruta desconocida"} |
| 80 | OPTIONS /msg | 404 | {"error":"E404","mensaje":"ruta desconocida"} |
| 81 | HEAD /msg | 404 |  |
| 82 | GET /__reset | 404 | {"error":"E404","mensaje":"ruta desconocida"} |
| 83 | PUT /__reset | 404 | {"error":"E404","mensaje":"ruta desconocida"} |
| 84 | DELETE /__reset | 404 | {"error":"E404","mensaje":"ruta desconocida"} |
| 85 | PATCH /__reset | 404 | {"error":"E404","mensaje":"ruta desconocida"} |
| 86 | OPTIONS /__reset | 404 | {"error":"E404","mensaje":"ruta desconocida"} |
| 87 | HEAD /__reset | 404 |  |
| 88 | GET /health | 200 | {"ok":true} |
| 89 | POST /health | 404 | {"error":"E404","mensaje":"ruta desconocida"} |
| 90 | PUT /health | 404 | {"error":"E404","mensaje":"ruta desconocida"} |
| 91 | DELETE /health | 404 | {"error":"E404","mensaje":"ruta desconocida"} |
| 92 | PATCH /health | 404 | {"error":"E404","mensaje":"ruta desconocida"} |
| 93 | OPTIONS /health | 404 | {"error":"E404","mensaje":"ruta desconocida"} |
| 94 | HEAD /health | 404 |  |
| 95 | GET / | 404 | {"error":"E404","mensaje":"ruta desconocida"} |
| 96 | POST / | 404 | {"error":"E404","mensaje":"ruta desconocida"} |
| 97 | PUT / | 404 | {"error":"E404","mensaje":"ruta desconocida"} |
| 98 | DELETE / | 404 | {"error":"E404","mensaje":"ruta desconocida"} |
| 99 | PATCH / | 404 | {"error":"E404","mensaje":"ruta desconocida"} |
| 100 | OPTIONS / | 404 | {"error":"E404","mensaje":"ruta desconocida"} |
| 101 | HEAD / | 404 |  |
| 102 | GET /noexiste | 404 | {"error":"E404","mensaje":"ruta desconocida"} |
| 103 | POST /noexiste | 404 | {"error":"E404","mensaje":"ruta desconocida"} |
| 104 | PUT /noexiste | 404 | {"error":"E404","mensaje":"ruta desconocida"} |
| 105 | DELETE /noexiste | 404 | {"error":"E404","mensaje":"ruta desconocida"} |
| 106 | PATCH /noexiste | 404 | {"error":"E404","mensaje":"ruta desconocida"} |
| 107 | OPTIONS /noexiste | 404 | {"error":"E404","mensaje":"ruta desconocida"} |
| 108 | HEAD /noexiste | 404 |  |
| 109 | GET /msg/ | 404 | {"error":"E404","mensaje":"ruta desconocida"} |
| 110 | POST /msg/ | 404 | {"error":"E404","mensaje":"ruta desconocida"} |
| 111 | PUT /msg/ | 404 | {"error":"E404","mensaje":"ruta desconocida"} |
| 112 | DELETE /msg/ | 404 | {"error":"E404","mensaje":"ruta desconocida"} |
| 113 | PATCH /msg/ | 404 | {"error":"E404","mensaje":"ruta desconocida"} |
| 114 | OPTIONS /msg/ | 404 | {"error":"E404","mensaje":"ruta desconocida"} |
| 115 | HEAD /msg/ | 404 |  |
| 116 | GET /MSG | 404 | {"error":"E404","mensaje":"ruta desconocida"} |
| 117 | POST /MSG | 404 | {"error":"E404","mensaje":"ruta desconocida"} |
| 118 | PUT /MSG | 404 | {"error":"E404","mensaje":"ruta desconocida"} |
| 119 | DELETE /MSG | 404 | {"error":"E404","mensaje":"ruta desconocida"} |
| 120 | PATCH /MSG | 404 | {"error":"E404","mensaje":"ruta desconocida"} |
| 121 | OPTIONS /MSG | 404 | {"error":"E404","mensaje":"ruta desconocida"} |
| 122 | HEAD /MSG | 404 |  |
| 123 | GET /msg?x=1 | 404 | {"error":"E404","mensaje":"ruta desconocida"} |
| 124 | POST /msg?x=1 | 200 | {"pong":true} |
| 125 | PUT /msg?x=1 | 404 | {"error":"E404","mensaje":"ruta desconocida"} |
| 126 | DELETE /msg?x=1 | 404 | {"error":"E404","mensaje":"ruta desconocida"} |
| 127 | PATCH /msg?x=1 | 404 | {"error":"E404","mensaje":"ruta desconocida"} |
| 128 | OPTIONS /msg?x=1 | 404 | {"error":"E404","mensaje":"ruta desconocida"} |
| 129 | HEAD /msg?x=1 | 404 |  |
| 130 | GET /health/ | 404 | {"error":"E404","mensaje":"ruta desconocida"} |
| 131 | POST /health/ | 404 | {"error":"E404","mensaje":"ruta desconocida"} |
| 132 | PUT /health/ | 404 | {"error":"E404","mensaje":"ruta desconocida"} |
| 133 | DELETE /health/ | 404 | {"error":"E404","mensaje":"ruta desconocida"} |
| 134 | PATCH /health/ | 404 | {"error":"E404","mensaje":"ruta desconocida"} |
| 135 | OPTIONS /health/ | 404 | {"error":"E404","mensaje":"ruta desconocida"} |
| 136 | HEAD /health/ | 404 |  |

## Grupo C

| id | caso | status | cuerpo |
|---|---|---|---|
| 138 | sin cuerpo | 400 | {"error":"E100","mensaje":"json inválido"} |
| 139 | cuerpo vacío | 400 | {"error":"E100","mensaje":"json inválido"} |
| 140 | texto no JSON | 400 | {"error":"E100","mensaje":"json inválido"} |
| 141 | {} | 400 | {"error":"E102","mensaje":"falta m"} |
| 142 | [] | 400 | {"error":"E102","mensaje":"falta m"} |
| 143 | null | 400 | {"error":"E102","mensaje":"falta m"} |
| 144 | m null | 400 | {"error":"E102","mensaje":"falta m"} |
| 145 | m número | 400 | {"error":"E102","mensaje":"falta m"} |
| 146 | m array | 400 | {"error":"E102","mensaje":"falta m"} |
| 147 | m vacío | 400 | {"error":"E103","mensaje":"falta control"} |
| 148 | clave extra | 200 | {"pong":true} |
| 149 | clave M mayúscula | 400 | {"error":"E102","mensaje":"falta m"} |
| 150 | content-type text/plain | 200 | {"pong":true} |
| 151 | sin content-type | 200 | {"pong":true} |
| 152 | espacios alrededor | 400 | {"error":"E201","mensaje":"control mal formado"} |
| 153 | ; final | 400 | {"error":"E104","mensaje":"segmento vacío"} |
| 154 | ping minúsculas | 200 | {"pong":true} |
| 155 | PING sin control | 400 | {"error":"E103","mensaje":"falta control"} |
| 156 | PING; control vacío | 400 | {"error":"E104","mensaje":"segmento vacío"} |
| 157 | ;;; | 400 | {"error":"E104","mensaje":"segmento vacío"} |
| 158 | m de 5000 chars | 400 | {"error":"E103","mensaje":"falta control"} |
| 159 | JSON malformado | 400 | {"error":"E100","mensaje":"json inválido"} |

## Grupo D

| id | caso | status | cuerpo |
|---|---|---|---|
| 161 | ALTA;Ana firmado | 201 | {"cuentaId":"AC-0001"} |
| 162 | CONSULTA control correcto: CONSULTA;AC-0001;14 | 200 | {"cuenta_id":"AC-0001","saldo":0} |
| 163 | CONSULTA control cero a la izquierda: CONSULTA;AC-0001;014 | 400 | {"error":"E201","mensaje":"control mal formado"} |
| 164 | CONSULTA control con +: CONSULTA;AC-0001;+14 | 400 | {"error":"E201","mensaje":"control mal formado"} |
| 165 | CONSULTA control negativo: CONSULTA;AC-0001;-14 | 400 | {"error":"E201","mensaje":"control mal formado"} |
| 166 | CONSULTA control decimal .0: CONSULTA;AC-0001;14.0 | 400 | {"error":"E201","mensaje":"control mal formado"} |
| 167 | CONSULTA control espacio antes: CONSULTA;AC-0001; 14 | 400 | {"error":"E201","mensaje":"control mal formado"} |
| 168 | CONSULTA control espacio después: CONSULTA;AC-0001;14  | 400 | {"error":"E201","mensaje":"control mal formado"} |
| 169 | CONSULTA control vacío: CONSULTA;AC-0001; | 400 | {"error":"E104","mensaje":"segmento vacío"} |
| 170 | CONSULTA control sin campo de control: CONSULTA;AC-0001 | 400 | {"error":"E201","mensaje":"control mal formado"} |
| 171 | CONSULTA control N+97: CONSULTA;AC-0001;111 | 400 | {"error":"E201","mensaje":"control mal formado"} |
| 172 | CONSULTA control notación 1e1: CONSULTA;AC-0001;1e1 | 400 | {"error":"E201","mensaje":"control mal formado"} |
| 173 | CONSULTA control 5 dígitos: CONSULTA;AC-0001;12345 | 400 | {"error":"E201","mensaje":"control mal formado"} |
| 174 | ALTA control cero a la izquierda: ALTA;Beto;011 | 400 | {"error":"E201","mensaje":"control mal formado"} |
| 175 | ALTA control con +: ALTA;Beto;+11 | 400 | {"error":"E201","mensaje":"control mal formado"} |
| 176 | ALTA control N+97: ALTA;Beto;108 | 400 | {"error":"E201","mensaje":"control mal formado"} |

## Grupo E

| id | caso | status | cuerpo |
|---|---|---|---|
| 178 | [desconocido + control inválido] setup ALTA;Ana | 201 | {"cuentaId":"AC-0001"} |
| 179 | [desconocido + control inválido] setup ALTA;Beto | 201 | {"cuentaId":"AC-0002"} |
| 180 | [desconocido + control inválido] SALDOS;AC-0001;99 | 400 | {"error":"E202","mensaje":"control inválido"} |
| 182 | [desconocido + control mal formado] setup ALTA;Ana | 201 | {"cuentaId":"AC-0001"} |
| 183 | [desconocido + control mal formado] setup ALTA;Beto | 201 | {"cuentaId":"AC-0002"} |
| 184 | [desconocido + control mal formado] SALDOS;AC-0001;5X | 400 | {"error":"E201","mensaje":"control mal formado"} |
| 186 | [aridad + control inválido] setup ALTA;Ana | 201 | {"cuentaId":"AC-0001"} |
| 187 | [aridad + control inválido] setup ALTA;Beto | 201 | {"cuentaId":"AC-0002"} |
| 188 | [aridad + control inválido] ALTA;Lucia;Gomez;99 | 400 | {"error":"E202","mensaje":"control inválido"} |
| 190 | [aridad + control mal formado] setup ALTA;Ana | 201 | {"cuentaId":"AC-0001"} |
| 191 | [aridad + control mal formado] setup ALTA;Beto | 201 | {"cuentaId":"AC-0002"} |
| 192 | [aridad + control mal formado] ALTA;Lucia;Gomez;5X | 400 | {"error":"E201","mensaje":"control mal formado"} |
| 194 | [inexistente + control inválido] setup ALTA;Ana | 201 | {"cuentaId":"AC-0001"} |
| 195 | [inexistente + control inválido] setup ALTA;Beto | 201 | {"cuentaId":"AC-0002"} |
| 196 | [inexistente + control inválido] CONSULTA;AC-0009;88 | 400 | {"error":"E202","mensaje":"control inválido"} |
| 198 | [inexistente + control mal formado] setup ALTA;Ana | 201 | {"cuentaId":"AC-0001"} |
| 199 | [inexistente + control mal formado] setup ALTA;Beto | 201 | {"cuentaId":"AC-0002"} |
| 200 | [inexistente + control mal formado] CONSULTA;AC-0009;5X | 400 | {"error":"E201","mensaje":"control mal formado"} |
| 202 | [límite + control inválido] setup ALTA;Ana | 201 | {"cuentaId":"AC-0001"} |
| 203 | [límite + control inválido] setup ALTA;Beto | 201 | {"cuentaId":"AC-0002"} |
| 204 | [límite + control inválido] DEPOSITO;AC-0001;500000;90 | 200 | {"status":"recieved","operacionId":"OP-0001"} |
| 205 | [límite + control inválido] TRANSFER;AC-0001;AC-0002;120000;56 | 400 | {"error":"E202","mensaje":"control inválido"} |
| 207 | [desconocido + aridad rara] setup ALTA;Ana | 201 | {"cuentaId":"AC-0001"} |
| 208 | [desconocido + aridad rara] setup ALTA;Beto | 201 | {"cuentaId":"AC-0002"} |
| 209 | [desconocido + aridad rara] SALDOS;a;b;c;d;83 | 400 | {"error":"E301","mensaje":"comando desconocido "} |
| 211 | [comando vacío] setup ALTA;Ana | 201 | {"cuentaId":"AC-0001"} |
| 212 | [comando vacío] setup ALTA;Beto | 201 | {"cuentaId":"AC-0002"} |
| 213 | [comando vacío] ;AC-0001;35 | 400 | {"error":"E104","mensaje":"segmento vacío"} |
| 215 | [solo control] setup ALTA;Ana | 201 | {"cuentaId":"AC-0001"} |
| 216 | [solo control] setup ALTA;Beto | 201 | {"cuentaId":"AC-0002"} |
| 217 | [solo control] 14 | 400 | {"error":"E103","mensaje":"falta control"} |
| 219 | [DEPOSITO a inexistente] setup ALTA;Ana | 201 | {"cuentaId":"AC-0001"} |
| 220 | [DEPOSITO a inexistente] setup ALTA;Beto | 201 | {"cuentaId":"AC-0002"} |
| 221 | [DEPOSITO a inexistente] DEPOSITO;AC-0009;100;41 | 404 | {"error":"E401","mensaje":"cuenta inexistente"} |
| 223 | [DEPOSITO montos raros] setup ALTA;Ana | 201 | {"cuentaId":"AC-0001"} |
| 224 | [DEPOSITO montos raros] setup ALTA;Beto | 201 | {"cuentaId":"AC-0002"} |
| 225 | [DEPOSITO montos raros] DEPOSITO;AC-0001;-5;16 | 400 | {"error":"E303","mensaje":"monto inválido"} |
| 226 | [DEPOSITO montos raros] DEPOSITO;AC-0001;0;31 | 400 | {"error":"E303","mensaje":"monto inválido"} |
| 227 | [DEPOSITO montos raros] DEPOSITO;AC-0001;abc;13 | 400 | {"error":"E303","mensaje":"monto inválido"} |
| 228 | [DEPOSITO montos raros] DEPOSITO;AC-0001;1.5;62 | 400 | {"error":"E303","mensaje":"monto inválido"} |
| 229 | [DEPOSITO montos raros] DEPOSITO;AC-0001;0100;19 | 400 | {"error":"E303","mensaje":"monto inválido"} |
| 230 | [DEPOSITO montos raros] DEPOSITO;AC-0001;999999999999;4 | 400 | {"error":"E303","mensaje":"monto inválido"} |
| 232 | [TRANSFER casos borde] setup ALTA;Ana | 201 | {"cuentaId":"AC-0001"} |
| 233 | [TRANSFER casos borde] setup ALTA;Beto | 201 | {"cuentaId":"AC-0002"} |
| 234 | [TRANSFER casos borde] TRANSFER;AC-0001;AC-0001;100;17 | 400 | {"error":"E304","mensaje":"origen y destino iguales"} |
| 235 | [TRANSFER casos borde] TRANSFER;AC-0001;AC-0009;100;73 | 404 | {"error":"E401","mensaje":"cuenta inexistente"} |
| 236 | [TRANSFER casos borde] TRANSFER;AC-0009;AC-0001;100;74 | 404 | {"error":"E401","mensaje":"cuenta inexistente"} |
| 237 | [TRANSFER casos borde] TRANSFER;AC-0001;AC-0002;0;44 | 400 | {"error":"E303","mensaje":"monto inválido"} |
| 239 | [ALTA nombres raros] setup ALTA;Ana | 201 | {"cuentaId":"AC-0001"} |
| 240 | [ALTA nombres raros] setup ALTA;Beto | 201 | {"cuentaId":"AC-0002"} |
| 241 | [ALTA nombres raros] ALTA;;85 | 400 | {"error":"E104","mensaje":"segmento vacío"} |
| 242 | [ALTA nombres raros] ALTA;123;18 | 201 | {"cuentaId":"AC-0003"} |
| 243 | [ALTA nombres raros] ALTA;José;61 | 201 | {"cuentaId":"AC-0004"} |
| 244 | [ALTA nombres raros] ALTA;Ana Maria;44 | 201 | {"cuentaId":"AC-0005"} |
| 246 | [ANULA casos borde] setup ALTA;Ana | 201 | {"cuentaId":"AC-0001"} |
| 247 | [ANULA casos borde] setup ALTA;Beto | 201 | {"cuentaId":"AC-0002"} |
| 248 | [ANULA casos borde] ANULA;OP-0009;48 | 404 | {"error":"E402","mensaje":"operación inexistente"} |
| 249 | [ANULA casos borde] DEPOSITO;AC-0001;1000;35 | 200 | {"status":"recieved","operacionId":"OP-0001"} |
| 250 | [ANULA casos borde] ANULA;OP-0001;72 | 200 | {"ok":true,"anulada":"OP-0001"} |
| 251 | [ANULA casos borde] ANULA;XX-0001;97 | 404 | {"error":"E402","mensaje":"operación inexistente"} |

## Grupo F

| id | caso | status | cuerpo |
|---|---|---|---|
| 253 | setup ALTA;Ana | 201 | {"cuentaId":"AC-0001"} |
| 254 | RETIRO con 1 arg | 400 | {"error":"E301","mensaje":"comando desconocido "} |
| 255 | RETIRO sin args | 400 | {"error":"E301","mensaje":"comando desconocido "} |
| 256 | RETIRAR con 1 arg | 400 | {"error":"E301","mensaje":"comando desconocido "} |
| 257 | RETIRAR sin args | 400 | {"error":"E301","mensaje":"comando desconocido "} |
| 258 | SALDO con 1 arg | 400 | {"error":"E301","mensaje":"comando desconocido "} |
| 259 | SALDO sin args | 400 | {"error":"E301","mensaje":"comando desconocido "} |
| 260 | SALDOS con 1 arg | 400 | {"error":"E301","mensaje":"comando desconocido "} |
| 261 | SALDOS sin args | 400 | {"error":"E301","mensaje":"comando desconocido "} |
| 262 | BAJA con 1 arg | 400 | {"error":"E301","mensaje":"comando desconocido "} |
| 263 | BAJA sin args | 400 | {"error":"E301","mensaje":"comando desconocido "} |
| 264 | CIERRE con 1 arg | 400 | {"error":"E301","mensaje":"comando desconocido "} |
| 265 | CIERRE sin args | 400 | {"error":"E301","mensaje":"comando desconocido "} |
| 266 | CERRAR con 1 arg | 400 | {"error":"E301","mensaje":"comando desconocido "} |
| 267 | CERRAR sin args | 400 | {"error":"E301","mensaje":"comando desconocido "} |
| 268 | LISTA con 1 arg | 400 | {"error":"E301","mensaje":"comando desconocido "} |
| 269 | LISTA sin args | 400 | {"error":"E301","mensaje":"comando desconocido "} |
| 270 | LISTAR con 1 arg | 400 | {"error":"E301","mensaje":"comando desconocido "} |
| 271 | LISTAR sin args | 400 | {"error":"E301","mensaje":"comando desconocido "} |
| 272 | HISTORIAL con 1 arg | 400 | {"error":"E301","mensaje":"comando desconocido "} |
| 273 | HISTORIAL sin args | 400 | {"error":"E301","mensaje":"comando desconocido "} |
| 274 | EXTRACTO con 1 arg | 400 | {"error":"E301","mensaje":"comando desconocido "} |
| 275 | EXTRACTO sin args | 400 | {"error":"E301","mensaje":"comando desconocido "} |
| 276 | MOVIMIENTOS con 1 arg | 400 | {"error":"E301","mensaje":"comando desconocido "} |
| 277 | MOVIMIENTOS sin args | 400 | {"error":"E301","mensaje":"comando desconocido "} |
| 278 | BLOQUEO con 1 arg | 400 | {"error":"E301","mensaje":"comando desconocido "} |
| 279 | BLOQUEO sin args | 400 | {"error":"E301","mensaje":"comando desconocido "} |
| 280 | BLOQUEAR con 1 arg | 400 | {"error":"E301","mensaje":"comando desconocido "} |
| 281 | BLOQUEAR sin args | 400 | {"error":"E301","mensaje":"comando desconocido "} |
| 282 | DESBLOQUEO con 1 arg | 400 | {"error":"E301","mensaje":"comando desconocido "} |
| 283 | DESBLOQUEO sin args | 400 | {"error":"E301","mensaje":"comando desconocido "} |
| 284 | AYUDA con 1 arg | 400 | {"error":"E301","mensaje":"comando desconocido ","sugerencia":"ANULA"} |
| 285 | AYUDA sin args | 400 | {"error":"E301","mensaje":"comando desconocido ","sugerencia":"ANULA"} |
| 286 | HELP con 1 arg | 400 | {"error":"E301","mensaje":"comando desconocido ","sugerencia":"HALT"} |
| 287 | HELP sin args | 400 | {"error":"E301","mensaje":"comando desconocido ","sugerencia":"HALT"} |
| 288 | VERSION con 1 arg | 400 | {"error":"E301","mensaje":"comando desconocido "} |
| 289 | VERSION sin args | 400 | {"error":"E301","mensaje":"comando desconocido "} |
| 290 | ECHO con 1 arg | 400 | {"error":"E301","mensaje":"comando desconocido "} |
| 291 | ECHO sin args | 400 | {"error":"E301","mensaje":"comando desconocido "} |
| 292 | RESET con 1 arg | 400 | {"error":"E301","mensaje":"comando desconocido "} |
| 293 | RESET sin args | 400 | {"error":"E301","mensaje":"comando desconocido "} |
| 294 | INFO con 1 arg | 400 | {"error":"E301","mensaje":"comando desconocido "} |
| 295 | INFO sin args | 400 | {"error":"E301","mensaje":"comando desconocido "} |
| 296 | STATUS con 1 arg | 400 | {"error":"E301","mensaje":"comando desconocido "} |
| 297 | STATUS sin args | 400 | {"error":"E301","mensaje":"comando desconocido "} |
| 298 | ESTADO con 1 arg | 400 | {"error":"E301","mensaje":"comando desconocido "} |
| 299 | ESTADO sin args | 400 | {"error":"E301","mensaje":"comando desconocido "} |
| 300 | CUENTAS con 1 arg | 400 | {"error":"E301","mensaje":"comando desconocido "} |
| 301 | CUENTAS sin args | 400 | {"error":"E301","mensaje":"comando desconocido "} |
| 302 | PAGO con 1 arg | 400 | {"error":"E301","mensaje":"comando desconocido "} |
| 303 | PAGO sin args | 400 | {"error":"E301","mensaje":"comando desconocido "} |
| 304 | CREDITO con 1 arg | 400 | {"error":"E301","mensaje":"comando desconocido "} |
| 305 | CREDITO sin args | 400 | {"error":"E301","mensaje":"comando desconocido "} |
| 306 | DEBITO con 1 arg | 400 | {"error":"E301","mensaje":"comando desconocido "} |
| 307 | DEBITO sin args | 400 | {"error":"E301","mensaje":"comando desconocido "} |
| 308 | ABONO con 1 arg | 400 | {"error":"E301","mensaje":"comando desconocido "} |
| 309 | ABONO sin args | 400 | {"error":"E301","mensaje":"comando desconocido "} |
| 310 | CARGO con 1 arg | 400 | {"error":"E301","mensaje":"comando desconocido "} |
| 311 | CARGO sin args | 400 | {"error":"E301","mensaje":"comando desconocido "} |
| 312 | LIMITE con 1 arg | 400 | {"error":"E301","mensaje":"comando desconocido "} |
| 313 | LIMITE sin args | 400 | {"error":"E301","mensaje":"comando desconocido "} |
| 314 | TASA con 1 arg | 400 | {"error":"E301","mensaje":"comando desconocido "} |
| 315 | TASA sin args | 400 | {"error":"E301","mensaje":"comando desconocido "} |
| 316 | INTERES con 1 arg | 400 | {"error":"E301","mensaje":"comando desconocido "} |
| 317 | INTERES sin args | 400 | {"error":"E301","mensaje":"comando desconocido "} |
| 318 | AUDITORIA con 1 arg | 400 | {"error":"E301","mensaje":"comando desconocido "} |
| 319 | AUDITORIA sin args | 400 | {"error":"E301","mensaje":"comando desconocido "} |
| 320 | LOG con 1 arg | 400 | {"error":"E301","mensaje":"comando desconocido "} |
| 321 | LOG sin args | 400 | {"error":"E301","mensaje":"comando desconocido "} |
| 322 | REPORTE con 1 arg | 400 | {"error":"E301","mensaje":"comando desconocido "} |
| 323 | REPORTE sin args | 400 | {"error":"E301","mensaje":"comando desconocido "} |
| 324 | PING con 1 arg | 400 | {"error":"E302","mensaje":"aridad inválida"} |
| 325 | PING sin args | 200 | {"pong":true} |
| 326 | ALTA con 1 arg | 201 | {"cuentaId":"AC-0002"} |
| 327 | ALTA sin args | 400 | {"error":"E302","mensaje":"aridad inválida"} |
| 328 | CONSULTA con 1 arg | 200 | {"cuenta_id":"AC-0001","saldo":0} |
| 329 | CONSULTA sin args | 400 | {"error":"E302","mensaje":"aridad inválida"} |
| 330 | DEPOSITO con 1 arg | 400 | {"error":"E302","mensaje":"aridad inválida"} |
| 331 | DEPOSITO sin args | 400 | {"error":"E302","mensaje":"aridad inválida"} |
| 332 | TRANSFER con 1 arg | 400 | {"error":"E302","mensaje":"aridad inválida"} |
| 333 | TRANSFER sin args | 400 | {"error":"E302","mensaje":"aridad inválida"} |
| 334 | ANULA con 1 arg | 404 | {"error":"E402","mensaje":"operación inexistente"} |
| 335 | ANULA sin args | 400 | {"error":"E302","mensaje":"aridad inválida"} |
