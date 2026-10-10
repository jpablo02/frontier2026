# Secuencias aleatorias 2 (semilla 1337, sesgo a titulares) — corrida cruda

Corrida: 2026-10-10T22:33:02.241Z

| seq | paso | id | tipo | mensaje | status | respuesta |
|---|---|---|---|---|---|---|
| alea2-01 | 0 | 3162 | reset | POST /__reset | 200 | {"ok":true} |
| alea2-01 | 1 | 3163 | ALTA: titular "José" | `ALTA;José;61` | 201 | {"cuentaId":"AC-0001"} |
| alea2-01 | 2 | 3164 | ALTA: titular "JOSÉ" | `ALTA;JOSÉ;61` | 201 | {"cuentaId":"AC-0002"} |
| alea2-01 | 3 | 3165 | ALTA: titular "JOSÉ" | `ALTA;JOSÉ;61` | 201 | {"cuentaId":"AC-0003"} |
| alea2-01 | 4 | 3166 | DEPOSITO | `DEPOSITO;AC-0001;9999999999;4` | 200 | {"status":"recieved","operacionId":"OP-0001"} |
| alea2-01 | 5 | 3167 | TRANSFER: mismo titular exacto | `TRANSFER;AC-0002;AC-0003;50001;62` | 422 | {"error":"E507","mensaje":"saldo insuficiente"} |
| alea2-01 | 6 | 3168 | TRANSFER: titular parecido ("José" vs "JOSÉ") | `TRANSFER;AC-0001;AC-0003;50001;77` | 422 | {"error":"E506","mensaje":"límite excedido"} |
| alea2-01 | 7 | 3169 | TRANSFER: titular parecido ("JOSÉ" vs "José") | `TRANSFER;AC-0003;AC-0001;50000;8` | 422 | {"error":"E507","mensaje":"saldo insuficiente"} |
| alea2-01 | 8 | 3170 | DEPOSITO | `DEPOSITO;AC-0001;999999999;4` | 200 | {"status":"recieved","operacionId":"OP-0002"} |
| alea2-01 | 9 | 3171 | DEPOSITO | `DEPOSITO;AC-0001;50001;36` | 200 | {"status":"recieved","operacionId":"OP-0003"} |
| alea2-01 | 10 | 3172 | TRANSFER: titular parecido ("JOSÉ" vs "José") | `TRANSFER;AC-0002;AC-0001;50000;23` | 422 | {"error":"E507","mensaje":"saldo insuficiente"} |
| alea2-01 | 11 | 3173 | DEPOSITO | `DEPOSITO;AC-0001;50001;36` | 200 | {"status":"recieved","operacionId":"OP-0004"} |
| alea2-02 | 0 | 3174 | reset | POST /__reset | 200 | {"ok":true} |
| alea2-02 | 1 | 3175 | DEPOSITO | `DEPOSITO;ac-0001;1000;35` | 404 | {"error":"E401","mensaje":"cuenta inexistente"} |
| alea2-02 | 2 | 3176 | ALTA: titular "Ana Maria" | `ALTA;Ana Maria;44` | 201 | {"cuentaId":"AC-0001"} |
| alea2-02 | 3 | 3177 | ALTA: titular "Ana  Maria" | `ALTA;Ana  Maria;44` | 201 | {"cuentaId":"AC-0002"} |
| alea2-02 | 4 | 3178 | TRANSFER: titular parecido ("Ana Maria" vs "Ana  Maria") | `TRANSFER;AC-0001;AC-0002;49999;62` | 422 | {"error":"E507","mensaje":"saldo insuficiente"} |
| alea2-02 | 5 | 3179 | DEPOSITO | `DEPOSITO;AC-0002;50001;57` | 200 | {"status":"recieved","operacionId":"OP-0001"} |
| alea2-02 | 6 | 3180 | ALTA: titular "Ana Maria" | `ALTA;Ana Maria;44` | 201 | {"cuentaId":"AC-0003"} |
| alea2-02 | 7 | 3181 | ANULA | `ANULA;OP-0002;69` | 404 | {"error":"E402","mensaje":"operación inexistente"} |
| alea2-02 | 8 | 3182 | ALTA: titular "Ana  Maria" | `ALTA;Ana  Maria;44` | 201 | {"cuentaId":"AC-0004"} |
| alea2-02 | 9 | 3183 | TRANSFER: titular parecido ("Ana  Maria" vs "Ana Maria") | `TRANSFER;AC-0002;AC-0001;60000;93` | 422 | {"error":"E506","mensaje":"límite excedido"} |
| alea2-02 | 10 | 3184 | TRANSFER: titular parecido ("Ana Maria" vs "Ana  Maria") | `TRANSFER;AC-0001;AC-0002;49999;62` | 422 | {"error":"E507","mensaje":"saldo insuficiente"} |
| alea2-02 | 11 | 3185 | ALTA: titular "Ana  Maria" | `ALTA;Ana  Maria;44` | 201 | {"cuentaId":"AC-0005"} |
| alea2-03 | 0 | 3186 | reset | POST /__reset | 200 | {"ok":true} |
| alea2-03 | 1 | 3187 | DEPOSITO | `DEPOSITO;ac-0001;50000;39` | 404 | {"error":"E401","mensaje":"cuenta inexistente"} |
| alea2-03 | 2 | 3188 | ALTA: titular "123" | `ALTA;123;18` | 201 | {"cuentaId":"AC-0001"} |
| alea2-03 | 3 | 3189 | ALTA: titular "José" | `ALTA;José;61` | 201 | {"cuentaId":"AC-0002"} |
| alea2-03 | 4 | 3190 | DEPOSITO | `DEPOSITO;AC-0002;1000;8` | 200 | {"status":"recieved","operacionId":"OP-0001"} |
| alea2-03 | 5 | 3191 | DEPOSITO | `DEPOSITO;AC-0002;999999999;96` | 200 | {"status":"recieved","operacionId":"OP-0002"} |
| alea2-03 | 6 | 3192 | ALTA: titular "123" | `ALTA;123;18` | 201 | {"cuentaId":"AC-0003"} |
| alea2-03 | 7 | 3193 | DEPOSITO | `DEPOSITO;AC-0002;100000;22` | 200 | {"status":"recieved","operacionId":"OP-0003"} |
| alea2-03 | 8 | 3194 | TRANSFER: mismo titular exacto | `TRANSFER;AC-0001;AC-0003;49999;83` | 422 | {"error":"E507","mensaje":"saldo insuficiente"} |
| alea2-03 | 9 | 3195 | ANULA: anula operación | `ANULA;OP-0003;66` | 200 | {"ok":true,"anulada":"OP-0003"} |
| alea2-03 | 10 | 3196 | ALTA: titular "123" | `ALTA;123;18` | 201 | {"cuentaId":"AC-0004"} |
| alea2-03 | 11 | 3197 | CONSULTA | `CONSULTA;AC-0004;5` | 200 | {"cuenta_id":"AC-0004","saldo":"0.00"} |
| alea2-03 | 12 | 3198 | DEPOSITO | `DEPOSITO;AC-0004;900000;28` | 200 | {"status":"recieved","operacionId":"OP-0004"} |
| alea2-03 | 13 | 3199 | ANULA: anula operación | `ANULA;OP-0003;66` | 200 | {"ok":false,"motivo":"ya anulada"} |
| alea2-03 | 14 | 3200 | TRANSFER: titular distinto | `TRANSFER;AC-0004;AC-0002;50000;14` | 200 | {"status":"recieved","operacionId":"OP-0005"} |
| alea2-03 | 15 | 3201 | TRANSFER: mismo titular exacto | `TRANSFER;AC-0003;AC-0001;100000;84` | 422 | {"error":"E507","mensaje":"saldo insuficiente"} |
| alea2-04 | 0 | 3202 | reset | POST /__reset | 200 | {"ok":true} |
| alea2-04 | 1 | 3203 | ALTA: titular "0" | `ALTA;0;65` | 201 | {"cuentaId":"AC-0001"} |
| alea2-04 | 2 | 3204 | ALTA: titular "123" | `ALTA;123;18` | 201 | {"cuentaId":"AC-0002"} |
| alea2-04 | 3 | 3205 | DEPOSITO | `DEPOSITO;AC-0001;900000;77` | 200 | {"status":"recieved","operacionId":"OP-0001"} |
| alea2-04 | 4 | 3206 | DEPOSITO | `DEPOSITO;AC-0002;900000;93` | 200 | {"status":"recieved","operacionId":"OP-0002"} |
| alea2-04 | 5 | 3207 | DEPOSITO | `DEPOSITO;AC-0001;900000;77` | 200 | {"status":"recieved","operacionId":"OP-0003"} |
| alea2-04 | 6 | 3208 | DEPOSITO | `DEPOSITO;AC-0001;50001;36` | 200 | {"status":"recieved","operacionId":"OP-0004"} |
| alea2-04 | 7 | 3209 | ANULA: anula operación | `ANULA;OP-0002;69` | 200 | {"ok":true,"anulada":"OP-0002"} |
| alea2-04 | 8 | 3210 | CONSULTA | `CONSULTA;ac-0001;14` | 404 | {"error":"E401","mensaje":"cuenta inexistente"} |
| alea2-04 | 9 | 3211 | CONSULTA | `CONSULTA;AC-0001;14` | 200 | {"cuenta_id":"AC-0001","saldo":"18500.01"} |
| alea2-04 | 10 | 3212 | DEPOSITO | `DEPOSITO;AC-0001;60000;12` | 200 | {"status":"recieved","operacionId":"OP-0005"} |
| alea2-04 | 11 | 3213 | TRANSFER: mismo titular exacto | `TRANSFER;AC-0002;AC-0002;25000;63` | 400 | {"error":"E304","mensaje":"origen y destino iguales"} |
| alea2-04 | 12 | 3214 | DEPOSITO | `DEPOSITO;AC-0002;50000;60` | 200 | {"status":"recieved","operacionId":"OP-0006"} |
| alea2-04 | 13 | 3215 | TRANSFER: titular distinto | `TRANSFER;AC-0002;AC-0001;50000;23` | 200 | {"status":"recieved","operacionId":"OP-0007"} |
| alea2-04 | 14 | 3216 | ANULA: anula transferencia (titular distinto) | `ANULA;OP-0007;54` | 200 | {"ok":true,"anulada":"OP-0007"} |
| alea2-05 | 0 | 3217 | reset | POST /__reset | 200 | {"ok":true} |
| alea2-05 | 1 | 3218 | ALTA: titular "Ana Maria" | `ALTA;Ana Maria;44` | 201 | {"cuentaId":"AC-0001"} |
| alea2-05 | 2 | 3219 | ALTA: titular "Ana Maria" | `ALTA;Ana Maria;44` | 201 | {"cuentaId":"AC-0002"} |
| alea2-05 | 3 | 3220 | DEPOSITO | `DEPOSITO;ac-0001;50000;39` | 404 | {"error":"E401","mensaje":"cuenta inexistente"} |
| alea2-05 | 4 | 3221 | ALTA: titular "Ana Maria" | `ALTA;Ana Maria;44` | 201 | {"cuentaId":"AC-0003"} |
| alea2-05 | 5 | 3222 | ALTA: titular "Ana Maria" | `ALTA;Ana Maria;44` | 201 | {"cuentaId":"AC-0004"} |
| alea2-05 | 6 | 3223 | TRANSFER: mismo titular exacto | `TRANSFER;AC-0002;AC-0001;50001;20` | 422 | {"error":"E507","mensaje":"saldo insuficiente"} |
| alea2-05 | 7 | 3224 | TRANSFER: mismo titular exacto | `TRANSFER;AC-0004;AC-0001;60000;63` | 422 | {"error":"E507","mensaje":"saldo insuficiente"} |
| alea2-05 | 8 | 3225 | ALTA: titular "Ana Maria" | `ALTA;Ana Maria;44` | 201 | {"cuentaId":"AC-0005"} |
| alea2-05 | 9 | 3226 | PING | `PING;64` | 200 | {"pong":true} |
| alea2-05 | 10 | 3227 | minusculas: mismo titular exacto | `transfer;AC-0003;AC-0004;60000;44` | 422 | {"error":"E507","mensaje":"saldo insuficiente"} |
| alea2-05 | 11 | 3228 | DEPOSITO | `DEPOSITO;AC-0003;900000;12` | 200 | {"status":"recieved","operacionId":"OP-0001"} |
| alea2-05 | 12 | 3229 | CONSULTA | `CONSULTA;AC-0001;14` | 200 | {"cuenta_id":"AC-0001","saldo":"0.00"} |
| alea2-05 | 13 | 3230 | TRANSFER: mismo titular exacto | `TRANSFER;AC-0005;AC-0004;50000;41` | 422 | {"error":"E507","mensaje":"saldo insuficiente"} |
| alea2-06 | 0 | 3231 | reset | POST /__reset | 200 | {"ok":true} |
| alea2-06 | 1 | 3232 | TRANSFER: cuenta desconocida | `TRANSFER;AC-1;ac-0001;49999;2` | 404 | {"error":"E401","mensaje":"cuenta inexistente"} |
| alea2-06 | 2 | 3233 | ALTA: titular "Ana" | `ALTA;Ana;50` | 201 | {"cuentaId":"AC-0001"} |
| alea2-06 | 3 | 3234 | ALTA: titular "Ana" | `ALTA;Ana;50` | 201 | {"cuentaId":"AC-0002"} |
| alea2-06 | 4 | 3235 | DEPOSITO | `DEPOSITO;AC-0002;1000;8` | 200 | {"status":"recieved","operacionId":"OP-0001"} |
| alea2-06 | 5 | 3236 | ANULA: anula operación | `ANULA;OP-0001;72` | 200 | {"ok":true,"anulada":"OP-0001"} |
| alea2-06 | 6 | 3237 | TRANSFER: mismo titular exacto | `TRANSFER;AC-0001;AC-0002;50001;56` | 422 | {"error":"E507","mensaje":"saldo insuficiente"} |
| alea2-06 | 7 | 3238 | DEPOSITO | `DEPOSITO;AC-0001;100000;6` | 200 | {"status":"recieved","operacionId":"OP-0002"} |
| alea2-06 | 8 | 3239 | ALTA: titular "Ana" | `ALTA;Ana;50` | 201 | {"cuentaId":"AC-0003"} |
| alea2-06 | 9 | 3240 | minusculas | `deposito;AC-0003;50000;81` | 200 | {"status":"recieved","operacionId":"OP-0003"} |
| alea2-06 | 10 | 3241 | TRANSFER: mismo titular exacto | `TRANSFER;AC-0003;AC-0002;49999;32` | 200 | {"status":"recieved","operacionId":"OP-0004"} |
| alea2-06 | 11 | 3242 | DEPOSITO | `DEPOSITO;AC-0003;50001;78` | 200 | {"status":"recieved","operacionId":"OP-0005"} |
| alea2-06 | 12 | 3243 | DEPOSITO | `DEPOSITO;AC-0002;9999999999;51` | 200 | {"status":"recieved","operacionId":"OP-0006"} |
| alea2-07 | 0 | 3244 | reset | POST /__reset | 200 | {"ok":true} |
| alea2-07 | 1 | 3245 | ALTA: titular "x" | `ALTA;x;84` | 201 | {"cuentaId":"AC-0001"} |
| alea2-07 | 2 | 3246 | ALTA: titular "x" | `ALTA;x;84` | 201 | {"cuentaId":"AC-0002"} |
| alea2-07 | 3 | 3247 | ALTA: titular "x" | `ALTA;x;84` | 201 | {"cuentaId":"AC-0003"} |
| alea2-07 | 4 | 3248 | DEPOSITO | `DEPOSITO;AC-1;9999999999;69` | 404 | {"error":"E401","mensaje":"cuenta inexistente"} |
| alea2-07 | 5 | 3249 | TRANSFER: mismo titular exacto | `TRANSFER;AC-0001;AC-0003;50001;77` | 422 | {"error":"E507","mensaje":"saldo insuficiente"} |
| alea2-07 | 6 | 3250 | TRANSFER: mismo titular exacto | `TRANSFER;AC-0002;AC-0003;100000;72` | 422 | {"error":"E507","mensaje":"saldo insuficiente"} |
| alea2-07 | 7 | 3251 | TRANSFER: mismo titular exacto | `TRANSFER;AC-0002;AC-0002;49999;47` | 400 | {"error":"E304","mensaje":"origen y destino iguales"} |
| alea2-07 | 8 | 3252 | HALT | `HALT;71` | 400 | {"error":"E302","mensaje":"aridad inválida"} |
| alea2-07 | 9 | 3253 | TRANSFER: mismo titular exacto | `TRANSFER;AC-0002;AC-0003;100000;72` | 422 | {"error":"E507","mensaje":"saldo insuficiente"} |
| alea2-07 | 10 | 3254 | CONSULTA | `CONSULTA;AC-0003;8` | 200 | {"cuenta_id":"AC-0003","saldo":"0.00"} |
| alea2-07 | 11 | 3255 | DEPOSITO | `DEPOSITO;AC-0002;50000;60` | 200 | {"status":"recieved","operacionId":"OP-0001"} |
| alea2-07 | 12 | 3256 | ANULA: anula operación | `ANULA;OP-0001;72` | 200 | {"ok":true,"anulada":"OP-0001"} |
| alea2-07 | 13 | 3257 | CONSULTA | `CONSULTA;AC-0099;11` | 404 | {"error":"E401","mensaje":"cuenta inexistente"} |
| alea2-08 | 0 | 3258 | reset | POST /__reset | 200 | {"ok":true} |
| alea2-08 | 1 | 3259 | DEPOSITO | `DEPOSITO;ac-0001;1000;35` | 404 | {"error":"E401","mensaje":"cuenta inexistente"} |
| alea2-08 | 2 | 3260 | ALTA: titular "AC-0001" | `ALTA;AC-0001;72` | 201 | {"cuentaId":"AC-0001"} |
| alea2-08 | 3 | 3261 | ALTA: titular "Ñandú" | `ALTA;Ñandú;41` | 201 | {"cuentaId":"AC-0002"} |
| alea2-08 | 4 | 3262 | ALTA: titular "Ana" | `ALTA;Ana;50` | 201 | {"cuentaId":"AC-0003"} |
| alea2-08 | 5 | 3263 | TRANSFER: titular distinto | `TRANSFER;AC-0003;AC-0002;999999999;11` | 422 | {"error":"E506","mensaje":"límite excedido"} |
| alea2-08 | 6 | 3264 | ALTA: titular "Beto" | `ALTA;Beto;11` | 201 | {"cuentaId":"AC-0004"} |
| alea2-08 | 7 | 3265 | DEPOSITO | `DEPOSITO;AC-0001;100000;6` | 200 | {"status":"recieved","operacionId":"OP-0001"} |
| alea2-08 | 8 | 3266 | TRANSFER: titular distinto | `TRANSFER;AC-0004;AC-0002;50001;11` | 422 | {"error":"E506","mensaje":"límite excedido"} |
| alea2-08 | 9 | 3267 | ALTA: titular "AC-0001" | `ALTA;AC-0001;72` | 201 | {"cuentaId":"AC-0005"} |
| alea2-08 | 10 | 3268 | DEPOSITO | `DEPOSITO;AC-0005;900000;44` | 200 | {"status":"recieved","operacionId":"OP-0002"} |
| alea2-08 | 11 | 3269 | ANULA: anula operación | `ANULA;OP-0002;69` | 200 | {"ok":true,"anulada":"OP-0002"} |
| alea2-08 | 12 | 3270 | TRANSFER: mismo titular exacto | `TRANSFER;AC-0005;AC-0001;050001;13` | 400 | {"error":"E303","mensaje":"monto inválido"} |
| alea2-08 | 13 | 3271 | TRANSFER: mismo titular exacto | `TRANSFER;AC-0001;AC-0005;50000;25` | 200 | {"status":"recieved","operacionId":"OP-0003"} |
| alea2-09 | 0 | 3272 | reset | POST /__reset | 200 | {"ok":true} |
| alea2-09 | 1 | 3273 | control: cuenta desconocida | `TRANSFER;ac-0001;AC-0099;50001;57` | 400 | {"error":"E202","mensaje":"control inválido"} |
| alea2-09 | 2 | 3274 | ALTA: titular "Beto" | `ALTA;Beto;11` | 201 | {"cuentaId":"AC-0001"} |
| alea2-09 | 3 | 3275 | desconocido | `CUENTAS;AC-0001;29` | 400 | {"error":"E301","mensaje":"comando desconocido "} |
| alea2-09 | 4 | 3276 | DEPOSITO | `DEPOSITO;AC-1;900000;95` | 404 | {"error":"E401","mensaje":"cuenta inexistente"} |
| alea2-09 | 5 | 3277 | ANULA | `ANULA;OP-0001;72` | 404 | {"error":"E402","mensaje":"operación inexistente"} |
| alea2-09 | 6 | 3278 | ALTA: titular "Beto" | `ALTA;Beto;11` | 201 | {"cuentaId":"AC-0002"} |
| alea2-09 | 7 | 3279 | ALTA: titular "Beto" | `ALTA;Beto;11` | 201 | {"cuentaId":"AC-0003"} |
| alea2-09 | 8 | 3280 | aridad: titular "Beto" | `ALTA;85` | 400 | {"error":"E302","mensaje":"aridad inválida"} |
| alea2-09 | 9 | 3281 | TRANSFER: mismo titular exacto | `TRANSFER;AC-0002;AC-0001;50001;20` | 422 | {"error":"E507","mensaje":"saldo insuficiente"} |
| alea2-09 | 10 | 3282 | DEPOSITO | `DEPOSITO;AC-0003;050001;73` | 400 | {"error":"E303","mensaje":"monto inválido"} |
| alea2-09 | 11 | 3283 | ALTA: titular "Beto" | `ALTA;Beto;11` | 201 | {"cuentaId":"AC-0004"} |
| alea2-09 | 12 | 3284 | TRANSFER: mismo titular exacto | `TRANSFER;AC-0002;AC-0003;100000;72` | 422 | {"error":"E507","mensaje":"saldo insuficiente"} |
| alea2-09 | 13 | 3285 | TRANSFER: mismo titular exacto | `TRANSFER;AC-0001;AC-0002;50001;56` | 422 | {"error":"E507","mensaje":"saldo insuficiente"} |
| alea2-10 | 0 | 3286 | reset | POST /__reset | 200 | {"ok":true} |
| alea2-10 | 1 | 3287 | ALTA: titular "x" | `ALTA;x;84` | 201 | {"cuentaId":"AC-0001"} |
| alea2-10 | 2 | 3288 | ALTA: titular "x" | `ALTA;x;84` | 201 | {"cuentaId":"AC-0002"} |
| alea2-10 | 3 | 3289 | ALTA: titular "Beto" | `ALTA;Beto;11` | 201 | {"cuentaId":"AC-0003"} |
| alea2-10 | 4 | 3290 | TRANSFER: titular distinto | `TRANSFER;AC-0003;AC-0002;1;70` | 422 | {"error":"E507","mensaje":"saldo insuficiente"} |
| alea2-10 | 5 | 3291 | ALTA: titular "0" | `ALTA;0;65` | 201 | {"cuentaId":"AC-0004"} |
| alea2-10 | 6 | 3292 | TRANSFER: titular distinto | `TRANSFER;AC-0004;AC-0003;49999;38` | 422 | {"error":"E507","mensaje":"saldo insuficiente"} |
| alea2-10 | 7 | 3293 | CONSULTA | `CONSULTA;AC-0004;5` | 200 | {"cuenta_id":"AC-0004","saldo":"0.00"} |
| alea2-10 | 8 | 3294 | ALTA: titular "x" | `ALTA;x;84` | 201 | {"cuentaId":"AC-0005"} |
| alea2-10 | 9 | 3295 | ALTA: titular "José" | `ALTA;José;61` | 201 | {"cuentaId":"AC-0006"} |
| alea2-10 | 10 | 3296 | TRANSFER: mismo titular exacto | `TRANSFER;AC-0002;AC-0001;60000;93` | 422 | {"error":"E507","mensaje":"saldo insuficiente"} |
| alea2-10 | 11 | 3297 | TRANSFER: mismo titular exacto | `TRANSFER;AC-0001;AC-0005;49999;28` | 422 | {"error":"E507","mensaje":"saldo insuficiente"} |
| alea2-10 | 12 | 3298 | TRANSFER: mismo titular exacto | `TRANSFER;AC-0001;AC-0002;50000;59` | 422 | {"error":"E507","mensaje":"saldo insuficiente"} |
| alea2-10 | 13 | 3299 | DEPOSITO | `DEPOSITO;AC-0002;1000;8` | 200 | {"status":"recieved","operacionId":"OP-0001"} |
| alea2-11 | 0 | 3300 | reset | POST /__reset | 200 | {"ok":true} |
| alea2-11 | 1 | 3301 | ALTA: titular "Ñandú" | `ALTA;Ñandú;41` | 201 | {"cuentaId":"AC-0001"} |
| alea2-11 | 2 | 3302 | DEPOSITO | `DEPOSITO;AC-0001;9999999999;4` | 200 | {"status":"recieved","operacionId":"OP-0001"} |
| alea2-11 | 3 | 3303 | DEPOSITO | `DEPOSITO;AC-0001;100000;6` | 200 | {"status":"recieved","operacionId":"OP-0002"} |
| alea2-11 | 4 | 3304 | ALTA: titular "Ñandú" | `ALTA;Ñandú;41` | 201 | {"cuentaId":"AC-0002"} |
| alea2-11 | 5 | 3305 | PING | `ping;64` | 200 | {"pong":true} |
| alea2-11 | 6 | 3306 | ALTA: titular "Ñandú" | `ALTA;Ñandú;41` | 201 | {"cuentaId":"AC-0003"} |
| alea2-11 | 7 | 3307 | ALTA: titular "0" | `ALTA;0;65` | 201 | {"cuentaId":"AC-0004"} |
| alea2-11 | 8 | 3308 | TRANSFER: titular distinto | `TRANSFER;AC-0003;AC-0004;100000;35` | 422 | {"error":"E506","mensaje":"límite excedido"} |
| alea2-11 | 9 | 3309 | ALTA: titular "Ñandú" | `ALTA;Ñandú;41` | 201 | {"cuentaId":"AC-0005"} |
| alea2-11 | 10 | 3310 | DEPOSITO | `DEPOSITO;AC-0002;50001;57` | 200 | {"status":"recieved","operacionId":"OP-0003"} |
| alea2-11 | 11 | 3311 | DEPOSITO | `DEPOSITO;AC-0002;50001;57` | 200 | {"status":"recieved","operacionId":"OP-0004"} |
| alea2-11 | 12 | 3312 | CONSULTA | `CONSULTA;AC-0004;5` | 200 | {"cuenta_id":"AC-0004","saldo":"0.00"} |
| alea2-11 | 13 | 3313 | DEPOSITO | `DEPOSITO;AC-0001;50000;39` | 200 | {"status":"recieved","operacionId":"OP-0005"} |
| alea2-11 | 14 | 3314 | ALTA: titular "0" | `ALTA;0;65` | 201 | {"cuentaId":"AC-0006"} |
| alea2-12 | 0 | 3315 | reset | POST /__reset | 200 | {"ok":true} |
| alea2-12 | 1 | 3316 | ANULA | `ANULA;OP-0001;72` | 404 | {"error":"E402","mensaje":"operación inexistente"} |
| alea2-12 | 2 | 3317 | ALTA: titular "Ñandú" | `ALTA;Ñandú;41` | 201 | {"cuentaId":"AC-0001"} |
| alea2-12 | 3 | 3318 | ALTA: titular "Ñandú" | `ALTA;Ñandú;41` | 201 | {"cuentaId":"AC-0002"} |
| alea2-12 | 4 | 3319 | DEPOSITO | `DEPOSITO;AC-0002;60000;33` | 200 | {"status":"recieved","operacionId":"OP-0001"} |
| alea2-12 | 5 | 3320 | TRANSFER: mismo titular exacto | `TRANSFER;AC-0001;AC-0002;1;41` | 422 | {"error":"E507","mensaje":"saldo insuficiente"} |
| alea2-12 | 6 | 3321 | ANULA: anula operación | `ANULA;OP-0001;72` | 200 | {"ok":true,"anulada":"OP-0001"} |
| alea2-12 | 7 | 3322 | TRANSFER: mismo titular exacto | `TRANSFER;AC-0002;AC-0001;60000;93` | 422 | {"error":"E507","mensaje":"saldo insuficiente"} |
| alea2-12 | 8 | 3323 | TRANSFER: mismo titular exacto | `TRANSFER;AC-0002;AC-0001;50001;20` | 422 | {"error":"E507","mensaje":"saldo insuficiente"} |
| alea2-12 | 9 | 3324 | CONSULTA | `CONSULTA;AC-1;5` | 404 | {"error":"E401","mensaje":"cuenta inexistente"} |
| alea2-12 | 10 | 3325 | DEPOSITO | `DEPOSITO;AC-0002;9999999999;51` | 200 | {"status":"recieved","operacionId":"OP-0002"} |
| alea2-12 | 11 | 3326 | TRANSFER: mismo titular exacto | `TRANSFER;AC-0002;AC-0001;50000;23` | 200 | {"status":"recieved","operacionId":"OP-0003"} |
| alea2-13 | 0 | 3327 | reset | POST /__reset | 200 | {"ok":true} |
| alea2-13 | 1 | 3328 | DEPOSITO | `DEPOSITO;AC-0099;100000;22` | 404 | {"error":"E401","mensaje":"cuenta inexistente"} |
| alea2-13 | 2 | 3329 | CONSULTA | `CONSULTA;AC-1;5` | 404 | {"error":"E401","mensaje":"cuenta inexistente"} |
| alea2-13 | 3 | 3330 | ALTA: titular "José" | `ALTA;José;61` | 201 | {"cuentaId":"AC-0001"} |
| alea2-13 | 4 | 3331 | ALTA: titular "José" | `ALTA;José;61` | 201 | {"cuentaId":"AC-0002"} |
| alea2-13 | 5 | 3332 | ALTA: titular "Ana" | `ALTA;Ana;50` | 201 | {"cuentaId":"AC-0003"} |
| alea2-13 | 6 | 3333 | TRANSFER: mismo titular exacto | `TRANSFER;AC-0002;AC-0002;60000;17` | 400 | {"error":"E304","mensaje":"origen y destino iguales"} |
| alea2-13 | 7 | 3334 | DEPOSITO | `DEPOSITO;AC-0003;50001;78` | 200 | {"status":"recieved","operacionId":"OP-0001"} |
| alea2-13 | 8 | 3335 | DEPOSITO | `DEPOSITO;AC-0003;999999999;91` | 200 | {"status":"recieved","operacionId":"OP-0002"} |
| alea2-13 | 9 | 3336 | ANULA: anula operación | `ANULA;OP-0002;69` | 200 | {"ok":true,"anulada":"OP-0002"} |
| alea2-13 | 10 | 3337 | CONSULTA | `CONSULTA;AC-0003;8` | 200 | {"cuenta_id":"AC-0003","saldo":"500.01"} |
| alea2-13 | 11 | 3338 | TRANSFER: titular distinto | `TRANSFER;AC-0003;AC-0002;50001;26` | 422 | {"error":"E506","mensaje":"límite excedido"} |
| alea2-13 | 12 | 3339 | DEPOSITO | `DEPOSITO;AC-0003;50001;78` | 200 | {"status":"recieved","operacionId":"OP-0003"} |
| alea2-13 | 13 | 3340 | TRANSFER: mismo titular exacto | `TRANSFER;AC-0001;AC-0002;50000;59` | 422 | {"error":"E507","mensaje":"saldo insuficiente"} |
| alea2-14 | 0 | 3341 | reset | POST /__reset | 200 | {"ok":true} |
| alea2-14 | 1 | 3342 | control | `CONSULTA;AC-1;6` | 400 | {"error":"E202","mensaje":"control inválido"} |
| alea2-14 | 2 | 3343 | minusculas | `anula;OP-0001;72` | 404 | {"error":"E402","mensaje":"operación inexistente"} |
| alea2-14 | 3 | 3344 | ALTA: titular "AC-0001" | `ALTA;AC-0001;72` | 201 | {"cuentaId":"AC-0001"} |
| alea2-14 | 4 | 3345 | DEPOSITO | `DEPOSITO;AC-0001;9999999999;4` | 200 | {"status":"recieved","operacionId":"OP-0001"} |
| alea2-14 | 5 | 3346 | DEPOSITO | `DEPOSITO;AC-0001;60000;12` | 200 | {"status":"recieved","operacionId":"OP-0002"} |
| alea2-14 | 6 | 3347 | ANULA: anula operación | `ANULA;OP-0001;72` | 200 | {"ok":true,"anulada":"OP-0001"} |
| alea2-14 | 7 | 3348 | ALTA: titular "AC-0001" | `ALTA;AC-0001;72` | 201 | {"cuentaId":"AC-0002"} |
| alea2-14 | 8 | 3349 | ALTA: titular "AC-0001" | `ALTA;AC-0001;72` | 201 | {"cuentaId":"AC-0003"} |
| alea2-14 | 9 | 3350 | ALTA: titular "" | `ALTA;;85` | 400 | {"error":"E104","mensaje":"segmento vacío"} |
| alea2-14 | 10 | 3351 | ALTA: titular "AC-0001" | `ALTA;AC-0001;72` | 201 | {"cuentaId":"AC-0004"} |
| alea2-14 | 11 | 3352 | ALTA: titular "AC-0001" | `ALTA;AC-0001;72` | 201 | {"cuentaId":"AC-0005"} |
| alea2-14 | 12 | 3353 | aridad | `DEPOSITO;AC-0004;92` | 400 | {"error":"E302","mensaje":"aridad inválida"} |
| alea2-15 | 0 | 3354 | reset | POST /__reset | 200 | {"ok":true} |
| alea2-15 | 1 | 3355 | ALTA: titular "Ana" | `ALTA;Ana;50` | 201 | {"cuentaId":"AC-0001"} |
| alea2-15 | 2 | 3356 | DEPOSITO | `DEPOSITO;AC-0001;-50001;36` | 400 | {"error":"E303","mensaje":"monto inválido"} |
| alea2-15 | 3 | 3357 | desconocido | `CUENTAS;AC-0001;29` | 400 | {"error":"E301","mensaje":"comando desconocido "} |
| alea2-15 | 4 | 3358 | ALTA: titular "Ana" | `ALTA;Ana;50` | 201 | {"cuentaId":"AC-0002"} |
| alea2-15 | 5 | 3359 | TRANSFER: mismo titular exacto | `TRANSFER;AC-0001;AC-0002;50001;56` | 422 | {"error":"E507","mensaje":"saldo insuficiente"} |
| alea2-15 | 6 | 3360 | PING | `PING;65` | 200 | {"pong":true} |
| alea2-15 | 7 | 3361 | TRANSFER: mismo titular exacto | `TRANSFER;AC-0001;AC-0002;60000;32` | 422 | {"error":"E507","mensaje":"saldo insuficiente"} |
| alea2-15 | 8 | 3362 | aridad: mismo titular exacto | `TRANSFER;AC-0002;AC-0001;34` | 400 | {"error":"E302","mensaje":"aridad inválida"} |
| alea2-15 | 9 | 3363 | TRANSFER: mismo titular exacto | `TRANSFER;AC-0002;AC-0001;100000;40` | 422 | {"error":"E507","mensaje":"saldo insuficiente"} |
| alea2-15 | 10 | 3364 | ALTA: titular "José" | `ALTA;José;61` | 201 | {"cuentaId":"AC-0003"} |
| alea2-15 | 11 | 3365 | ALTA: titular "José" | `ALTA;José;61` | 201 | {"cuentaId":"AC-0004"} |
| alea2-16 | 0 | 3366 | reset | POST /__reset | 200 | {"ok":true} |
| alea2-16 | 1 | 3367 | ALTA: titular "123" | `ALTA;123;18` | 201 | {"cuentaId":"AC-0001"} |
| alea2-16 | 2 | 3368 | DEPOSITO | `DEPOSITO;AC-0001;50001;36` | 200 | {"status":"recieved","operacionId":"OP-0001"} |
| alea2-16 | 3 | 3369 | ALTA: titular "123" | `ALTA;123;18` | 201 | {"cuentaId":"AC-0002"} |
| alea2-16 | 4 | 3370 | DEPOSITO | `DEPOSITO;AC-0001;50000.5;75` | 400 | {"error":"E303","mensaje":"monto inválido"} |
| alea2-16 | 5 | 3371 | ALTA: titular "123" | `ALTA;123;18` | 201 | {"cuentaId":"AC-0003"} |
| alea2-16 | 6 | 3372 | ANULA: anula operación | `ANULA;OP-0001;72` | 200 | {"ok":true,"anulada":"OP-0001"} |
| alea2-16 | 7 | 3373 | CONSULTA | `CONSULTA;AC-0001;14` | 200 | {"cuenta_id":"AC-0001","saldo":"0.00"} |
| alea2-16 | 8 | 3374 | DEPOSITO | `DEPOSITO;AC-0003;900000;12` | 200 | {"status":"recieved","operacionId":"OP-0002"} |
| alea2-16 | 9 | 3375 | aridad: mismo titular exacto | `TRANSFER;AC-0002;AC-0001;60000;Ana;25` | 400 | {"error":"E302","mensaje":"aridad inválida"} |
| alea2-16 | 10 | 3376 | DEPOSITO | `DEPOSITO;AC-0001;-50001;36` | 400 | {"error":"E303","mensaje":"monto inválido"} |
| alea2-16 | 11 | 3377 | ANULA: anula operación | `ANULA;OP-0002;69` | 200 | {"ok":true,"anulada":"OP-0002"} |
| alea2-16 | 12 | 3378 | ALTA: titular "123" | `ALTA;123;18` | 201 | {"cuentaId":"AC-0004"} |
| alea2-16 | 13 | 3379 | DEPOSITO | `DEPOSITO;AC-0003;999999999;91` | 200 | {"status":"recieved","operacionId":"OP-0003"} |
| alea2-16 | 14 | 3380 | TRANSFER: mismo titular exacto | `TRANSFER;AC-0002;AC-0003;25000;84` | 422 | {"error":"E507","mensaje":"saldo insuficiente"} |
| alea2-16 | 15 | 3381 | DEPOSITO | `DEPOSITO;AC-1;9999999999;69` | 404 | {"error":"E401","mensaje":"cuenta inexistente"} |
| alea2-17 | 0 | 3382 | reset | POST /__reset | 200 | {"ok":true} |
| alea2-17 | 1 | 3383 | CONSULTA | `CONSULTA;AC-1;5` | 404 | {"error":"E401","mensaje":"cuenta inexistente"} |
| alea2-17 | 2 | 3384 | ALTA: titular "Beto" | `ALTA;Beto;11` | 201 | {"cuentaId":"AC-0001"} |
| alea2-17 | 3 | 3385 | ALTA: titular "Beto" | `ALTA;Beto;11` | 201 | {"cuentaId":"AC-0002"} |
| alea2-17 | 4 | 3386 | TRANSFER: mismo titular exacto | `TRANSFER;AC-0001;AC-0001;50001;35` | 400 | {"error":"E304","mensaje":"origen y destino iguales"} |
| alea2-17 | 5 | 3387 | TRANSFER: mismo titular exacto | `TRANSFER;AC-0001;AC-0002;999999999;87` | 422 | {"error":"E507","mensaje":"saldo insuficiente"} |
| alea2-17 | 6 | 3388 | TRANSFER: mismo titular exacto | `TRANSFER;AC-0002;AC-0001;999999999;54` | 422 | {"error":"E507","mensaje":"saldo insuficiente"} |
| alea2-17 | 7 | 3389 | ALTA: titular "Beto " | `ALTA;Beto ;11` | 201 | {"cuentaId":"AC-0003"} |
| alea2-17 | 8 | 3390 | TRANSFER: titular parecido ("Beto" vs "Beto ") | `TRANSFER;AC-0001;AC-0003;50000;80` | 422 | {"error":"E507","mensaje":"saldo insuficiente"} |
| alea2-17 | 9 | 3391 | CONSULTA | `CONSULTA;AC-0003;8` | 200 | {"cuenta_id":"AC-0003","saldo":"0.00"} |
| alea2-17 | 10 | 3392 | PING | `PING;64` | 200 | {"pong":true} |
| alea2-17 | 11 | 3393 | TRANSFER: mismo titular exacto | `TRANSFER;AC-0001;AC-0002;49999;62` | 422 | {"error":"E507","mensaje":"saldo insuficiente"} |
| alea2-17 | 12 | 3394 | DEPOSITO | `DEPOSITO;AC-0003;50000;81` | 200 | {"status":"recieved","operacionId":"OP-0001"} |
| alea2-17 | 13 | 3395 | CONSULTA | `CONSULTA;AC-0001;14` | 200 | {"cuenta_id":"AC-0001","saldo":"0.00"} |
| alea2-18 | 0 | 3396 | reset | POST /__reset | 200 | {"ok":true} |
| alea2-18 | 1 | 3397 | control | `DEPOSITO;AC-0099;100000;23` | 400 | {"error":"E202","mensaje":"control inválido"} |
| alea2-18 | 2 | 3398 | ALTA: titular "123" | `ALTA;123;18` | 201 | {"cuentaId":"AC-0001"} |
| alea2-18 | 3 | 3399 | CONSULTA | `CONSULTA;AC-0099;11` | 404 | {"error":"E401","mensaje":"cuenta inexistente"} |
| alea2-18 | 4 | 3400 | ALTA: titular "123" | `ALTA;123;18` | 201 | {"cuentaId":"AC-0002"} |
| alea2-18 | 5 | 3401 | ALTA: titular "123" | `ALTA;123;18` | 201 | {"cuentaId":"AC-0003"} |
| alea2-18 | 6 | 3402 | minusculas: mismo titular exacto | `transfer;AC-0001;AC-0002;50001;56` | 422 | {"error":"E507","mensaje":"saldo insuficiente"} |
| alea2-18 | 7 | 3403 | ALTA: titular "123" | `ALTA;123;18` | 201 | {"cuentaId":"AC-0004"} |
| alea2-18 | 8 | 3404 | TRANSFER: mismo titular exacto | `TRANSFER;AC-0001;AC-0003;1;11` | 422 | {"error":"E507","mensaje":"saldo insuficiente"} |
| alea2-18 | 9 | 3405 | ALTA: titular "123" | `ALTA;123;18` | 201 | {"cuentaId":"AC-0005"} |
| alea2-18 | 10 | 3406 | PING | `PING;65` | 200 | {"pong":true} |
| alea2-18 | 11 | 3407 | DEPOSITO | `DEPOSITO;AC-0002;50000.5;91` | 400 | {"error":"E303","mensaje":"monto inválido"} |
| alea2-18 | 12 | 3408 | CONSULTA | `CONSULTA;AC-0003;8` | 200 | {"cuenta_id":"AC-0003","saldo":"0.00"} |
| alea2-18 | 13 | 3409 | DEPOSITO | `DEPOSITO;AC-0003;9999999999;98` | 200 | {"status":"recieved","operacionId":"OP-0001"} |
| alea2-18 | 14 | 3410 | DEPOSITO | `DEPOSITO;AC-0001;9999999999;4` | 200 | {"status":"recieved","operacionId":"OP-0002"} |
| alea2-18 | 15 | 3411 | ANULA: anula operación | `ANULA;OP-0001;72` | 200 | {"ok":true,"anulada":"OP-0001"} |
| alea2-18 | 16 | 3412 | control | `DEPOSITO;AC-1;100000;25` | 400 | {"error":"E202","mensaje":"control inválido"} |
| alea2-19 | 0 | 3413 | reset | POST /__reset | 200 | {"ok":true} |
| alea2-19 | 1 | 3414 | ALTA: titular "x" | `ALTA;x;84` | 201 | {"cuentaId":"AC-0001"} |
| alea2-19 | 2 | 3415 | DEPOSITO | `DEPOSITO;AC-0099;900000;93` | 404 | {"error":"E401","mensaje":"cuenta inexistente"} |
| alea2-19 | 3 | 3416 | CONSULTA | `CONSULTA;AC-0001;14` | 200 | {"cuenta_id":"AC-0001","saldo":"0.00"} |
| alea2-19 | 4 | 3417 | ALTA: titular "x" | `ALTA;x;84` | 201 | {"cuentaId":"AC-0002"} |
| alea2-19 | 5 | 3418 | CONSULTA | `CONSULTA;AC-0001;14` | 200 | {"cuenta_id":"AC-0001","saldo":"0.00"} |
| alea2-19 | 6 | 3419 | TRANSFER: mismo titular exacto | `TRANSFER;AC-0001;AC-0002;100000;12` | 422 | {"error":"E507","mensaje":"saldo insuficiente"} |
| alea2-19 | 7 | 3420 | ALTA: titular "Beto" | `ALTA;Beto;11` | 201 | {"cuentaId":"AC-0003"} |
| alea2-19 | 8 | 3421 | TRANSFER: mismo titular exacto | `TRANSFER;AC-0002;AC-0001;10000000000;19` | 400 | {"error":"E303","mensaje":"monto inválido"} |
| alea2-19 | 9 | 3422 | TRANSFER: titular distinto | `TRANSFER;AC-0002;AC-0003;49999;68` | 422 | {"error":"E507","mensaje":"saldo insuficiente"} |
| alea2-19 | 10 | 3423 | TRANSFER: mismo titular exacto | `TRANSFER;AC-0001;AC-0002;50000;59` | 422 | {"error":"E507","mensaje":"saldo insuficiente"} |
| alea2-19 | 11 | 3424 | minusculas | `anula;OP-0001;72` | 404 | {"error":"E402","mensaje":"operación inexistente"} |
| alea2-19 | 12 | 3425 | TRANSFER: mismo titular exacto | `TRANSFER;AC-0001;AC-0002;100000;12` | 422 | {"error":"E507","mensaje":"saldo insuficiente"} |
| alea2-19 | 13 | 3426 | TRANSFER: titular distinto | `TRANSFER;AC-0002;AC-0003;49999;68` | 422 | {"error":"E507","mensaje":"saldo insuficiente"} |
| alea2-19 | 14 | 3427 | ALTA: titular "BETO" | `ALTA;BETO;11` | 201 | {"cuentaId":"AC-0004"} |
| alea2-20 | 0 | 3428 | reset | POST /__reset | 200 | {"ok":true} |
| alea2-20 | 1 | 3429 | ALTA: titular "123" | `ALTA;123;18` | 201 | {"cuentaId":"AC-0001"} |
| alea2-20 | 2 | 3430 | minusculas: cuenta desconocida | `transfer;AC-0001;AC-1;100000;56` | 404 | {"error":"E401","mensaje":"cuenta inexistente"} |
| alea2-20 | 3 | 3431 | ALTA: titular "123" | `ALTA;123;18` | 201 | {"cuentaId":"AC-0002"} |
| alea2-20 | 4 | 3432 | DEPOSITO | `DEPOSITO;AC-0001;900000;77` | 200 | {"status":"recieved","operacionId":"OP-0001"} |
| alea2-20 | 5 | 3433 | ALTA: titular "123" | `ALTA;123;18` | 201 | {"cuentaId":"AC-0003"} |
| alea2-20 | 6 | 3434 | CONSULTA | `CONSULTA;AC-0001;14` | 200 | {"cuenta_id":"AC-0001","saldo":"9000.00"} |
| alea2-20 | 7 | 3435 | ANULA: anula operación | `ANULA;OP-0001;72` | 200 | {"ok":true,"anulada":"OP-0001"} |
| alea2-20 | 8 | 3436 | CONSULTA | `CONSULTA;AC-0002;11` | 200 | {"cuenta_id":"AC-0002","saldo":"0.00"} |
| alea2-20 | 9 | 3437 | CONSULTA | `CONSULTA;AC-0002;11` | 200 | {"cuenta_id":"AC-0002","saldo":"0.00"} |
| alea2-20 | 10 | 3438 | TRANSFER: mismo titular exacto | `TRANSFER;AC-0002;AC-0001;100000;40` | 422 | {"error":"E507","mensaje":"saldo insuficiente"} |

Requests usados: 277 en 20 secuencias (ids 3162–3438)
