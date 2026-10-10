# Hackathon Frontier (Lab10) - 10 de octubre de 2026

Proyecto del hackathon, en repo publico. Separado de otros proyectos a proposito.
Contexto privado y keys: solo en archivos locales ignorados por git (CLAUDE.local.md, .env).

## Agenda (hora BOG)

| Hora | Que |
|---|---|
| 9:00 | Apertura |
| 10:10 | Se abren los dos briefs |
| 10:30 | Se bloquea la eleccion de reto |
| 12:00 | Cierra Systems design (30%) |
| 15:30 | Incidente |
| 20:00 | Cierra Ejecucion (40%) |
| 20:00-21:00 | Debrief individual (15%) |
| 21:15 | Demo day (15%) |
| 22:15 | Premiacion y cierre |

El problema lo dan ellos. Retos: (1) agente que opera un sistema sin API, por pantalla
y en lenguaje natural; (2) servicio sin documentacion: entenderlo y reemplazarlo, errores incluidos.

Rubrica: no premia describir, premia decidir en voz alta, con evidencia escrita.
Cada decision dice que alternativa descarto y por que. Nota por persona.

## Herramienta

Pi agent con OpenRouter. Presupuesto: US$50, de los cuales US$5 son reserva bloqueada
para el set de evaluaciones oculto. El costo por ejecucion del agente es una metrica de diseno.

## Seguridad (repo publico, revisado por empresas)

- Nunca versionar keys: van en .env (ignorado). Plantilla en .env.example.
- Hook pre-commit en .githooks/ bloquea commits con keys. Activar: git config core.hooksPath .githooks
- Todo el trabajo se hace hoy, en este repo.

## Convenciones

- Node >= 22.19
- Commits de una linea, estilo Conventional Commits
- No hacer push ni deploy sin que el owner lo pida
