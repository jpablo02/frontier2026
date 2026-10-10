1. Hechos clave por reto

Reto 1: "El agente que opera lo que no tiene API"

Brief: un agente que aprenda a usar un sistema de gestión legado "como lo haría un empleado nuevo" y que ejecute tareas en lenguaje natural "aunque nunca las haya hecho antes". Son 5 sistemas, así que el agente tiene que ser genérico.
Restricciones, textuales: "No uses herramientas ni proveedores externos que hagan esto por ti." · "Las apps se acceden igual que la de pruebas."
Contrato, textual:
POST /tasks: "Recibe la tarea en lenguaje natural y el escritorio (URL y contraseña). Responde {"task_id": "…"} en menos de 2 segundos."
GET /tasks/{task_id}: "Devuelve estado (en_curso, terminada, fallida) y resumen. Cada tarea tiene 5 minutos. Se evalúa sobre una app que tu agente no ha visto, en un escritorio limpio de evaluación."
"El formato del resumen y las reglas de evaluación están en el README de tu material." Ese README no se ve antes de elegir.
Dato que no está en el resumen corto: dice "escritorio (URL y contraseña)", no "página web". Lo más probable es un escritorio remoto tipo VNC o noVNC, es decir, píxeles sin DOM.

Reto 2: "La caja negra"

Brief: un servicio de 10 años sin código ni documentación que "recibe mensajes y responde". Hay que construir un reemplazo que "se comporte exactamente igual, incluidos sus errores."
Restricciones, textuales: "No uses herramientas que hagan el trabajo por ti. Scripts y fuzzers propios sí." · "El reemplazo no puede llamar al original ni a otro reemplazo."
Contrato, textual:
/* (URL base): "Acepta exactamente los mismos requests que el servicio original, incluidas las rutas que no existen."
POST /__reset: "Vuelve el reemplazo a su estado inicial. Lo llamamos antes de cada test. Con otro token o sin token, responde como el original." Esto confirma que el servicio tiene estado y que importa cómo maneja la autenticación.
Entregables extra que solo pide este reto: especificación del servicio y log de experimentos, "el formato de los tres está en el README de tu material" (tampoco visible todavía).

Común a ambos

Todas las llamadas llevan Authorization: Bearer <token>, GET /health debe responder 200, y el servicio debe estar "accesible desde internet desde las 20:00 hasta que termine el demo day".
Dato importante de la agenda: "El set oculto ya corrió en cada validación del día; después de las 20:00 corre una vez más sobre tu última entrega a tiempo." O sea, hay validaciones durante el día, aunque no está claro si te muestran el resultado.
Rúbrica de "Plan para medir": nota 1 = "No hay forma de medir el resultado."; nota 4 = "Casos de prueba y métricas concretas desde el diseño."
Ninguno de los dos retos tiene aclaraciones publicadas todavía.
2. Tabla comparativa
Criterio	Reto 1 (agente por pantalla)	Reto 2 (caja negra)
Qué construir	Un agente de uso de computadora: visión, acciones, verificación, sobre un escritorio remoto, con API asíncrona	Un clon HTTP con estado, que replique el comportamiento byte a byte (incluidos errores y 404)
Cómo evalúa el set oculto	Tareas en una app nunca vista. Probablemente se califica el estado final o el resumen; reglas en el README	Casi seguro reproduce requests y compara tus respuestas con las del original después de /__reset
¿Puedes medirte antes?	Parcialmente. Solo tienes la app de pruebas, no la de evaluación; tendrías que inventar tus propias apps	Sí, directamente. Haces pruebas diferenciales original vs. réplica y calculas el % de coincidencia por ruta y estado
Riesgos en 8 h	Ubicar coordenadas con modelos baratos, ventanas emergentes, no llegar a los 5 min, VNC frágil, generalizar a app desconocida	Comportamientos ocultos (máquina de estados, tiempo, aleatoriedad, headers exactos, orden de JSON), cobertura incompleta
Costo en modelos	Alto y variable: decenas de capturas por tarea. Con el modelo bueno ~$0.3–1 por tarea; los $5 de reserva quedan justos	~$0 en ejecución. La réplica es determinista; los LLM solo se usan para escribir código y analizar el log
Despliegue	Pesado: workers persistentes, Chromium o cliente VNC, cola de tareas, 5 min por tarea. VPS, Fly o Railway; no sirve serverless	Simple: un servidor Node con estado en memoria. Fly, Railway o Render (evitar arranques en frío y pérdida de estado)
Encaje con "plan para medir"	Medio: requiere tu propio banco de tareas y apps sintéticas	Excelente: tasa de conformidad, corpus de casos y log de experimentos, que además es entregable
Encaje con tu perfil	Alto en agentes con límites duros. Pero el riesgo está en la visión, no en la orquestación	Alto: integración de protocolos y conformidad con specs (lo que haces con OID4VC) + "medir antes de diagnosticar"
Incidente de las 15:30 (hipótesis)	Cambia la interfaz o la app, aparece un modal nuevo, rotan contraseñas, el escritorio va lento. Muy frágil	El original cambia de versión, aparece un endpoint o error nuevo, o el original se cae y dependes de tus grabaciones. Moderado si tienes un arnés de re-grabación
Impacto visual en demo	Alto (impresiona)	Medio (hay que contarlo bien)

¿Blockchain/Web3? No en ninguno de los dos. En el Reto 2 un log encadenado con hashes sería un truco sin valor para la rúbrica, y en el Reto 1 no tiene nada que hacer. Meterlo restaría puntos en "decisiones justificadas".

3. Recomendación: Reto 2 (La caja negra)

Las 3 razones más fuertes:

Puedes medir tu nota del 40% antes de entregar. Tienes el original como oráculo, así que tu arnés de pruebas diferenciales es casi el mismo set oculto. En el Reto 1 la evaluación es sobre una app que no verás.
Costo de ejecución ~cero y comportamiento determinista. La reserva de $5 deja de ser un riesgo. No hay varianza de modelos ni timeouts de 5 minutos, y el despliegue es trivial.
La rúbrica premia exactamente ese trabajo. Supuestos, casos difíciles y alternativas salen naturalmente de los experimentos, y el log de experimentos es la evidencia escrita. Encaja con tu forma de trabajar.

Los 2 riesgos principales:

Cobertura incompleta: estados, comportamiento que depende del tiempo o de valores aleatorios, detalles exactos de headers y cuerpos de error. Mitigación: fuzzer propio desde el minuto uno, grabar todo en un corpus y priorizar por frecuencia.
El incidente cambia el original. Mitigación: arnés que re-grabe y vuelva a calcular las diferencias en minutos, con una réplica guiada por tablas de reglas en vez de código ad hoc.
4. Qué me haría cambiar de opinión
Que el README del Reto 1 diga que las apps son web con DOM accesible vía Playwright (no un VNC de píxeles), que el resumen se califique con criterios flexibles y que haya varias apps de práctica. Ahí tu experiencia en agentes pesaría más y el demo sería más fuerte.
Que el original del Reto 2 no sea HTTP plano (protocolo binario, WebSockets), dependa mucho de criptografía o del reloj, o tenga límites de tasa que impidan sondearlo a fondo.
Que las validaciones del día no muestren resultados en el Reto 2 y sí en el Reto 1 (lo dudo).
5. Preguntas abiertas
Contenido de los dos README: formato del resumen (R1), formato de la spec y del log (R2) y reglas exactas de evaluación. Solo se ven después de elegir.
R1: ¿qué es exactamente el "escritorio": noVNC en el navegador, RDP, una app web? ¿Cuántas tareas tiene el set oculto?
R2: ¿cómo se compara, byte a byte, por status o por cuerpo? ¿Qué pasa con campos no deterministas como IDs o timestamps? ¿El estado es por token o global?
¿Las "validaciones del día" te muestran la nota parcial, y gastan de tu presupuesto disponible o de la reserva?
¿Alguien más puede consumir el estado del original al mismo tiempo (interferencia entre equipos)?

Solo leí; no toqué "Elegir reto". Navegué la pestaña a la vista de detalles del Reto 2 y cliqueé las pestañas internas (Brief/Restricciones/Aclaraciones/Entregables), que solo cambian lo que se muestra. Quedan unos 20 minutos para el cierre.