# Project Status

## Dev 1: Infrastructure & Reverse Proxy Gateway

### Done

- [docker-compose.yml](.`docker-compose.yml`) orchestrates four services:
  - `postgres`
  - `backend`
  - `frontend`
  - `nginx`
- PostgreSQL uses a persistent Docker volume.
- Backend waits for PostgreSQL health before starting.
- Frontend waits for the backend healthcheck.
- Nginx is configured for HTTPS on port `443`.
- Makefile generates self-signed certificates in `certs`.
- Nginx proxies:
  - `/` to the frontend
  - `/api/` to the backend
  - `/socket.io/` to the backend with WebSocket headers
- Root [.env.example](.`.env.example`) exists and is passed to PostgreSQL and the backend.

### Partially done

- The roadmap calls the database service `database`, but the actual service is called `postgres`.
- HTTPS is exposed externally on port `8443`, not directly on port `443`.
- The frontend Dockerfile builds a static production bundle. It does not proxy to a Vite development server.
- Nginx is prepared for WebSockets, but there is no WebSocket gateway in the backend yet.

### Still to do

- Decide whether to rename `postgres` to `database` or update the roadmap.
- Verify WebSocket routing from a browser once the backend gateway exists.

---

## Dev 2: Backend Architecture & WebSocket Gateway

### Done

- NestJS is scaffolded inside backend.
- Basic NestJS files exist:
  - [main.ts](.`main.ts`)
  - [app.module.ts](.`app.module.ts`)
  - [app.controller.ts](.`app.controller.ts`)
  - [app.service.ts](.`app.service.ts`)
- A basic health controller exists at:

```text
GET /api/health
```

- Backend build, lint, unit test, and e2e test scripts are configured.

### Partially done

- NestJS uses the standard `src` directory, but the planned `src/modules` structure does not exist yet.
- The backend currently returns the default NestJS `"Hello World!"` response.

### Still to do

- Add the `src/modules` structure.
- Install and configure:

```text
class-validator
class-transformer
```

- Add global validation pipes.
- Create an authenticated `EventsGateway`.
- Implement:
  - `handleConnection`
  - `handleDisconnect`
  - session-cookie validation
  - `ping` / `pong`
- Verify WebSocket communication through Nginx.

---

## Dev 3: Database Models & Authentication

### Done

- Prisma is installed and configured.
- PostgreSQL is configured as the Prisma datasource.
- [schema.prisma](.`schema.prisma`) contains several domain models:
  - `User`
  - `Match`
  - `MatchPlayer`
  - `Friendship`
  - `Tournament`
  - `TournamentMatch`
  - `Achievement`
  - `UserAchievement`
  - `ChatMessage`
- Prisma generation is included in the backend Dockerfile.

### Partially done

The `User` model exists, but it does not exactly match the roadmap:

| Required field | Current state                        |
| -------------- | ------------------------------------ |
| `id`           | Done                                 |
| `username`     | Done                                 |
| `email`        | Done                                 |
| `passwordHash` | Missing; current field is `password` |
| `avatarUrl`    | Missing                              |
| `createdAt`    | Done                                 |
| `updatedAt`    | Missing                              |

- Prisma is connected conceptually to PostgreSQL, but there is no `prisma/migrations` directory.
- The Dockerfile still needs to be switched to a migration workflow.

### Still to do

- Rename or replace `password` with `passwordHash`.
- Add `avatarUrl` and `updatedAt`.
- Create the initial Prisma migration.
- Add a Prisma service/module to NestJS.
- Install and configure authentication dependencies.
- Implement:
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `GET /api/auth/me`
- Hash passwords with Argon2id.
- Generate JWTs.
- Store JWTs in secure HTTP-only cookies.
- Configure:
  - `HttpOnly`
  - `Secure`
  - `SameSite=Lax`
- Create a `JwtAuthGuard` that reads the token from cookies.
- Add OAuth and 2FA only if they are part of the selected scope.

---

## Dev 4: Frontend Shell & Canvas Integration

### Done

- React and Vite are scaffolded inside frontend.
- TypeScript is configured.
- ESLint is configured.
- The frontend can be built with:

```bash
pnpm run build
```

- The frontend currently renders the default Vite starter screen.

### Not done

- Tailwind CSS is not installed or configured.
- Zustand is not installed.
- There is no authentication context or store.
- There is no request to `GET /api/auth/me`.
- There is no navigation bar.
- There is no connection status indicator.
- There is no user profile indicator.
- There are no application navigation buttons.
- Pixi.js is not installed.
- There is no `GameViewport` component.
- There is no canvas resize handling.
- There is no 60 FPS validation.
- There is no cleanup logic preventing duplicated Pixi instances.
- There is no WebSocket client.

The current [App.tsx](.`App.tsx`) is still mainly the Vite starter template.

---

# Overall Summary

| Area                    | Status             |
| ----------------------- | ------------------ |
| Docker services         | Complete           |
| HTTPS and Nginx         | Mostly complete    |
| API proxying            | Mostly complete    |
| NestJS scaffold         | Complete           |
| Backend modules         | Not started        |
| Validation pipes        | Not started        |
| WebSocket gateway       | Not started        |
| Prisma connection       | Partially complete |
| Database schema         | Partially complete |
| Prisma migrations       | Not started        |
| Authentication          | Not started        |
| React/Vite scaffold     | Complete           |
| Tailwind                | Not started        |
| Auth state management   | Not started        |
| Navigation layout       | Not started        |
| Pixi.js canvas          | Not started        |
| Shared TypeScript types | Not started        |

The project currently has the initial infrastructure and framework scaffolding. The main remaining Phase 1 work is authentication, validation, WebSockets, Prisma migrations, the frontend application shell, and Pixi.js integration.

# Phase 1 Definition of Done & Remaining Work Distribution

---

## 1. Phase 1 Definition of Done (The "Done-Done" Checklist)

To consider Phase 1 truly finished and allow everyone to move safely to their individual modules, the repository must pass all criteria below:

- [x] **Single-Command Boot:** A fresh clone launches the four services with `make` and all containers become healthy.
- [x] **Secure Gateway Access:** `https://localhost:8443` loads the app over HTTPS.
- [x] **Unified Health Check:** `GET https://localhost:8443/api/health` returns `{ "status": "ok" }` with HTTP 200.
- [ ] **Schema Migrations:** The database initializes via a proper migration command (`prisma migrate deploy` or `dev`), generating an initial migration folder in git instead of using destructive runtime syncs (`db push`).
- [ ] **End-to-End Authentication:** A user can register via `POST /api/auth/register`, log in via `POST /api/auth/login`, receive an HTTP-only SameSite cookie containing a signed JWT, and authenticate their state via `GET /api/auth/me`.
- [ ] **Real-Time WebSocket Handshake:** An authenticated browser client establishes a connection to `wss://localhost:8443/socket.io/`, successfully exchanges a `ping` / `pong` payload, and shows an active online status on the UI.
- [ ] **Render Engine Validation:** Navigating to the protected game view renders a Pixi.js canvas running at a steady 60 FPS that cleanly mounts, resizes with the window, and unmounts without duplicate canvas elements or memory leaks.
- [ ] **Zero Console Errors:** Zero unhandled promise rejections, missing assets, or React hydration/rendering errors in Google Chrome DevTools.

---

## 2. Work Breakdown: Phase 1 Remaining Tasks

```
                     ┌───────────────────────────────┐
                     │    REMAINING PHASE 1 TASKS    │
                     └───────────────┬───────────────┘
         ┌───────────────┬───────────┴───────────┬───────────────┐
         ▼               ▼                       ▼               ▼
     Dev 1:          Dev 2:                  Dev 3:          Dev 4:
  Infra & Nginx   Backend Modules         Prisma, Auth   Frontend Shell,
    Alignment       & WebSockets            & Guards      Pixi & Zustand

```

### Dev 1: Infrastructure & Reverse Proxy Gateway

_Goal: Remove discrepancies between Docker services, configuration, and internal network routes._

1. **WebSocket Proxy Validation:**

- Verify that Nginx correctly proxies WebSocket upgrade requests (`proxy_set_header Upgrade $http_upgrade; proxy_set_header Connection "upgrade";`) to the NestJS upstream server without premature 60-second timeouts.

### Dev 2: Backend Architecture & WebSocket Gateway

_Goal: Provide structured API modules, global input validation, and an authenticated Socket.io gateway._

1. **Modular Directory Structure:**

- Organize `backend/src` into modules:

```text
src/
├── modules/
│   ├── auth/
│   ├── users/
│   ├── health/
│   └── events/
├── prisma/
└── main.ts

```

2. **Global Input Validation:**

- Install `class-validator` and `class-transformer`.
- Register a global `ValidationPipe` in `main.ts` with `whitelist: true` and `forbidNonWhitelisted: true`.
3. **Authenticated Events Gateway:**

- Set up `@WebSocketGateway({ cors: { origin: true, credentials: true }, namespace: '/' })`.
- Implement `OnGatewayConnection` and `OnGatewayDisconnect`.
- Extract the session/auth cookie from incoming handshake headers (`client.handshake.headers.cookie`) and validate the JWT before accepting the connection.
- Add a test handler `@SubscribeMessage('ping')` that returns `{ event: 'pong', data: 'ok' }`.

### Dev 3: Database Models, Migrations & Authentication

_Goal: Finalize the core user schema, replace runtime database sync with migrations, and provide complete auth endpoints._

1. **Schema Correction:**

- Update `schema.prisma`:
- Rename `password` to `passwordHash String`.
- Add `avatarUrl String?` and `updatedAt DateTime @updatedAt`.

2. **Prisma Migrations:**

- Switch the Docker startup script from `npx prisma db push` to `npx prisma migrate deploy`.
- Run `npx prisma migrate dev --name init` locally to create the baseline `prisma/migrations/` directory and commit it to git.
- Create a reusable `PrismaService` and `PrismaModule` exported across the NestJS app.

3. **Authentication Endpoints:**

- Install `argon2`, `@nestjs/jwt`, `@nestjs/passport`, `passport-jwt`, and `cookie-parser`.
- Implement `POST /api/auth/register`: Validate inputs with DTOs, hash the password using Argon2id, and create the user.
- Implement `POST /api/auth/login`: Verify credentials, generate a signed JWT, and attach it to the response via `Set-Cookie` (`HttpOnly`, `Secure`, `SameSite=Lax`).
- Implement `GET /api/auth/me`: Protected endpoint returning user details (`id`, `username`, `email`, `avatarUrl`).

4. **Auth Guards:**

- Build a `JwtAuthGuard` that extracts the JWT directly from cookies and injects the user into `req.user`.

### Dev 4: Frontend Shell, State Store & Pixi.js Canvas

_Goal: Replace the default Vite screen with Tailwind layouts, session handling, and an active 60 FPS Pixi canvas._

1. **Styling & Foundation:**

- Install and configure `tailwindcss`, `postcss`, and `autoprefixer`. Verify utility classes work as expected.

2. **Global Auth & Socket Store (Zustand):**

- Install `zustand`, `socket.io-client`, and `axios`.
- Create an `authStore`:
- Run `fetchMe()` on page load (`GET /api/auth/me`).
- Store authentication status, user profile, and session states.

- Create a `socketStore`:
- Initialize a single Socket.io connection (`withCredentials: true`) when authenticated.
- Track connection status (`connected: boolean`).

3. **App Shell & Navigation:**

- Build a top navbar with:
- Logged-in user information (username and avatar placeholder).
- Live socket status badge (Green = Connected, Red = Disconnected).
- Register/Login modals or views.

4. **Pixi.js Viewport Component:**

- Install `pixi.js`.
- Implement `<GameViewport/>`:
- Mount the Pixi `Application` within a parent container.
- Add resize listeners using `ResizeObserver` so the canvas dynamically fits its container.
- Render a test animated sprite or moving geometric tile running inside a ticker at 60 FPS.
- Add cleanup logic (`app.destroy(true, { children: true })`) in `useEffect` cleanup to guarantee zero canvas duplication or memory leaks on re-renders.

---

## 3. Immediate Execution Plan

| Assignee  | Step 1                                         | Step 2                                  | Handoff Checkpoint                     |
| --------- | ---------------------------------------------- | --------------------------------------- | -------------------------------------- |
| **Dev 1** | Validate WebSocket proxy headers            | Verify browser WebSocket routing       | Authenticated gateway routes correctly |
| **Dev 2** | Add `src/modules` and `class-validator`        | Implement `EventsGateway` (`ping/pong`) | Sockets authenticate via cookies       |
| **Dev 3** | Fix schema & create `prisma/migrations`        | Implement `register`, `login`, and `me` | Auth cookies issue & verify properly   |
| **Dev 4** | Setup Tailwind & Zustand auth state            | Build `<GameViewport/>` with Pixi.js    | Canvas renders at 60 FPS without leaks |
