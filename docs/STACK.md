# Technical Stack Options

## Technical Stack Decisions

### Frontend

- **Framework:** `[React / Next.js / Vue / Svelte]`
- **Styling Engine:** `[Tailwind CSS / Bootstrap / Styled Components]` _(Mandatory requirement)_
- **Game Rendering Engine:** `[HTML5 Canvas / Pixi.js / Phaser.js / Babylon.js]`

### Backend & Real-Time

- **Backend Framework:** `[NestJS / Express / Django / Fastify]`
- **WebSocket Protocol:** `[Socket.io / ws / native WebSockets]`
- **Game Loop Architecture:** Server-authoritative game loop _(Server validates movement, bomb ticks, explosions)_

### Database & Security

- **Database:** `[PostgreSQL / MySQL]`
- **ORM:** `[Prisma / TypeORM / Drizzle / Django ORM]`
- **Authentication & Security:**
  - Passwords: `Argon2id` or `Bcrypt`
  - Session/Token: `HTTP-only SameSite Cookies (JWT / Sessions)`
  - Transport: Mandatory HTTPS across all external endpoints

### DevOps & Infrastructure

- **Container Solution:** Docker + Docker Compose _(Single command startup required)_
- **Reverse Proxy:** `[Nginx / Caddy / Traefik]` (Handles SSL termination & HTTPS routing)

## Recommended Stack

### Frontend

- **UI Framework:** React (Vite template for fast builds)
- **Styling Solution:** TailwindCSS
- **Game Canvas Renderer:** Pixi.js (Alternative: Phaser.js)
- **State Management:** Zustand or React Context (for lobby/chat state)

### Backend

- **Runtime & Language:** Node.js (v20+) with TypeScript
- **Framework:** NestJS
- **Transport Layer:** WebSockets via `@nestjs/websockets` (Socket.io engine)
- **Architecture Pattern:** Monolithic server-authoritative loop (server calculates tile collisions, bomb blasts, and ticks)

### Database & Data Layer

- **Database Engine:** PostgreSQL 16
- **ORM Layer:** Prisma ORM
- **Migration Workflow:** `prisma migrate dev`

### Infrastructure & Security

- **Container Orchestration:** Docker Compose
- **Reverse Proxy:** Nginx (acting as SSL termination for HTTPS and WebSocket reverse proxy)
- **Authentication Flow:** JWT stored in HTTP-only, SameSite Cookies
- **Password Encryption:** Argon2id or Bcrypt

---

## 1. Frontend

### Framework

- **React**
  - _Recommended:_ Massive ecosystem, intuitive state-driven UI for chat/lobbies/profiles, and standard industry practice for web apps.
  - _Why not:_ Requires a build tool (Vite) and explicit canvas/lifecycle management so React re-renders don't clash with the game loop.

- **Next.js**
  - _Recommended:_ Built-in routing, API routes, and easy fullstack scaffolding in a single codebase.
  - _Why not:_ Adds unnecessary server-side rendering (SSR) overhead, complex hydration issues with real-time canvas elements, and Docker deployment complexity for an SPA canvas game.

- **Vue**
  - _Recommended:_ Approachable learning curve, clean single-file components (`.vue`), and reactive state management out of the box.
  - _Why not:_ Smaller ecosystem for canvas/game integration wrappers compared to React, and TypeScript tooling can be slightly more fragmented.

- **Svelte**
  - _Recommended:_ Zero virtual DOM overhead, extremely fast DOM updates, and very little boilerplate.
  - _Why not:_ Smaller community, fewer battle-tested libraries for complex UI kits, and unconventional reactivity syntax that can confuse teammates.

### Styling Engine

- **Tailwind CSS**
  - _Recommended:_ Rapid utility-first styling, zero CSS file clutter, highly responsive grid/flexbox controls, and minimal final CSS bundle size.
  - _Why not:_ Can create cluttered HTML/JSX class strings if reusable UI components are not properly abstracted.

- **Bootstrap**
  - _Recommended:_ Pre-built components (modals, dropdowns, forms) ready out of the box with zero design effort.
  - _Why not:_ Heavy, opinionated, outdated look and feel, and overrides can quickly turn into messy CSS fights.

- **Styled Components**
  - _Recommended:_ Scoped CSS directly tied to React component props, keeping style logic close to component logic.
  - _Why not:_ Runtime performance cost from dynamic CSS injection, and can complicate simple layout tweaks compared to Tailwind.

### Game Rendering Engine

- **HTML5 Canvas (Raw 2D Context)**
  - _Recommended:_ Zero external dependencies; complete low-level control over the pixel grid.
  - _Why not:_ You must manually implement sprite batching, texture caching, sprite-sheet slicing, and camera transforms from scratch.

- **Pixi.js**
  - _Recommended:_ High-performance 2D WebGL renderer, lightweight, handles 60 FPS sprite batching effortlessly, and stays completely out of the way of your game logic.
  - _Why not:_ Rendering-only (no built-in physics or tilemap parsing; you have to handle tile collisions yourself).

- **Phaser.js**
  - _Recommended:_ Complete 2D game engine with built-in tilemap parsers (Tiled JSON), arcade physics, asset loaders, and sprite animations.
  - _Why not:_ Heavy bundle size; built-in physics engines can fight against a server-authoritative architecture if not disabled.

- **Babylon.js**
  - _Recommended:_ High-performance 3D engine with rich lighting, shadows, and particle systems.
  - _Why not:_ Vastly over-engineered for a classic 2D grid Bomberman game, drastically increasing asset creation and modeling workload.

---

## 2. Backend & Real-Time

### Backend Framework

- **NestJS**
  - _Recommended:_ Built-in TypeScript architecture, modular dependency injection, native WebSocket gateways, and clean separation for a 4-person team.
  - _Why not:_ Steeper learning curve due to decorators, modules, and Angular-style architecture.

- **Express**
  - _Recommended:_ Minimalist, unopinionated, fast setup, and ubiquitous documentation/tutorials.
  - _Why not:_ Lacks enforced architectural structure; code easily devolves into spaghetti in multi-person teams without strict conventions.

- **Django**
  - _Recommended:_ Built-in admin panel, integrated ORM, and rapid boilerplate generation for user models.
  - _Why not:_ Python introduces context switching from frontend TypeScript; asynchronous WebSocket handling via Django Channels is cumbersome and slower for high-frequency game ticks.

- **Fastify**
  - _Recommended:_ Extremely high throughput, low overhead, and full TypeScript support with schema-based JSON validation.
  - _Why not:_ Smaller plugin ecosystem than Express, and requires manual architecture design compared to NestJS.

### WebSocket Protocol

- **Socket.io**
  - _Recommended:_ Built-in room management (essential for game lobbies), automatic reconnections, and fallback transports with minimal setup.
  - _Why not:_ Adds minor protocol overhead compared to raw packets, and requires using the matching client-side library.

- **ws (Node.js library)**
  - _Recommended:_ Extremely fast, lightweight, and close to bare metal; perfect for high-frequency binary state broadcasting.
  - _Why not:_ You must write custom room management, client reconnection logic, heartbeat tracking, and message serialization from scratch.

- **Native WebSockets (Browser API / Standard Protocol)**
  - _Recommended:_ Standardized RFC protocol with zero external client dependencies.
  - _Why not:_ Zero built-in conveniences (no rooms, no heartbeat pings, no multiplexing); requires significant boilerplate to match Socket.io features.

### Game Loop Architecture

- **Server-Authoritative Game Loop**
  - _Recommended:_ Prevents cheating, eliminates client desyncs, and acts as the single source of truth for bomb placement, timers, and blast collisions.
  - _Why not:_ Requires client-side interpolation and input prediction to prevent movement latency from feeling sluggish for players with high ping.

---

## 3. Database & Security

### Database

- **PostgreSQL**
  - _Recommended:_ ACID-compliant relational DB, rich data types, exceptional support for complex relations (matches, users, stats), and native JSONB fields for flexible game logs.
  - _Why not:_ Requires slightly more configuration and memory in Docker than SQLite or minimal MySQL setups.

- **MySQL**
  - _Recommended:_ Widely supported relational database with simple administration and predictable performance.
  - _Why not:_ Inferior JSON support and strict typing compared to Postgres; less favored in modern Node.js/Prisma ecosystems.

### ORM

- **Prisma**
  - _Recommended:_ Clean schema declaration file, auto-generated TypeScript types, and straightforward migrations via `prisma migrate`.
  - _Why not:_ Generates a large binary engine inside Docker and can be slower on complex bulk relational queries.

- **TypeORM**
  - _Recommended:_ Class-and-decorator pattern that fits naturally inside a NestJS backend structure.
  - _Why not:_ Known maintenance issues, cumbersome migration workflows, and unintuitive edge cases with complex joins.

- **Drizzle**
  - _Recommended:_ Lightweight, zero binary overhead, extremely fast execution, and writes SQL-like queries in pure TypeScript.
  - _Why not:_ Newer ecosystem with less legacy StackOverflow troubleshooting; requires writing more query logic manually.

- **Django ORM**
  - _Recommended:_ Tightly coupled and seamless if the backend is Django; migrations are automated and robust.
  - _Why not:_ Strictly locks you into the Python/Django ecosystem.

### Authentication & Security

- **Passwords: Argon2id**
  - _Recommended:_ Current industry gold standard (winner of the Password Hashing Competition); resistant to both GPU and ASIC brute-force attacks.
  - _Why not:_ Slightly higher memory and CPU utilization per hash than legacy alternatives.

- **Passwords: Bcrypt**
  - _Recommended:_ Battle-tested, stable, supported across every platform with zero setup hassle.
  - _Why not:_ Theoretically vulnerable to specialized FPGA/ASIC hardware attacks due to low memory-hardness compared to Argon2id.

- **Session/Token: HTTP-only SameSite Cookies (JWT / Sessions)**
  - _Recommended:_ Immune to JavaScript XSS token theft, natively sent by browsers on requests, and `SameSite=Strict/Lax` prevents CSRF.
  - _Why not:_ Requires explicit CORS configuration and reverse proxy coordination so cookies transfer correctly between client and API.

- **Transport: Mandatory HTTPS across all external endpoints**
  - _Recommended:_ Encrypts all auth credentials, game payloads, and WebSocket frames (`wss://`) in transit, satisfying security baselines.
  - _Why not:_ Requires configuring local self-signed SSL/TLS certificates for local Docker/Nginx development.

---

## 4. DevOps & Infrastructure

### Container Solution

- **Docker + Docker Compose**
  - _Recommended:_ Guarantees consistent runtime environments across the whole team, isolates Postgres/Nginx/Node services, and launches the entire platform with one command.
  - _Why not:_ High memory usage on developer machines (especially on macOS/Windows via WSL2).

### Reverse Proxy

- **Nginx**
  - _Recommended:_ Battle-tested, rock-solid stability, handles SSL termination, and handles HTTP/WebSocket forwarding (`Upgrade` headers) with low memory usage.
  - _Why not:_ Configuration syntax (`nginx.conf`) is rigid and verbose, requiring manual certificate path setups.

- **Caddy**
  - _Recommended:_ Automatic HTTPS/TLS certificate generation out of the box with an extremely simple configuration file (`Caddyfile`).
  - _Why not:_ Less widely tested in evaluation environments, and automatic public Let's Encrypt certificates require domain configuration that isn't available on `localhost`.

- **Traefik**
  - _Recommended:_ Dynamic routing based on Docker container labels; perfect for microservices.
  - _Why not:_ Complete overkill and high configuration complexity for a standard monolithic web application.

# Recommended Technical Stack: Bomberman

---

## 1. Quick Summary of Recommendations

| Layer                      | Selected Technology                           | Alternative Considered                |
| -------------------------- | --------------------------------------------- | ------------------------------------- |
| **Frontend Framework**     | **React (with Vite)**                         | Next.js, Vue, Svelte                  |
| **Styling Engine**         | **Tailwind CSS**                              | Bootstrap, Styled Components          |
| **Game Rendering Engine**  | **Pixi.js**                                   | HTML5 Canvas, Phaser.js, Babylon.js   |
| **Backend Framework**      | **NestJS (TypeScript)**                       | Express, Fastify, Django              |
| **Real-time Protocol**     | **Socket.io**                                 | ws, native WebSockets                 |
| **Database**               | **PostgreSQL**                                | MySQL                                 |
| **ORM Layer**              | **Prisma**                                    | TypeORM, Drizzle                      |
| **Authentication Flow**    | **Argon2id + HTTP-only SameSite JWT Cookies** | Bcrypt, Bearer Tokens in LocalStorage |
| **Reverse Proxy & DevOps** | **Nginx + Docker Compose**                    | Caddy, Traefik                        |

---

## 2. Decision Rationale by Layer

### Frontend: React (Vite)

- **Why React:** Your application has two distinct responsibilities: standard web pages (lobbies, chat, user profiles, authentication, leaderboards) and the real-time canvas viewport. React manages complex dynamic UI states effortlessly while keeping components modular.
- **Why Vite over Next.js:** Next.js introduces Server-Side Rendering (SSR) and server hydration mechanics that provide zero utility for a real-time game. SSR adds hydration bugs when interacting with the client-side `<canvas>` and increases Docker build times. React built via Vite produces a clean, purely client-side Single Page Application (SPA).

### Styling: Tailwind CSS

- **Why Tailwind:** It requires zero external CSS files, eliminates naming conflicts, and allows rapid iteration on UI layouts (chat windows, player stat cards, and modal settings). Its utility-first classes keep your final CSS footprint minimal, easily satisfying project styling requirements without fighting library overrides like Bootstrap.

### Game Rendering: Pixi.js

- **Why Pixi.js over Canvas:** Writing raw 2D HTML5 canvas code requires you to manually write sprite batching, dirty-rectangle clearing, texture memory management, and tick interpolation. Pixi.js handles WebGL rendering and animated sprites out of the box with 60 FPS performance.
- **Why Pixi.js over Phaser:** Phaser is a heavyweight game framework with its own built-in client physics and tick loop. In a server-authoritative Bomberman game, client-side physics run the risk of desyncing from the server. Pixi.js is strictly a rendering layer, leaving total control of the grid simulation to your architecture.

### Backend: NestJS (TypeScript)

- **Why NestJS over Express/Django:**
- **Unified Language Stack:** Using TypeScript on both frontend and backend lets you share grid models, coordinates, packet types, and validation schemas.
- **Architecture for 4 People:** Express lacks structure, which often leads to messy architecture in a 4-person team. NestJS enforces modular architecture (Controllers, Services, Gateways) through Dependency Injection, making it straightforward to split work: one developer handles Auth/User modules, another builds Chat, and a third works on Game state services.
- **Native WebSocket Integration:** NestJS provides first-class `@WebSocketGateway()` decorators, eliminating the boilerplate needed to integrate Socket.io into an HTTP server.

### Real-Time: Socket.io

- **Why Socket.io over Raw `ws`:** Bomberman relies on private game matches. Socket.io features native room abstractions (`socket.join('room-xyz')`), automatic reconnections, and fallback transports. Building reliable room management and reconnection handlers on top of raw `ws` wastes development time on network plumbing rather than gameplay.

### Database & ORM: PostgreSQL + Prisma

- **Why PostgreSQL:** Bomberman player profiles, match results, friend connections, and rankings form clear relational graphs. Postgres provides strict data integrity and superior JSONB support if you choose to store match event replays as structured JSON.
- **Why Prisma:** Prisma offers the best developer experience in the TypeScript ecosystem. Schema definitions are written in a clean, human-readable file (`schema.prisma`), and the auto-generated client guarantees that your backend queries are completely type-safe.

### Security: Argon2id + HTTP-only SameSite JWT Cookies

- **Why Argon2id:** It is the current standard for password hashing, resistant to GPU/ASIC brute-force attacks, and fully compliant with project security criteria.
- **Why HTTP-only SameSite Cookies:** Storing JWT tokens in browser `localStorage` leaves them exposed to Cross-Site Scripting (XSS). HTTP-only cookies cannot be read by client JavaScript, and `SameSite=Lax` or `SameSite=Strict` blocks Cross-Site Request Forgery (CSRF).

### DevOps: Nginx + Docker Compose

- **Why Nginx:** It is the industry standard for reverse proxies. It handles SSL/TLS termination so your backend services run clean HTTP internally, while correctly proxying WebSocket connections via the `Upgrade` and `Connection` headers.
- **Why Docker Compose:** It ensures every team member runs the identical environment across local machines and fulfills the project requirement of starting the entire stack with a single command.

## Why Zustand instead of React Context?

| Criteria             | React Context                                                                                                                          | Zustand                                                                                                              |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| **Re-render Scope**  | Every component subscribed to the context re-renders whenever **any** property changes.                                                | Selective re-renders via selectors (`state => state.property`). Only components consuming the changed key re-render. |
| **Boilerplate**      | Requires `<Provider>` nesting trees in your layout root, custom hook wrappers, and reducer setups.                                     | Zero provider wrapping. Stores are created in a single file and accessed like regular hooks anywhere.                |
| **Non-React Access** | Cannot be read outside React component lifecycles (fails inside external event callbacks, raw WebSocket handlers, or Pixi.js tickers). | Direct imperative access outside React via `useStore.getState()` and `useStore.setState()`.                          |
| **Bundle Footprint** | Built-in to React (~0 KB).                                                                                                             | Micro-library (~1 KB).                                                                                               |

### The Core Problem for Bomberman

A multiplayer Bomberman game processes high-frequency state updates (e.g., `ping`/`pong` latency spikes, live chat messages, connection status changes, player readiness toggles).

If your WebSocket client updates a global React Context, **every component wrapped inside that Provider re-renders on every message**. Putting canvas elements or chat inputs inside such a Context tree causes visible UI stutters.

With Zustand:

- Your Pixi.js ticker or Socket.io listener can update state directly without being trapped inside a React render tree:

```ts
// In your socket.ts handler (outside React components):
socket.on("disconnect", () => {
  useSocketStore.getState().setConnected(false);
});
```

- Your Navbar only re-renders when connection status changes, completely ignoring chat or lobby updates:

```tsx
// Only re-renders if 'connected' toggles:
const isConnected = useSocketStore((state) => state.connected);
```
