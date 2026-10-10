Informe para el agente de código — Reto 2 "La caja negra" (Frontier BOG/26)

Fuente: todo lo visible en frontier.lab10.ai (dashboard, entregas, rúbrica) + el material descargado (reto-2.zip → README.md, pruebas/ejemplos.jsonl), leído el 10-oct-2026 a las ~10:20 (hora Bogotá). Lo marcado [HECHO] es literal del material; lo marcado [INFERENCIA] es mío y debe verificarse contra el original antes de implementarse.

0. Resumen ejecutivo (lee esto primero)
Hay que construir un clon HTTP con estado de un servicio bancario de juguete que recibe mensajes de texto CMD;arg1;...;control en POST /msg.
Se califica con 100 tests ocultos que comparan status + cuerpo (JSON sin importar orden de claves; texto no-JSON carácter por carácter). Headers NO se comparan.
Sólo hay 3 corridas del set oculto durante el día (contador en la página de entregas). La que cuenta es la que corre después de las 20:00 sobre el último entrypoint entregado a tiempo.
El servicio original va a cambiar durante el día (incidente 15:30). El reemplazo se evalúa contra la versión vigente a las 20:00.
A las 20:00 los tokens dejan de funcionar contra el original. Todo lo que haya que observar, se observa antes.
Cada request al original debe quedar en el log de experimentos (entregable). Construye el cliente de sondeo con logging obligatorio desde el primer request.
No hace falta LLM dentro del reemplazo: la réplica debe ser determinista (costo ~0, reserva de US$5 irrelevante).
1. Agenda y cierres (hora Bogotá) [HECHO]
Hora	Qué
10:30–12:00	Systems design: doc de una página + diagrama de arquitectura (imagen, pdf o enlace). Cierre 12:00.
12:00	Se puede sumar una persona que eligió el mismo reto (opcional). Cada persona tiene su propio token con estado separado → exploración en paralelo válida.
12:00–20:00	Ejecución. 15:30 llega un incidente.
20:00	Cierre de ejecución: repo, entrypoint, video, especificación, log. Tokens de participante dejan de funcionar contra el original. Corre el set oculto final.
20:00–21:00	Debrief individual de 10 min con un juez.
21:15–22:15	Demo day (pitch).

Entregas: "Cualquier integrante entrega por el equipo. Puedes reemplazar una entrega hasta el cierre: cuenta la última versión. Después del cierre se acepta, marcada como tarde." Los campos que no pasan la validación no se marcan como entregados.

2. Entregables exactos [HECHO]

Systems design (cierre 12:00)

Doc de diseño · una página, pdf o enlace
Diagrama de arquitectura · imagen, pdf o enlace

Ejecución (cierre 20:00)

Repo · URL pública
Entrypoint · URL pública del servicio desplegado, con GET /health y el token del equipo. Botón "VALIDAR ENTRYPOINT".
"SET OCULTO · 0 DE 3 CORRIDAS USADAS · TE QUEDAN 3"
"Si tu entrypoint corre en tu computador o en un túnel y se cae durante el debrief, el set de evaluaciones no se puede correr." → desplegar en la nube, nada de túneles.
Video de 2 minutos · enlace público, máximo 2 minutos
Especificación del servicio (solo reto 2) · archivo, máx. 25 MB
Log de experimentos (solo reto 2) · archivo, máx. 25 MB (experimentos.jsonl)

Demo day: material del pitch (slides, pdf o enlace), opcional.

3. Entorno [HECHO]
Servicio original: https://caja-negra-production-c64f.up.railway.app
Token personal de la caja negra (para sondear el original): en /evento, tarjeta del reto, botón "MOSTRAR". Cada token tiene su propio estado.
Token del equipo (empieza por ftr_): es el que el set oculto manda a TU reemplazo. Botón "COPIAR".
"Tu escritorio o tu token son personales. El token del equipo es compartido."
Ningún token va en el repo público: usar variables de entorno.
4. Contrato del entrypoint (tu reemplazo) [HECHO]

Dashboard, literal:

"Todas las llamadas llevan Authorization: Bearer <token>. Despliégalo donde quieras."
GET /health: "Responde 200 cuando el servicio está listo."
/* (URL base): "Acepta exactamente los mismos requests que el servicio original, incluidas las rutas que no existen."
POST /__reset: "Vuelve el reemplazo a su estado inicial. Lo llamamos antes de cada test. Con otro token o sin token, responde como el original."

README, literal:

Authorization: Bearer <token> en todas las llamadas. Es el token del equipo. Con otro token o sin token, responde como el original.
GET /health responde 200 cuando está listo.
POST /__reset vuelve el reemplazo a su estado inicial. Lo llamamos antes de cada test.
Cualquier otra ruta responde exactamente lo mismo que el original, incluidas las rutas que no existen.

Implicación: hay que medir en el original qué responde (status + cuerpo exacto) sin token, con token inválido, con Bearer mal formado, en /msg, /__reset, /health y rutas inexistentes, con distintos métodos, y replicarlo.

5. Cómo se evalúa [HECHO, literal del README]

Set de evaluación. Son 100 tests. Corren contra tu reemplazo cada vez que validas el entrypoint en /evento, y en /evento/resultados ves cuántos pasan. Después de las 20:00 los corremos una vez más sobre el último entrypoint que entregaste a tiempo, y ese resultado es el que cuenta. Cada test empieza con POST /__reset. Hay 40 de un request, 45 secuencias de 2 a 5 requests y 15 secuencias de 6 a 12. Ningún test repite la secuencia de pruebas/ejemplos.jsonl.

Un test pasa si cada respuesta que comparamos tiene:

el mismo status HTTP, y
el mismo cuerpo. Si los dos cuerpos son JSON, las claves de un objeto pueden venir en cualquier orden, los arrays van en el mismo orden y los strings y números tienen que ser idénticos. Si alguno de los dos no es JSON, se compara el texto exacto, carácter por carácter.

Los headers no se comparan. Cada paso tiene 5 segundos para responder.

Especificación. Un juez la lee contra la lista completa de comportamientos del servicio. Cada comportamiento cuenta si está bien descrito y cita una línea de tu log que lo prueba. Una afirmación falsa resta.

Notas:

Sólo 3 validaciones disponibles (página de entregas). Gastarlas con plan (ver §11).
Un test de secuencia falla entero si falla un paso → el estado (contadores de IDs, saldos) tiene que ser exacto.
40% de los tests son de un solo request → priorizar parsing, validación, orden de errores y comandos sin estado.
Rúbrica (escala 1–4 por criterio) [HECHO]

01 · Systems design 30% (doc + diagrama)

Criterio	Qué buscan	1	4
Entendimiento del problema	Qué tiene que resolver el sistema, sus límites y sus supuestos.	Repite el brief sin tomar decisiones.	Nombra supuestos, casos difíciles y lo que deja fuera, con razones.
Arquitectura y trade-offs	Componentes claros y decisiones justificadas.	Un diagrama sin decisiones detrás.	Cada decisión dice qué alternativa descartó y por qué.
Plan para medir	Cómo van a saber si funciona antes de construir.	No hay forma de medir el resultado.	Casos de prueba y métricas concretas desde el diseño.

02 · Ejecución 40% (repo, entrypoint, video, spec + log)

Criterio	Qué buscan	1	4
Resultado en el set oculto	Lo que logra el entrypoint con casos que no conoce. Corrida final: <25% = 1, hasta 50% = 2, hasta 75% = 3, más = 4.	No responde o falla casi todo.	Resuelve la mayoría de casos, incluidos los nuevos.
Respuesta al incidente	Cómo se adaptan al cambio de las 15:30.	El sistema se rompe y no lo detectan.	Detectan el cambio, se adaptan y lo explican.
Calidad del repo	Que otra persona lo pueda correr y entender.	No se puede correr.	Corre siguiendo el README y el código se explica solo.
Especificación (Reto 2)	Que otro ingeniero pueda reimplementar el servicio con la spec, y que cada comportamiento cite la línea del log que lo prueba.	Pocos comportamientos, sin evidencia o con afirmaciones falsas.	Cubre la mayoría, cada uno con su línea del log, y marca qué es confirmado y qué es supuesto.

03 · Demo day 15%: Claridad (en minutos queda claro problema, solución y evidencia) · Evidencia (resultados reales funcionando, incluido lo que no salió).

04 · Profundidad técnica 15% (debrief 10 min): Explicación de decisiones (explica fallas, límites y qué haría después) · Lectura de resultados ("Explica cada falla con una causa concreta" del set oculto).

"No recolectamos sesiones ni transcripts de tus herramientas."

6. Reglas [HECHO, literal del README]
El reemplazo no puede llamar al original ni a otro reemplazo. Si lo hace, el set vale 0.
Puedes usar un LLM dentro del reemplazo, siempre que responda en 5 segundos por paso.
Scripts y fuzzers propios están permitidos. ("No uses herramientas que hagan el trabajo por ti.")
Nada de lo que hagas con tu token es irreversible: POST /__reset lo repara.
Los tokens de tu equipo exploran en paralelo con estados separados. Es una estrategia válida.
Cada token admite 10 requests por segundo y 8.000 por día. Si te pasas, la respuesta trae el header X-Frontier-Infra: rate-limit. Esa respuesta es de la infraestructura y no del servicio. → excluirla del análisis y de la spec.
El servicio puede cambiar durante el día. Tu reemplazo se evalúa contra la versión vigente a las 20:00.
A las 20:00 los tokens de participante dejan de funcionar contra el original.
El set le habla a un solo proceso. Si tu plataforma levanta varias instancias del reemplazo, cada una tendrá su propio estado. → 1 réplica, sin autoescalado, sin dormir.
Si tu reemplazo no sabe qué responder ante algo, decide qué hace por defecto y anótalo en la especificación como supuesto.
7. Formatos obligatorios [HECHO]
7.1 Log de experimentos experimentos.jsonl

Una línea JSON por cada request al original:

json
{"id":1,"seq":"s1","x_req":1,"hipotesis":"PING responde sin estado","request":{"m":"PING;XX"},"status":200,"response":{"pong":true},"conclusion":"responde pong aunque el último campo no sea un número"}
Campo	Qué es
id	Número de línea, único. La especificación cita estos números
seq	La secuencia. Todas las líneas de una secuencia van tras un reset
x_req	El valor del header X-Req de la respuesta
hipotesis	Qué estabas probando con este request
request	El cuerpo que mandaste
status	El status que respondió el original
response	El cuerpo que respondió el original
conclusion	Qué aprendiste. Opcional

Ojo: el ejemplo del README insinúa un comportamiento real: PING;XX → {"pong":true} (PING no valida el control) — confirmar. El original devuelve un header X-Req en cada respuesta: hay que capturarlo siempre (puede ser un contador de requests que afecte el comportamiento — investigar).

7.2 Especificación

Cada comportamiento lleva ID, descripción, evidencia (los id del log que lo prueban) y confianza:

confirmado: lo probaste y se repite.
probable: lo viste una vez o lo infieres.
supuesto: no lo probaste y es lo que hace tu reemplazo por defecto.

Secciones, cada una con tabla ID | Comportamiento | Evidencia | Confianza:

Entrada: rutas, métodos, autenticación, forma del cuerpo y límites.
Integridad: cómo valida el servicio que un mensaje está bien formado.
Comandos: un bloque por comando, con sus argumentos, su efecto y su respuesta.
Memoria entre requests: qué recuerda el servicio y qué cambia una respuesta según los requests anteriores.
Errores: cada error con su status, su cuerpo exacto y en qué orden se evalúa frente a los otros errores.
Cambios durante el día: qué cambió, desde cuándo y cómo lo detectaste.
Riesgos: comportamientos que un cliente nuevo no debería heredar y cómo los cerrarías.

Una afirmación falsa resta → no subir a "confirmado" nada sin ≥2 observaciones.

8. Los 20 ejemplos oficiales (pruebas/ejemplos.jsonl) [HECHO]

Una sola secuencia (seq":"ejemplos"), tras reset, grabada con la versión de la mañana. Formato de línea: {"n":1,"id":1,"seq":"ejemplos","request":{"m":"PING;64"},"status":200,"response":{"pong":true}}.

n	request.m	status	response
1	PING;64	200	{"pong":true}
2	ALTA;Lucia;83	400	{"error":"E202","mensaje":"control inválido"}
3	ALTA;Lucia;82	201	{"cuentaId":"AC-0001"}
4	ALTA;Mateo;3	201	{"cuentaId":"AC-0002"}
5	CONSULTA;AC-0001;14	200	{"saldo":0,"cuenta_id":"AC-0001"}
6	DEPOSITO;AC-0001;250000;86	200	{"status":"recieved","operacionId":"OP-0001"}
7	TRANSFER;AC-0001;AC-0002;40000;86	200	{"status":"recieved","operacionId":"OP-0002"}
8	CONSULTA;AC-0002;11	200	{"saldo":40000,"cuenta_id":"AC-0002"}
9	TRANSFER;AC-0001;AC-0002;120000;55	422	{"error":"E506","mensaje":"límite excedido"}
10	TRANSFER;AC-0001;AC-0002;100000;12	200	{"status":"recieved","operacionId":"OP-0003"}
11	CONSULTa;AC-0001;14	200	{"saldo":110000,"cuenta_id":"AC-0001"}
12	SALDOS;AC-0001;38	400	{"error":"E301","mensaje":"comando desconocido "}
13	ANULA;OP-0003;66	200	{"ok":true,"anulada":"OP-0003"}
14	ANULA;OP-0003;66	200	{"ok":false,"motivo":"ya anulada"}
15	CONSULTA;AC-0009;87	404	{"error":"E401","mensaje":"cuenta inexistente"}
16	TRANSFER;AC-0002;AC-0001;50000;23	422	{"error":"E507","mensaje":"saldo insuficiente"}
17	DEPOSITO;AC-0002;700;5X	400	{"error":"E201","mensaje":"control mal formado"}
18	DEPOSITO;AC-0002;700;35	200	{"status":"recieved","operacionId":"OP-0004"}
19	CONSULTA;AC-0002;11	200	{"saldo":40700,"cuenta_id":"AC-0002"}
20	ALTA;Lucia;Gomez;11	400	{"error":"E302","mensaje":"aridad inválida"}
8.1 Lo que se desprende de los ejemplos [INFERENCIA — verificar]
Formato: COMANDO;args...;control. El último campo es un control numérico (1–2 dígitos vistos: 3, 14, 86).
Trampas de exactitud literal (el set compara strings idénticos):
"status":"recieved" (mal escrito, se debe copiar así).
"mensaje":"comando desconocido " con espacio final.
Nomenclatura mezclada: cuentaId (ALTA) vs cuenta_id (CONSULTA) vs operacionId.
Tildes: "control inválido", "aridad inválida", "límite excedido" → UTF-8 exacto.
Códigos/status: E201 control mal formado (400) · E202 control inválido (400) · E301 comando desconocido (400) · E302 aridad inválida (400) · E401 cuenta inexistente (404) · E506 límite excedido (422) · E507 saldo insuficiente (422). La numeración sugiere que hay más (E1xx? E203? E402? E501–E505?) → fuzzear.
Comando case-insensitive: CONSULTa funciona y con el mismo control que CONSULTA (14) → el control probablemente ignora mayúsculas/minúsculas del comando o se calcula sobre algo normalizado.
Control: algoritmo desconocido. Probé rápido (suma de bytes, suma ponderada, XOR, CRC32, Adler, MD5/SHA, hash×31, Fletcher, con/ sin comando, con/sin ;, módulos 2–300) y ninguno encaja. Experimentos sugeridos: fijar el mensaje y barrer el control 0–99 para hallar el único válido; variar un solo carácter cada vez; ver si depende del X-Req, del token, de la posición en la secuencia o de la hora. ¿Acepta 014 vs 14? ¿negativos? ¿>99?
PING no valida control (según el ejemplo del README con PING;XX).
IDs secuenciales por token: AC-0001, AC-0002… y OP-0001… con contador común para DEPOSITO y TRANSFER. Un TRANSFER rechazado (E506) no consume número de operación (el siguiente fue OP-0003). Verificar si los errores consumen IDs de cuenta. ¿Qué pasa después de AC-9999?
ALTA: crea cuenta con saldo 0. Nombres duplicados permitidos? (Lucia falló con control y luego se creó; no hay prueba de duplicado.)
Límite de transferencia: 100000 pasó, 120000 falló con E506 → ¿límite por operación = 100000? ¿límite diario acumulado? (antes ya se había transferido 40000, así que podría ser acumulado ≤ 140000 u otro). Probar.
ANULA: revierte la operación (después de anular OP-0003, AC-0002 quedó con 40000 y no pudo transferir 50000). Segunda anulación → 200 {"ok":false,"motivo":"ya anulada"} (error con status 200). Probar: ANULA de depósito, de op inexistente, de op que dejaría saldo negativo, ¿la anulación consume OP id?
Orden de evaluación de errores: ALTA;Lucia;Gomez;11 → E302 (aridad) y no E202 → aridad se revisa antes del control, o el control se calcula distinto. SALDOS;… → E301 (comando antes del control?). Hay que mapear el orden completo: cuerpo/JSON → comando → aridad → formato del control → valor del control → formato de args → existencia de cuenta → reglas de negocio.
9. Lista de experimentos a correr (cobertura mínima)

HTTP / entrada (para los 40 tests de un request y "rutas que no existen"):

GET/PUT/DELETE/PATCH/HEAD/OPTIONS sobre /msg, /__reset, /health, /, ruta inexistente, /msg/, /MSG.
Sin Authorization, Bearer vacío, token inválido, sin la palabra Bearer, minúsculas bearer.
Cuerpo: no-JSON, JSON vacío {}, m ausente, m número/null/array, m vacío, claves extra, Content-Type distinto, cuerpo enorme (¿límite?), espacios alrededor, ; final, campos vacíos (ALTA;;82), unicode/acentos en nombres.
Capturar si la respuesta es JSON o texto plano (texto se compara carácter por carácter).

Integridad: algoritmo del control (barridos), 1 vs 2 dígitos, ceros a la izquierda, signo, decimales.

Comandos: descubrir comandos ocultos (fuzz de nombres: RETIRO, SALDO, BAJA, CIERRE, LISTA, HISTORIAL, EXTRACTO, MOVIMIENTOS, BLOQUEO, AYUDA, HELP, VERSION, ECHO, RESET…), y para cada comando: aridad, tipos, montos (0, negativo, decimal, enorme, con ceros a la izquierda, no numérico), cuentas propias/inexistentes, transferencia a sí mismo.

Memoria/estado: contadores, límites acumulados, saldo tras anulaciones, si ALTA fallida consume ID, si el comportamiento depende del número de request (X-Req) o del tiempo.

Errores: tabla completa código → status → cuerpo exacto → precedencia.

Presupuesto de requests: 8.000/día por token, 10 rps. Sugerencia: ~5.000 antes de las 15:30, ~2.500 reservados para el incidente y el re-chequeo final, ~500 de margen. Throttle a ~8 rps en el cliente.

10. Arquitectura recomendada (Node 24 + TypeScript)
probe (cliente de sondeo): único camino para hablar con el original. Rate-limit 8 rps, reset al iniciar cada seq, captura status, cuerpo crudo (texto) y parseado, X-Req, y escribe siempre una línea en experimentos.jsonl con hipotesis obligatoria. Descarta/etiqueta respuestas con X-Frontier-Infra: rate-limit (y reintenta).
experiments/: scripts por hipótesis (control, errores, comandos, estado). Cada uno genera su seq.
corpus/: grabaciones del original (secuencias request→respuesta) que sirven de oráculo.
replica/ (el entrypoint): servidor HTTP de un proceso, estado en memoria Map<token, Estado> (o un solo estado para el token del equipo), pipeline explícito: auth → ruta/método → parseo de cuerpo → parseo de mensaje → validaciones en el orden medido → handler del comando → serialización con strings literales copiados. Tabla de errores declarativa (código, status, cuerpo exacto, prioridad). Sin LLM. /__reset reinicia contadores y cuentas. /health 200.
diff (arnés de evaluación local): reproduce el corpus contra la réplica (local y desplegada) y compara igual que el set oculto (status + JSON sin orden de claves / texto exacto). Reporta % por bucket imitando el set: 1 request / 2–5 / 6–12. Es la métrica principal antes de gastar una validación oficial.
canary (detección del incidente): cada ~10 min re-ejecuta un conjunto fijo de secuencias contra el original y compara con la grabación de la mañana; si hay diferencias, alerta y guarda el diff (evidencia para la sección 6 de la spec y para el criterio "Respuesta al incidente").
Despliegue: Railway / Fly.io / Render con 1 instancia, sin autoescalado, sin sleep/cold start; Dockerfile simple; token del equipo por variable de entorno. Nada de túneles ni computador local.

Alternativas descartadas (para el doc de diseño): LLM dentro de la réplica (no determinista, costo, latencia; descartado); proxy/caché al original (prohibido, set = 0); serverless (pierde estado entre invocaciones / varias instancias); base de datos persistente (innecesaria: el set resetea antes de cada test y habla a un solo proceso).

11. Plan para medir (para el doc de diseño y la ejecución)
Métrica principal: % de coincidencia exacta del arnés diff sobre corpus propio, por bucket (1 / 2–5 / 6–12), con objetivo >75% (nota 4) y meta de 90%+.
Métrica de cobertura de spec: nº de comportamientos con ≥1 cita del log; % confirmados vs probables vs supuestos.
Tests fijos: los 20 ejemplos oficiales deben pasar al 100% (ojo: grabados con la versión de la mañana; si el servicio cambia, re-grabar).
Uso de las 3 validaciones oficiales: (1) ~14:30 línea base tras tener la réplica desplegada; (2) ~18:00 tras adaptarse al incidente; (3) ~19:30 final. No gastarlas para depurar: para eso está el arnés local.
Corte: congelar código ~19:30, último chequeo canary antes de 19:50 (a las 20:00 se cortan los tokens).
12. Incidente 15:30 [INFERENCIA]

El README confirma que "el servicio puede cambiar durante el día" y que los ejemplos son "de la versión de la mañana". Posibles cambios: algoritmo del control, mensajes/códigos de error, límites, un comando nuevo, formato de IDs o de respuestas, precedencia de errores. Respuesta: el canary detecta, se re-graba el corpus afectado, se actualiza la tabla de reglas, se documenta en spec §6 con IDs de log antes/después.

13. Pendientes que el material NO aclara
Algoritmo del control.
Si el comportamiento depende de X-Req, del tiempo o del token.
Qué responde el original sin token / con token inválido / en rutas inexistentes (hay que medirlo).
Lista completa de comandos y errores.
Aclaraciones del staff: "Aún no hay aclaraciones" a las 10:20. Revisar la pestaña ACLARACIONES y los anuncios (también llegan por WhatsApp) durante el día.