# ft_transcendence Decision Matrix & Project Setup Template

---

## 1. Team Governance & Roles (4 Members)

_Every member is a Developer; assign the 3 mandatory organizational roles across the 4 members._

| Role                               | Assigned Member (Login) | Core Responsibilities                                        |
| :--------------------------------- | :---------------------- | :----------------------------------------------------------- |
| **Product Owner (PO)**             | `login_1`               | Backlog priorities, scope validation, subject alignment      |
| **Project Manager / Scrum Master** | `login_2`               | Daily coordination, tracking blockers, GitHub project boards |
| **Technical Lead / Architect**     | `login_3`               | Architecture design, technical stack, PR reviews             |
| **Full Stack Developer**           | `login_4`               | Implementation, testing, feature documentation               |

- **Product Owner (PO):** Defines the product vision, prioritizes features, and ensures the project meets user needs.
  - Maintains the product backlog.
  - Makes decisions on features and priorities.
  - Validates completed work.
  - Communicates with stakeholders (evaluators, peers).

- **Project Manager (PM) / Scrum Master:** Facilitates team coordination and removes obstacles.
  - Organizes team meetings and planning sessions.
  - Tracks progress and deadlines.
  - Ensures team communication.
  - Manages risks and blockers.

- **Technical Lead / Architect:** Oversees technical decisions and architecture.
  - Defines technical architecture.
  - Makes technology stack decisions.
  - Ensures code quality and best practices.
  - Reviews critical code changes.

- **Developers (all team members):** Implement features and modules.
  - Write code for assigned features.
  - Participate in code reviews.
  - Test their implementations.
  - Document their work.

### Communication & Collaboration Tools

- **Communication Platform:** Discord / Slack
- **Task Tracking:** GitHub Projects / Trello / Notion
- **Meeting Cadence:** Daily coordination (15 min) + Bi-weekly sprint review

---

## 2. Module & Point Target Selection (Minimum: 14 Points)

### Core Modules for Bomberman (Foundation: 8 Points)

_These modules are strictly essential to build the game loop, render the grid, authenticate users, and manage real-time game state._

| Module Choice                             | Category  | Type  | Points    | Assignee  |
| :---------------------------------------- | :-------- | :---- | :-------- | :-------- |
| **Framework for Frontend and Backend**    | Web       | Major | 2 pts     | `[login]` |
| **Real-time WebSockets**                  | Web       | Major | 2 pts     | `[login]` |
| **Multiplayer (3+ Players)**              | Gaming    | Major | 2 pts     | `[login]` |
| **Standard User Management & Local Auth** | User Mgmt | Major | 2 pts     | `[login]` |
| **Subtotal (Core)**                       |           |       | **8 pts** |           |

- **Framework for Frontend and Backend (Major, 2 pts):** A structured framework (e.g., React/Vue on the frontend, NestJS/Fastify/Django on the backend) provides the necessary component lifecycle, routing, and scalable backend architecture to manage state and API endpoints cleanly.
- **Real-time WebSockets (Major, 2 pts):** Bomberman requires low-latency, real-time communication. Inputs (moving, placing bombs), ticks, bomb timer countdowns, and explosion grid events must be broadcast instantly across all connected clients.
- **Multiplayer 3+ Players (Major, 2 pts):** Classic Bomberman is inherently a 4-player game arena. This module naturally fits the design requirement to synchronize 3 or more players in a single match session.
- **Standard User Management & Local Auth (Major, 2 pts):** Project constraints require secure authentication, user registration, encrypted passwords, profiles, and avatar handling. This satisfies the mandatory baseline for tracking individual players in lobbies and matches.

### Complementary Modules to Reach Mandatory (Minimum: 14 Points)

_Implementing these alongside the core modules reaches 15 points, cleanly passing the mandatory threshold of 14 points without branching outside the core game application._

| Module Choice                                       | Category  | Type  | Points     | Assignee            |
| :-------------------------------------------------- | :-------- | :---- | :--------- | :------------------ |
| **Core Total (Brought Forward)**                    | —         | —     | **8 pts**  | —                   |
| **User Interaction (Live Chat, Profiles, Friends)** | Web       | Major | 2 pts      | `[login]`           |
| **AI Opponent (Bot for Bomberman)**                 | AI        | Major | 2 pts      | `[login]`           |
| **Use an ORM for the Database**                     | Web       | Minor | 1 pt       | `[login]`           |
| **Remote Authentication (OAuth 2.0)**               | User Mgmt | Minor | 1 pt       | `[login]`           |
| **Game Statistics & Match History Leaderboard**     | User Mgmt | Minor | 1 pt       | `[login]`           |
| **Total Mandatory Target**                          |           |       | **15 pts** | _(Target ≥ 14 pts)_ |

- **User Interaction (Major, 2 pts):** Adds friends lists, status visibility (in-game/online), and in-lobby/global chat directly alongside player profiles. It keeps the app social and satisfies prerequisites for player interactions.
- **AI Opponent (Major, 2 pts):** Bomberman maps perfectly to grid pathfinding algorithms (e.g., A\* or Breadth-First Search for dodging blast zones, kicking bombs, and pursuing players). A bot allows games to proceed even when 4 human players are unavailable.
- **Use an ORM for Database (Minor, 1 pt):** You must define a database schema with clear relations. Using an ORM (e.g., Prisma, TypeORM) simplifies schema migrations, relationships, and queries while granting a low-effort point.
- **Remote Authentication / OAuth 2.0 (Minor, 1 pt):** Allows logging in via 42 API or Google alongside standard credentials, adding security with minimal boilerplate.
- **Game Statistics & Match History (Minor, 1 pt):** Requires an active game module. Directly tracks Bomberman stats: player kills, self-destructs, bombs placed, win rates, and a competitive leaderboard.

### Bonus Target Modules (Max 5 Points)

_Only evaluated if the initial 14+ points are completely validated. These modules sit directly on top of the existing Bomberman architecture without requiring full structural refactors._

| Module Choice                                  | Category    | Type           | Points    | Assignee              |
| :--------------------------------------------- | :---------- | :------------- | :-------- | :-------------------- |
| **Tournament System**                          | Gaming      | Minor / Choice | 1 pt      | `[login]`             |
| **Game Customization / Power-ups**             | Gaming      | Minor / Choice | 1 pt      | `[login]`             |
| **Spectator Mode**                             | Gaming      | Minor / Choice | 1 pt      | `[login]`             |
| **Complete 2FA (Two-Factor Authentication)**   | User Mgmt   | Minor          | 1 pt      | `[login]`             |
| **Multi-Language Support (i18n, 3 Languages)** | A11y / i18n | Minor          | 1 pt      | `[login]`             |
| **Total Potential Bonus**                      |             |                | **5 pts** | _(Max Bonus = 5 pts)_ |

- **Tournament System (1 pt):** Brackets for Bomberman (e.g., 8-player knockout or semi-finals leading to a 4-player final match) leverage the same matchmaking flow already established.
- **Game Customization (1 pt):** Easily maps to custom lobby settings: adjusting bomb timers, explosion radiuses, movement speed, or toggling specific drop rates for power-ups (e.g., speed boots, bomb count, blast range).
- **Spectator Mode (1 pt):** Players eliminated early in a 4-player match, or users joining an in-progress lobby, can receive the WebSocket game state as read-only streams without sending control inputs.
- **Complete 2FA (1 pt):** Standard TOTP (Time-based One-Time Password via Google Authenticator) plugs into the existing user management authentication pipeline with low risk.
- **Multiple Languages / i18n (1 pt):** Bomberman has minimal textual UI (HUD, menus, lobby screens, settings). Translating these into 3 languages (e.g., English, Spanish, French) via a lightweight i18n library is straightforward.

---

### Rejected & Non-Recommended Modules

_Modules that add excessive architectural friction, are disproportionate to a game, or risk peer-evaluation instability._

- **Backend as Microservices:** Adds immense overhead with distributed networking, message brokers, and container complexity for a real-time game that benefits from low-latency monolithic in-memory state.
- **Blockchain / ICP / Smart Contracts:** Unnecessary setup, gas/testnet dependencies, high latency, and edge cases that cause points to fail during rapid offline peer evaluation.
- **ELK Stack (Elasticsearch, Logstash, Kibana):** Massive memory footprint inside Docker containers. Running the full ELK stack alongside browsers and databases can easily freeze evaluation hardware.
- **Complete Accessibility Compliance (WCAG 2.1 AA):** Full keyboard navigation and complete screen-reader support are extraordinarily difficult and tedious to adapt to an active, real-time HTML5 Canvas game.
- **RAG System / LLM Integrations:** LLMs and vector search are irrelevant to the mechanics of a real-time arena game, introducing unnecessary external API costs or local inference delays.
- **Server-Side Rendering (SSR):** Dynamic real-time Canvas rendering and WebSocket connections run strictly on the client side; SSR introduces complex hydration issues for zero gameplay benefit.

## 3. Technical Stack Decisions

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

### 1. Frontend

- **UI Framework:** React (Vite template for fast builds)
- **Styling Solution:** TailwindCSS
- **Game Canvas Renderer:** Pixi.js (Alternative: Phaser.js)
- **State Management:** Zustand or React Context (for lobby/chat state)

### 2. Backend

- **Runtime & Language:** Node.js (v20+) with TypeScript
- **Framework:** NestJS
- **Transport Layer:** WebSockets via `@nestjs/websockets` (Socket.io engine)
- **Architecture Pattern:** Monolithic server-authoritative loop (server calculates tile collisions, bomb blasts, and ticks)

### 3. Database & Data Layer

- **Database Engine:** PostgreSQL 16
- **ORM Layer:** Prisma ORM
- **Migration Workflow:** `prisma migrate dev`

### 4. Infrastructure & Security

- **Container Orchestration:** Docker Compose
- **Reverse Proxy:** Nginx (acting as SSL termination for HTTPS and WebSocket reverse proxy)
- **Authentication Flow:** JWT stored in HTTP-only, SameSite Cookies
- **Password Encryption:** Argon2id or Bcrypt

---

## 4. Bomberman Game Architecture Decisions

- **Game Engine Logic:**
  - Server-authoritative tick rate: `[e.g., 20 ticks/sec or 30 ticks/sec]`
  - Client interpolation: `[Predictive movement vs. state reconcilation]`
- **Grid Specifications:**
  - Tile dimensions: `[e.g., 15 x 13 grid]`
  - Obstacles: Fixed indestructible blocks, destructible soft blocks, dynamic power-up drops
- **Matchmaking & Room Management:**
  - Lobby mechanism: Room codes vs. automated queue
  - Min/Max players per room: 2 to 4 players

---

## 5. Mandatory Deliverables Checklist

- [ ] Repository initialized with `README.md` containing the mandatory header:  
       `*This project has been created as part of the 42 curriculum by <login1>, <login2>, <login3>, <login4>.*`
- [ ] Dedicated `/privacy-policy` and `/terms-of-service` pages implemented with real content
- [ ] Multi-user concurrent session support with conflict handling
- [ ] `.env.example` committed; actual credentials stored strictly in ignored `.env`
- [ ] Frontend and backend dual validation on all inputs
- [ ] Containerized launch via a single command (e.g., `docker compose up --build`)
- [ ] Zero runtime console errors/warnings on latest Google Chrome
