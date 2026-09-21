# Project Roadmap & Work Breakdown: Bomberman

---

## High-Level Project Phases Overview

```
[ Phase 0: Project Setup & Repo Baseline ]
                    │
                    ▼
[ Phase 1: Shared Core Skeleton (All 4 Work Together) ]
  • Docker + Nginx HTTPS
  • Database + Prisma Schema
  • Basic Auth (JWT / Cookies)
  • Minimal Pixi Canvas + WebSocket Echo
                    │
                    ▼
[ Phase 2: Parallel Track Execution (1 Member per Track) ]
  ├── Member 1: Game Engine & Server-Authoritative Loop
  ├── Member 2: Matchmaking, Lobbies & 4-Player Sync
  ├── Member 3: Social & User System (Chat, Profiles, Friends)
  └── Member 4: AI Opponent / Bot Implementation
                    │
                    ▼
[ Phase 3: Integration, Polish & Mandatory Deliverables ]
  • Terms of Service & Privacy Policy pages
  • Multi-user stress testing (zero console errors)
  • Single-command launch validation
  • Evaluation defense prep & README completion
                    │
                    ▼
[ Phase 4: Optional Bonus Modules (Max 5 pts) ]

```

---

## Deep Dive: Phase 1 — The Shared Core Skeleton

### Objective

Build a minimal, working end-to-end slice where any team member can clone the repository, run `docker compose up --build`, register an account, log in, view a protected canvas page, and see a basic WebSocket connection respond in real time. **Nobody starts feature work until Phase 1 is merged to `main`.**

### Work Breakdown Across the 4 Developers

```
                  ┌──────────────────────────────┐
                  │          PHASE 1             │
                  │   All 4 Working in Sync      │
                  └──────────────┬───────────────┘
         ┌───────────────┬───────┴───────┬───────────────┐
         ▼               ▼               ▼               ▼
     Dev 1:          Dev 2:          Dev 3:          Dev 4:
  Infra & Nginx   Backend Core   Database & Auth  Frontend Core

```

#### Dev 1: Infrastructure & Reverse Proxy Gateway

- **Docker Compose Setup:** Orchestrate four services: `frontend`, `backend`, `database`, and `nginx`.
- **Local HTTPS Termination:** Generate self-signed SSL/TLS certificates and configure Nginx to listen on port 443.
- **Proxy Routing Rules:**
- Forward `/` to the Vite React dev server.
- Forward `/api/*` to the NestJS API.
- Forward `/socket.io/*` with `Upgrade` and `Connection: "Upgrade"` headers for WebSockets.

- **Environment Validation:** Create a centralized root `.env.example` file that feeds environment variables down to the services.

#### Dev 2: Backend Architecture & WebSocket Gateway Skeleton

- **NestJS Initialization:** Scaffold the NestJS project inside `/backend` with standard directory conventions (`/src/modules`).
- **Global Pipelines:** Set up global validation pipes using `class-validator` and `class-transformer` for dual input validation.
- **WebSocket Gateway Base:** Create an authenticated `EventsGateway` (`@WebSocketGateway()`) with connection hooks (`handleConnection`, `handleDisconnect`) that verify the user's session cookie before accepting the socket.
- **Health & Ping Endpoint:** Implement `GET /api/health` and a simple WebSocket `ping`/`pong` event to verify real-time connectivity through Nginx.

#### Dev 3: Database Models & Authentication Engine

- **Prisma & PostgreSQL Setup:** Connect Prisma to the PostgreSQL container and establish the initial migration pipeline.
- **Base Data Schema:** Create the foundational models in `schema.prisma`:
- `User`: `id`, `username`, `email`, `passwordHash`, `avatarUrl`, `createdAt`, `updatedAt`.

- **Auth Module:** Implement registration (`POST /api/auth/register`) and login (`POST /api/auth/login`).
- Hash passwords using `Argon2id`.
- Issue signed JWTs set directly on the response via `Set-Cookie` with `HttpOnly`, `Secure`, and `SameSite=Lax`.

- **Auth Guard:** Provide a NestJS `JwtAuthGuard` that extracts the token from incoming cookies to protect routes.

#### Dev 4: Frontend Shell & Canvas Integration

- **React + Tailwind Scaffolding:** Scaffold the frontend with Vite inside `/frontend` and configure Tailwind CSS.
- **Global Auth Context / Zustand Store:** Create an authentication listener that checks `GET /api/auth/me` on application boot to detect existing sessions.
- **Base Navigation & Layout:** Build a top navbar showing connection status, user profile indicator, and navigation buttons.
- **Canvas Viewport Component:** Create a dedicated `<GameViewport/>` component wrapping a basic Pixi.js application instance. Verify that the canvas resizes correctly, runs at 60 FPS, and does not leak memory or duplicate instances on React re-renders.

### Phase 1 Definition of Done (Exit Criteria)

1. A fresh clone runs with a single command: `docker compose up --build`.
2. Accessing `https://localhost` loads without browser console errors.
3. A user can register, log in, and receive an HTTP-only auth cookie.
4. The authenticated user can open the game view, establishing a secure WebSocket connection (`wss://`) verified in the browser network tab.
5. The shared TypeScript definitions (User model, Base Socket Events) are committed to a shared directory.

---

## Phase 2: Parallel Module Implementation (4 Independent Tracks)

Once Phase 1 is verified and merged into `main`, each developer branches off onto an isolated module.

```
                    [ Phase 1 Base Merged ]
                               │
       ┌───────────────────────┼───────────────────────┬───────────────────────┐
       ▼                       ▼                       ▼                       ▼
  Track A (Dev 1)         Track B (Dev 2)         Track C (Dev 3)         Track D (Dev 4)
  Bomberman Core          Multiplayer &           User Interaction        AI Opponent
   Game Engine             Matchmaking             & Statistics              (Bot)

```

| Track                       | Primary Modules                       | Key Deliverables                                                                                                                                                    |
| --------------------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Track A: Game Logic**     | Real-time WebSockets, Core Loop       | Server-side 20-30 tick loop; tilemap generation; destructible block state; bomb drop timers; explosion blast-radius calculations; collision detection.              |
| **Track B: Multiplayer**    | Multiplayer (3+ Players), Matchmaking | Room management (`room-id`); lobby state (ready/unready); player slot allocation (1 to 4 players); disconnect handling; game start/finish triggers.                 |
| **Track C: Social & Stats** | User Interaction, Game Stats, OAuth   | In-game and global live chat; friend list with online status; public profile page; avatar uploads; match history table; wins/losses leaderboard.                    |
| **Track D: Game AI**        | AI Opponent                           | Pathfinding bot (A\* or BFS); grid danger-zone evaluation (avoiding active bombs and explosions); breakable block targeting; auto-fill empty lobby slots with bots. |

---

## Phase 3: Integration, Polish & Mandatory Deliverables

- **Lobby-to-Game Linking:** Connect the social and matchmaking systems so invites launch straight into 4-player game rooms.
- **Mandatory Pages:** Implement dedicated `/privacy-policy` and `/terms-of-service` routes linked in the footer with project-relevant text.
- **Multi-User Verification:** Open four independent browser windows (using Chrome incognito windows or different user profiles) to run a complete 4-player game simultaneously, verifying zero state desyncs or race conditions.
- **Console Cleanup:** Eliminate all JavaScript warnings, unhandled promise rejections, and CSS layout errors in Google Chrome DevTools.
- **README Documentation:** Write the root `README.md` following project instructions:
- Mandatory italicized author header.
- Team role breakdown (PO, PM, Tech Lead, Developers).
- Setup instructions and architecture documentation.
- Individual contributions log.

---

## Phase 4: Bonus Modules (Max 5 Points Target)

_Only executed after all Phase 1-3 requirements are completely tested and stable._

1. **Tournament System (1 pt):** Single-elimination 8-player bracket culminating in a 4-player Bomberman final.
2. **Game Customization (1 pt):** Lobby options for blast power, bomb counts, speed multipliers, and tick speed adjustments.
3. **Spectator Mode (1 pt):** Read-only game state stream for eliminated players or lobby visitors.
4. **Complete 2FA (1 pt):** TOTP (Google Authenticator) setup and verification added to local auth.
5. **Multi-Language Support (1 pt):** Internationalization (i18n) for the UI in English, Spanish, and French.
