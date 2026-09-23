# ft_transcendence — Organización del equipo

> Equipo: `raperez-` · `ozamora-` · `brivera` · `enogueir`
>
> Stack actual: React + Tailwind CSS · Node.js + NestJS + TypeScript · WebSockets · PostgreSQL + Prisma · Nginx · Docker

## 1. Objetivo del equipo

Construir un ft_transcendence centrado en un **Bomberman multijugador online**, con:

- Frontend responsive con React + Tailwind.
- Backend NestJS con TypeScript.
- Juego en tiempo real mediante WebSockets.
- PostgreSQL con Prisma.
- Autenticación y gestión de usuarios.
- Partidas multijugador entre máquinas distintas.
- Historial/estadísticas de partidas.
- Torneos.
- Personalización del juego.
- Nginx como punto de entrada HTTPS.
- Docker Compose para levantar todo el proyecto con un único comando.

La organización se basa en dividir el trabajo por áreas, pero **nadie queda aislado de las demás**. Todo el equipo debe poder explicar cómo funciona el proyecto y cada persona debe participar en desarrollo, pruebas y revisiones.

---

# 2. Roles del equipo

## `enogueir` — Tech Lead + Project/DevOps Lead

### Responsabilidad principal
Arquitectura, Docker, infraestructura, base de datos, Nginx, despliegue y coordinación técnica.

### Tareas

#### Infraestructura
- Mantener `docker-compose.yml`.
- Mantener `docker-compose.dev.yml`.
- Dockerfiles.
- Variables `.env` / `.env.example`.
- Red interna entre servicios.
- Volúmenes de PostgreSQL.
- Healthchecks.
- Makefile.

#### Nginx
- HTTPS.
- Reverse proxy.
- Proxy frontend.
- Proxy `/api`.
- Proxy WebSockets.
- Headers de seguridad.
- Configuración de desarrollo/producción.

#### Base de datos
- Diseñar el esquema Prisma junto con `ozamora-`.
- Crear migraciones.
- Revisar relaciones y restricciones.
- Seed de desarrollo.
- Estrategia de despliegue de migraciones.

#### Calidad técnica
- Revisar PRs importantes.
- Mantener convenciones del proyecto.
- Evitar duplicación de lógica.
- Revisar decisiones de arquitectura.

#### Gestión
- Mantener bloqueos e incidencias importantes.
- Coordinar integraciones entre áreas.
- Preparar releases/demos.

---

## `ozamora-` — Backend Lead

### Responsabilidad principal
Backend NestJS, API, autenticación, usuarios y comunicación en tiempo real.

### Tareas

#### Backend base
- Estructura modular de NestJS.
- Configuración global.
- Validación de DTOs.
- Manejo de errores.
- Guards/interceptors cuando corresponda.
- Tests backend.

#### Autenticación
- Registro.
- Login.
- Logout.
- Hash de contraseñas.
- Sesiones/JWT según la arquitectura acordada.
- Protección de endpoints.
- OAuth si se implementa.

#### Usuarios
- Perfil.
- Edición de usuario.
- Avatar.
- Estado online/offline.
- Amigos.
- Relaciones entre usuarios.

#### WebSockets
- Gateway de WebSockets.
- Conexión/desconexión.
- Autenticación del socket.
- Rooms.
- Eventos cliente → servidor.
- Eventos servidor → clientes.
- Broadcast eficiente.

#### Juego
- Integración del servidor de partidas con el sistema de WebSockets.
- Creación/unión/salida de partidas.
- Matchmaking.
- Gestión del estado de una partida desde el backend.

#### Social
- Chat básico si se implementa.
- Notificaciones relacionadas con partidas/tickets sociales si se necesitan.

---

## `brivera` — Frontend Lead + UI/UX

### Responsabilidad principal
Frontend React + Tailwind, interfaz, diseño visual y presentación del Bomberman.

### Tareas

#### Frontend base
- Arquitectura de React.
- Routing.
- Layout principal.
- Componentes reutilizables.
- Sistema visual.
- Responsive design.
- Estados de carga/error.

#### Autenticación
- Pantalla de registro.
- Login.
- Logout.
- Gestión de sesión.
- Formularios y validaciones frontend.

#### Usuarios
- Perfil.
- Edición de perfil.
- Avatar.
- Lista de amigos.
- Estado online.
- Historial/estadísticas.

#### Juego
- Pantalla de partida.
- Renderizado del tablero.
- Renderizado de jugadores.
- Bombas.
- Explosiones.
- Power-ups.
- HUD.
- Pantalla de resultado.
- Lobby / búsqueda / unión a partida.

#### Assets
Responsable de coordinar los assets junto con `raperez-`:

- Tiles del mapa.
- Personajes.
- Animaciones.
- Bombas.
- Explosiones.
- Power-ups.
- UI del juego.
- Iconos.
- Menús.
- Estados de victoria/derrota.
- Sonidos y música si se incluyen.

Los assets deben estar listos suficientemente pronto para no bloquear la integración del juego.

#### Accesibilidad / UX
- Navegación por teclado donde corresponda.
- Contraste y legibilidad.
- Feedback visual.
- Estados de error.
- Responsive.

---

## `raperez-` — Game & Integration Lead + Product Owner

### Responsabilidad principal
Diseño del juego, lógica de gameplay, integración entre frontend/backend y visión funcional del producto.

### Tareas

#### Product Owner
- Mantener prioridades.
- Decidir qué entra en cada sprint.
- Mantener backlog.
- Preparar la demo.
- Comprobar que una funcionalidad realmente está terminada.

#### Game Design
Definir:
- Reglas del Bomberman.
- Tamaño del mapa.
- Tipos de casillas.
- Movimiento.
- Bombas.
- Explosiones.
- Muros.
- Power-ups.
- Daño.
- Vida/muerte.
- Victoria/derrota.
- Duración de partida.
- Inicio/final de partida.

#### Game Engine
- Modelo interno del tablero.
- Colisiones.
- Movimiento.
- Bombas.
- Explosiones.
- Cadena de explosiones.
- Destrucción de bloques.
- Power-ups.
- Respawn/reinicio cuando aplique.
- Condiciones de victoria.

#### Integración
- Contrato de mensajes entre frontend y backend.
- Sincronización del estado.
- Integración del motor del juego con WebSockets.
- Integración del frontend con la API.

#### Partidas
- Lifecycle de una partida.
- Lobby.
- Start game.
- End game.
- Rematch.
- Integración de historial.

#### Assets
- Definir qué necesita exactamente el juego.
- Revisar que los assets de `brivera` encajen con las reglas y el tamaño del tablero.
- Integrarlos dentro del juego.

#### Testing
- Casos de juego.
- Tests de integración.
- Pruebas de varias conexiones simultáneas.
- Casos de desconexión/reconexión.

---

# 3. Regla importante: trabajo cruzado

No queremos que el proyecto quede dividido en:

```text
brivera = frontend
ozamora- = backend
enogueir = docker
raperez- = "lo demás"
```

Esto sería malo para la evaluación y para el propio proyecto.

La división principal será esa, pero cada persona debe tocar otras áreas:

| Persona | Área principal | Área secundaria |
|---|---|---|
| `raperez-` | Game + integración + PO | Frontend/backend testing |
| `ozamora-` | Backend | WebSockets + DB + integración |
| `brivera` | Frontend + UI/UX | Game rendering + assets |
| `enogueir` | DevOps + DB + arquitectura | Backend + seguridad |

Cada PR importante debería tener al menos **1 reviewer distinto del autor**.

---

# 4. Arquitectura propuesta

No crear microservicios de momento.

Mantener un único backend NestJS y separarlo internamente por módulos:

```text
backend/
└── src/
    ├── auth/
    ├── users/
    ├── friends/
    ├── games/
    ├── matchmaking/
    ├── tournaments/
    ├── stats/
    ├── websocket/
    ├── prisma/
    ├── health/
    └── common/
```

Frontend:

```text
frontend/
└── src/
    ├── components/
    ├── pages/
    ├── layouts/
    ├── hooks/
    ├── services/
    ├── stores/
    ├── websocket/
    ├── game/
    ├── assets/
    ├── types/
    └── utils/
```

Documentación:

```text
docs/
├── ARCHITECTURE.md
├── API.md
├── WS_PROTOCOL.md
├── GAME_SPEC.md
├── DATABASE.md
├── SET-UP.md
├── ROADMAP.md
└── SUBJECT.md
```

---

# 5. Recomendación importante: contrato compartido

Antes de que frontend y backend empiecen a crecer por separado, definir los contratos.

Especialmente para WebSockets:

```text
CLIENT -> SERVER

join_room
ready
move
place_bomb
leave_game
rematch
```

```text
SERVER -> CLIENT

room_joined
game_start
state_update
player_joined
player_left
bomb_placed
explosion
player_died
game_over
```

Los nombres finales los decide el equipo y deben documentarse en:

```text
docs/WS_PROTOCOL.md
```

También conviene tener tipos compartidos para:

- `Player`
- `GameState`
- `Board`
- `Bomb`
- `Explosion`
- `PowerUp`
- `MatchResult`
- Eventos WebSocket.

Así se evita que frontend y backend utilicen estructuras distintas.

---

# 6. Database / Prisma

Responsables principales:

- `enogueir`
- `ozamora-`

Pero la definición del modelo debe hacerse entre todos porque afecta al proyecto entero.

Modelo inicial orientativo:

```text
User
 ├── Profile
 ├── Friends
 ├── Matches
 ├── MatchStats
 └── TournamentParticipation

Match
 ├── Players
 ├── Result
 └── MatchStats

Tournament
 ├── Participants
 ├── Matches
 └── Results
```

No empezar a crear tablas sin definir antes las relaciones.

Orden:

```text
1. schema.prisma
2. revisión del equipo
3. migration
4. seed
5. servicios NestJS
6. frontend
```

Las migraciones deben estar versionadas en Git.

---

# 7. Organización del Bomberman

## Backend

`ozamora-` + `raperez-`

Responsabilidades:

```text
GameSession
GameRoom
GameState
PlayerState
Board
Bomb
Explosion
PowerUp
MatchResult
```

El servidor debe ser la autoridad sobre el estado importante de la partida.

---

## Frontend

`brivera` + `raperez-`

Responsabilidades:

```text
GameBoard
PlayerRenderer
BombRenderer
ExplosionRenderer
PowerUpRenderer
HUD
GameResult
Lobby
```

El navegador no debe decidir por sí mismo si una bomba mata a un jugador o cuándo termina la partida. El backend debe validar las acciones importantes.

---

# 8. Assets del juego

Crear una estructura clara desde el principio:

```text
frontend/public/assets/game/
├── players/
├── tiles/
├── bombs/
├── explosions/
├── powerups/
├── ui/
├── backgrounds/
├── audio/
└── fonts/
```

Convenciones:

```text
player_red_idle.png
player_red_walk.png
player_blue_idle.png
bomb_idle.png
explosion_center.png
explosion_horizontal.png
wall_breakable.png
wall_solid.png
powerup_bomb.png
powerup_range.png
```

Antes de hacer una gran cantidad de arte, definir:

- Resolución por tile.
- Tamaño del jugador.
- Número de frames de animación.
- Estilo visual.
- Paleta.
- Formato.
- Convención de nombres.

`brivera` coordina el apartado visual y `raperez-` valida que los assets sirven para el motor del juego.

---

# 9. Nginx

Nginx debe ser el punto de entrada público:

```text
Browser
   |
 HTTPS :8443
   |
 Nginx
   ├── frontend
   ├── /api ---> backend
   └── /ws ----> backend WebSocket
```

No hacer que el frontend se conecte directamente al puerto público del backend en producción.

Para WebSockets hay que configurar explícitamente:

```nginx
proxy_http_version 1.1;
proxy_set_header Upgrade $http_upgrade;
proxy_set_header Connection "upgrade";
```

La ruta concreta (`/ws`, `/socket.io`, etc.) debe decidirse antes de implementar el cliente.

---

# 10. Correcciones del estado actual

## 10.1 Puerto del backend

Actualmente el Compose publica:

```yaml
ports:
  - "5555:5555"
```

pero el healthcheck comprueba:

```yaml
http://localhost:3000/api/health
```

Hay que decidir una única estrategia.

Recomendación:

### Desarrollo

```yaml
ports:
  - "5555:3000"
```

### Producción

No publicar directamente el backend al host y hacer que Nginx sea el punto de entrada.

---

## 10.2 Prisma

Ahora mismo tenemos:

```text
schema.prisma
```

pero todavía no hay migraciones.

Primer objetivo del backend:

```text
schema inicial
      ↓
migration
      ↓
seed
      ↓
PrismaService
      ↓
usuarios/auth
```

---

## 10.3 `node_modules`

El árbol actual contiene `node_modules`.

No debe formar parte del repositorio.

Añadir/revisar:

```gitignore
node_modules/
.env
certs/*.pem
certs/*.key
dist/
coverage/
```

Y comprobar que solamente están versionados los ficheros necesarios.

---

# 11. Plan de trabajo por fases

## Fase 0 — Arquitectura y contratos

### Todos

- Cerrar arquitectura.
- Decidir estructura de módulos.
- Decidir esquema inicial de DB.
- Definir mensajes WebSocket.
- Definir reglas del Bomberman.
- Elegir módulos objetivo.
- Definir backlog.
- Definir naming conventions.

### Entregable

```text
docs/ARCHITECTURE.md
docs/DATABASE.md
docs/WS_PROTOCOL.md
docs/GAME_SPEC.md
```

---

# Fase 1 — Foundation

## `enogueir`

- Docker Compose estable.
- Nginx HTTPS.
- Healthchecks.
- Makefile.
- Variables de entorno.
- PostgreSQL.
- Prisma migrations.
- Seed.
- Entorno de desarrollo.

## `ozamora-`

- NestJS modular.
- PrismaService.
- Auth base.
- Validación DTO.
- `/api/health`.
- Estructura de usuarios.

## `brivera`

- React routing.
- Layout.
- Component library inicial.
- Tailwind.
- Login/register.
- Error/loading states.

## `raperez-`

- Game specification.
- Modelo del tablero.
- Reglas del juego.
- Diseño del lifecycle de una partida.
- Primer prototipo del Game Engine.

---

# Fase 2 — User Management

## Backend — `ozamora-`

- Register.
- Login.
- Password hashing.
- Session/JWT.
- Profile.
- Avatar.
- Friends.
- Online status.

## Frontend — `brivera`

- Login.
- Register.
- Profile.
- Friends.
- Online indicator.
- Protected routes.

## DB — `enogueir`

- Migraciones relacionadas.
- Seeds.
- Constraints.
- Índices.

## Integración — `raperez-`

- End-to-end auth flow.
- Casos de error.
- Tests.
- Revisión funcional.

---

# Fase 3 — WebSocket foundation

## `ozamora-`

Implementar:

```text
connect
authenticate
disconnect
room
broadcast
```

## `raperez-`

Definir protocolo:

```text
event name
payload
validation
server response
error response
```

## `brivera`

Implementar cliente WebSocket:

```text
connect()
disconnect()
reconnect()
send()
on()
```

## `enogueir`

Probar:

- HTTPS.
- Nginx.
- Upgrade de WebSocket.
- Varios clientes simultáneos.
- Timeouts.
- Healthchecks.

---

# Fase 4 — Bomberman MVP

Esta es la fase crítica.

## `raperez-`

- Board.
- Movement.
- Collision.
- Bombs.
- Explosions.
- Blocks.
- Power-ups.
- Win/loss.
- Match lifecycle.

## `ozamora-`

- Game rooms.
- Player joining.
- Player leaving.
- Server state.
- WebSocket events.
- Synchronization.
- Disconnect handling.

## `brivera`

- Game board.
- Rendering.
- Controls.
- HUD.
- Animations.
- Menus.
- Result screen.

## `enogueir`

- Integración Docker.
- Nginx WebSockets.
- Tests de múltiples clientes.
- Logs.
- Performance básica.

### Definition of Done

No considerar el MVP terminado hasta poder:

```text
PC A ─┐
      ├──> HTTPS/Nginx ──> NestJS ──> partida
PC B ─┘
```

y ambos jugadores puedan:

```text
moverse
poner bombas
ver explosiones
recibir daño
morir
terminar partida
```

---

# Fase 5 — Multiplayer y estabilidad

- 3+ jugadores si el diseño lo permite.
- Reconnection.
- Handling de desconexiones.
- Matchmaking.
- Protección ante mensajes inválidos.
- Sincronización consistente.
- Tests de concurrencia.

Responsables:

```text
Backend: ozamora-
Game: raperez-
Frontend: brivera
Infra/testing: enogueir
```

---

# Fase 6 — Features extra

Una vez que el juego básico sea estable:

### Estadísticas

- Victorias.
- Derrotas.
- Partidas jugadas.
- Historial.
- Ranking.

### Torneos

- Registro.
- Bracket.
- Matchmaking.
- Resultados.

### Personalización

- Mapas.
- Temas.
- Power-ups.
- Configuración de partida.

No comenzar estas funcionalidades mientras el MVP del juego todavía tenga bugs estructurales.

---

# 12. Módulos objetivo provisionales

**No cerrar esta lista definitivamente hasta que el equipo la valide.**

Una combinación coherente para Bomberman sería:

| Módulo | Tipo | Puntos |
|---|---:|---:|
| Framework frontend + backend | Major | 2 |
| WebSockets / tiempo real | Major | 2 |
| ORM con Prisma | Minor | 1 |
| Standard user management | Major | 2 |
| OAuth 2.0 | Minor | 1 |
| Juego web multijugador | Major | 2 |
| Remote players | Major | 2 |
| Game statistics / match history | Minor | 1 |
| Tournament system | Minor | 1 |
| Game customization | Minor | 1 |
| **Total objetivo** | | **15** |

La idea es trabajar hacia aproximadamente 15 puntos para tener margen si alguna implementación no es validada.

Las funcionalidades que dependan del juego deben implementarse después de tener un juego funcional.

---

# 13. Git workflow

No trabajar todos directamente sobre `main`.

Propuesta:

```text
main
└── develop
    ├── feature/auth
    ├── feature/users
    ├── feature/websocket
    ├── feature/bomberman-engine
    ├── feature/bomberman-ui
    ├── feature/tournament
    ├── feature/stats
    └── infra/nginx
```

Formato de commits:

```text
feat(auth): add login endpoint
feat(game): add bomb explosion logic
feat(frontend): add game HUD
fix(ws): handle disconnected clients
fix(nginx): proxy websocket upgrade
docs(game): document bomb rules
test(game): add collision tests
refactor(users): split user service
chore(docker): update backend healthcheck
```

PRs:

```text
feature/*
   ↓
pull request
   ↓
review de otro miembro
   ↓
tests
   ↓
merge
```

No hacer merge de funcionalidades importantes sin revisión.

---

# 14. Definition of Done

Una tarea no está terminada simplemente porque "funciona en mi máquina".

Debe cumplir:

- Código funcionando.
- Tests relevantes.
- Validación de inputs.
- Manejo de errores.
- No introducir errores en consola.
- Compatible con Docker.
- Documentación actualizada cuando corresponda.
- PR revisado.
- Integración probada con las partes que dependan de él.

---

# 15. Organización semanal

## Reunión corta

Al menos 1 reunión de equipo por semana.

Cada persona responde:

```text
¿Qué hice?
¿Qué haré?
¿Qué me bloquea?
```

## Durante la semana

Usar GitHub Issues/Projects.

Estados:

```text
BACKLOG
  ↓
TODO
  ↓
IN PROGRESS
  ↓
REVIEW
  ↓
DONE
```

Labels:

```text
frontend
backend
database
game
websocket
infra
nginx
security
testing
docs
assets
```

---

# 16. Prioridad real del proyecto

Orden recomendado:

```text
1. Arquitectura
2. DB + Prisma
3. Auth
4. Frontend base
5. WebSocket protocol
6. WebSocket backend
7. Game Engine
8. Bomberman frontend
9. Multiplayer real
10. Estadísticas
11. Torneos
12. Customización
13. Seguridad/polish
14. Tests
15. README/documentación
16. Bonus
```

No hacer primero:

```text
animaciones perfectas
leaderboards complejos
analytics
microservicios
sistema de skins enorme
```

antes de tener:

```text
login
↓
backend
↓
websocket
↓
partida
↓
multiplayer
```

---

# 17. Checklist inicial — ESTA SEMANA

## `enogueir`

- [ ] Corregir estrategia de puertos backend.
- [ ] Preparar Nginx para `/api`.
- [ ] Preparar Nginx para WebSockets.
- [ ] Revisar `.env.example`.
- [ ] Revisar `.gitignore`.
- [ ] Preparar Prisma/Migrations.
- [ ] Añadir documentación de arquitectura inicial.

## `ozamora-`

- [ ] Organizar módulos NestJS.
- [ ] Crear `PrismaService`.
- [ ] Implementar `/api/health`.
- [ ] Diseñar Auth.
- [ ] Crear estructura de Users.
- [ ] Definir base del WebSocket Gateway.

## `brivera`

- [ ] Limpiar plantilla inicial de Vite.
- [ ] Crear layout.
- [ ] Configurar Tailwind.
- [ ] Crear sistema de componentes.
- [ ] Crear login/register.
- [ ] Definir estilo visual.
- [ ] Preparar estructura de assets Bomberman.

## `raperez-`

- [ ] Documentar reglas del Bomberman.
- [ ] Diseñar modelo del Game Engine.
- [ ] Implementar board.
- [ ] Implementar movement/collision.
- [ ] Definir lifecycle de una partida.
- [ ] Definir protocolo de eventos del juego.
- [ ] Coordinar los primeros assets con `brivera`.

---

# 18. Responsabilidad final por área

```text
                    TRANSCENDENCE
                         │
       ┌─────────────────┼──────────────────┐
       │                 │                  │
   FRONTEND           BACKEND           INFRA/DB
       │                 │                  │
   brivera           ozamora-           enogueir
       │                 │                  │
       └─────────────────┼──────────────────┘
                         │
                    BOMBERMAN
                         │
                     raperez-
                         │
              ┌──────────┴──────────┐
              │                     │
          Game Engine          Integration
              │                     │
              └──────────┬──────────┘
                         │
                    TODO EL EQUIPO
```

La propiedad de cada área indica quién la lidera, no quién es el único que puede tocarla.
