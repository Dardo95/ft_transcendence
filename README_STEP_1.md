# ft_transcendence — Backend matchmaking, paso 1

Este paquete contiene únicamente los archivos nuevos/modificados del primer paso de implementación. Extrae su contenido en la raíz de tu repositorio para conservar las rutas.

## Archivos incluidos

- `backend/src/game/matchmaking/matchmaking.service.ts` — nuevo servicio de matchmaking.
- `backend/src/game/matchmaking/matchmaking.service.spec.ts` — pruebas unitarias del servicio.
- `backend/src/game/sessions/game-manager.service.ts` — añade `hasActiveSessionForUser()`.
- `backend/src/game/game.module.ts` — registra `MatchmakingService` e importa `LobbyModule`.

## Comportamiento implementado

- Público: cada lobby se encola como un grupo indivisible. Las colas están separadas por mapa. La búsqueda no caduca cuando solo hay una persona. Al poder formar una partida de 2 a 4 participantes empieza una cuenta atrás fija de 15 segundos. Los grupos que no caben completos se mantienen para una partida posterior.
- Privado: crea una sesión con todos los miembros de la lobby, siempre que haya entre 2 y 4.
- Práctica: crea una sesión con un único humano. `createGameSession()` añade el bot pasivo existente.
- Se impide reservar usuarios que ya estén buscando o participen en una sesión activa.
- Se puede cancelar una búsqueda pública por usuario, pero se retira el grupo completo.
- Se comprueba que la composición de una lobby no haya cambiado antes de convertir su grupo en una sesión.
- Los ajustes (`settings`) todavía no se aplican, tal como se acordó.

## Importante: alcance de este paso

El servicio todavía no está conectado al `GameGateway` ni a eventos Socket.IO. Por eso, este paso implementa y prueba la lógica de dominio, pero todavía no expone la búsqueda al frontend. La conexión con WebSockets será el siguiente paso del backend.

Tampoco se han creado registros en Prisma. El enum `GameMode` de `backend/prisma/schema.prisma` actualmente contiene `CLASSIC` y `TOURNAMENT`, mientras que `shared/src/game.ts` define `PUBLIC`, `PRIVATE` y `PRACTICE`. Resolveremos esa discrepancia al abordar la persistencia, sin introducir una migración prematura.

## Validación

Se ha comprobado la sintaxis TypeScript de los cuatro archivos. No se ha podido ejecutar Vitest ni el typecheck completo en el entorno de preparación porque el ZIP no incluye `node_modules` y no están instaladas las dependencias del workspace.

Cuando tengas las dependencias instaladas, desde `backend/` ejecuta:

```bash
pnpm exec vitest run src/game/matchmaking/matchmaking.service.spec.ts
pnpm run typecheck
```
