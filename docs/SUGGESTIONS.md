### Suggestion 1: "Create an API for client-server connections. Easy to do."

- **Verdict: Fully Recommended (and standard practice)**
- **Why:** Rather than littering raw `fetch()` or `axios.get()` calls with hardcoded URLs across different React components, create an API client module (e.g., `src/api/client.ts`).
- **Implementation:**
- Configure an Axios instance with `baseURL: '/api'` and `withCredentials: true` (so HTTP-only cookies are automatically sent with every request).
- Group API functions cleanly by domain: `authApi.login()`, `authApi.register()`, `usersApi.getProfile()`.
- This ensures that when backend route shapes change, you only update a single API function rather than 10 different components.

---

### Suggestion 2: "Use TypeORM if you use TypeScript (instead of Prisma)."

- **Verdict: Not Recommended (Stick with Prisma)**
- **Why:**
- **TypeScript Support:** The suggestion's premise is incorrect. Prisma was built from the ground up for TypeScript and offers _better_ compile-time type safety than TypeORM. Prisma auto-generates TypeScript types directly from your `schema.prisma` file whenever you run migrations.
- **Work Already Done:** You already have `schema.prisma` configured with multiple domain models (`User`, `Match`, `Friendship`, etc.). Rewriting those models into TypeORM entity classes with decorators (`@Entity()`, `@Column()`, `@ManyToOne()`) will cost at least 1–2 days of busywork for zero architectural gain.
- **Developer Experience:** TypeORM requires managing complex entity classes and decorator metadata that frequently produce runtime reflection issues inside Docker/TypeScript build pipelines. Prisma avoids this entirely with its generated client.

---

### Suggestion 3: "Use pnpm instead of npm for cybersecurity."

#### Security & Efficiency Breakdown

- **Is it safer? Yes, by design:**
- **Phantom Dependencies:** `npm` flattens the `node_modules` directory. If package `A` depends on package `B`, your code can import `B` directly without declaring it in `package.json`. If a vulnerable or malicious sub-dependency is installed, your app might silently use it. `pnpm` uses symlinks and a content-addressable store, strictly preventing your code from accessing packages not explicitly declared in your `package.json`.

- **Disk & Build Speed:** `pnpm` deduplicates packages across the machine and installs dependencies 2x–3x faster than `npm`, which speeds up Docker builds significantly.

#### Is it easy to migrate if you already used npm?

**Yes, it takes under 5 minutes.**

#### Step-by-Step Migration from npm to pnpm:

1. **Install pnpm globally (or via corepack):**

```bash
npm install -g pnpm
# or: corepack enable && corepack prepare pnpm@latest --activate

```

2. **Delete existing lockfiles and `node_modules` in frontend and backend:**

```bash
rm -rf node_modules package-lock.json
rm -rf frontend/node_modules frontend/package-lock.json
rm -rf backend/node_modules backend/package-lock.json

```

3. **Generate `pnpm-lock.yaml`:**
   Run inside `/frontend`:

```bash
pnpm import   # Converts package-lock.json to pnpm-lock.yaml (or simply run: pnpm install)

```

Run inside `/backend`:

```bash
pnpm install

```

4. **Update Dockerfiles:**
   Replace `npm install` and `npm run build` in your `frontend/Dockerfile` and `backend/Dockerfile`:

```dockerfile
# Install pnpm in the container stage
RUN npm install -g pnpm

# Copy dependency manifests
COPY package.json pnpm-lock.yaml ./

# Install frozen dependencies
RUN pnpm install --frozen-lockfile

# Build using pnpm
RUN pnpm run build

```

# Impact of pnpm and API Client Decisions on Phase 1 & Roadmap

---

## 1. High-Level Answer

- **Does it change your Roadmap?**
  **No.** The broader phases (Phase 1 Skeleton $\rightarrow$ Phase 2 Parallel Tracks $\rightarrow$ Phase 3 Deliverables) remain identical. You are not changing architecture or module scope.
- **Does it change Phase 1?**
  **Yes, slightly.** It modifies tasks for **Dev 1** (Dockerfiles) and **Dev 4** (Frontend API client setup), but saves time overall by replacing ad-hoc `fetch`/`axios` calls with a clean shared interface.

---

## 2. What Changes in Phase 1 Specifically

### Dev 1: Infrastructure & Dockerfiles (pnpm migration)

Instead of running `npm install`, the containers build with `pnpm`:

- Add `pnpm` installation to `frontend/Dockerfile` and `backend/Dockerfile` (`RUN npm install -g pnpm`).
- Copy `pnpm-lock.yaml` instead of `package-lock.json`.
- Run `pnpm install --frozen-lockfile`.
- _Time impact:_ ~10 minutes.

### Dev 4: Frontend Application Shell (Dedicated API Client)

Instead of making direct HTTP calls inside components, set up an API layer during Phase 1:

- Create `src/api/client.ts`: Configure an Axios/Fetch instance with `baseURL: '/api'` and `withCredentials: true`.
- Create `src/api/auth.ts`: Export `register()`, `login()`, and `getMe()`.
- Connect the Zustand `authStore` to use these functions directly.
- _Time impact:_ ~20 minutes.

---

## 3. Updated Phase 1 Task Distribution

```
                     ┌───────────────────────────────┐
                     │    UPDATED PHASE 1 TASKS      │
                     └───────────────┬───────────────┘
         ┌───────────────┬───────────┴───────────┬───────────────┐
         ▼               ▼                       ▼               ▼
     Dev 1:          Dev 2:                  Dev 3:          Dev 4:
  pnpm in Docker  Backend Modules         Prisma, Auth     Frontend API,
  & Nginx Routes    & WebSockets            & Guards      Zustand & Pixi

```

| Member    | Updated Phase 1 Responsibilities                                                          |
| --------- | ----------------------------------------------------------------------------------------- |
| **Dev 1** | 1. Update `frontend/Dockerfile` and `backend/Dockerfile` to install and run **pnpm**.<br> |

<br>2. Align reverse proxy route prefix to `/api/health`.<br>

<br>3. Verify WebSocket upgrade headers and persistent volume startup. |
| **Dev 2** | 1. Scaffold `src/modules` structure (`auth`, `users`, `health`, `events`).<br>

<br>2. Install `class-validator` / `class-transformer` via `pnpm add`.<br>

<br>3. Set up global prefix `/api` and validation pipe.<br>

<br>4. Implement `EventsGateway` with cookie validation and `ping`/`pong`. |
| **Dev 3** | 1. Update `schema.prisma` (`passwordHash`, `avatarUrl`, `updatedAt`).<br>

<br>2. Run `pnpm dlx prisma migrate dev --name init` to create the baseline migration folder.<br>

<br>3. Implement auth endpoints (`POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`).<br>

<br>4. Issue JWT inside HTTP-only, SameSite cookies and write `JwtAuthGuard`. |
| **Dev 4** | 1. Install Tailwind, Zustand, and Pixi.js via `pnpm add`.<br>

<br>2. **Create `src/api/` client** (`client.ts`, `auth.ts`) configured with `withCredentials: true`.<br>

<br>3. Connect Zustand `authStore` to the API client.<br>

<br>4. Implement `<GameViewport/>` in Pixi running at 60 FPS with proper cleanup. |

---

## 4. Phase 1 Definition of Done (Updated)

- [ ] All package management uses `pnpm` across `frontend`, `backend`, and Dockerfiles.
- [ ] Root/subfolder `package-lock.json` files removed; valid `pnpm-lock.yaml` files committed.
- [ ] Centralized `src/api/client.ts` exists on the frontend handling `/api` requests with cookie credentials.
- [ ] Stack boots via `docker compose up --build` with all 4 services healthy.
- [ ] Frontend authenticates through the API client and verifies state via `GET /api/auth/me`.
- [ ] Authenticated WebSocket connection establishes at `wss://localhost:8443/socket.io/`.
- [ ] Pixi canvas mounts at 60 FPS and cleans up on unmount without memory leaks or duplicate elements.

# Handling Outdated npm Artifacts

When switching package managers, old npm artifacts do not disappear automatically. If left behind, they introduce ghost dependencies, lockfile conflicts, and bloat Docker build contexts.

---

## 1. What Needs to Be Deleted

| File / Folder       | Why It Must Go                                                                                                                     |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `package-lock.json` | Replaced entirely by `pnpm-lock.yaml`. Keeping both creates uncertainty about which lockfile governs builds.                       |
| `node_modules/`     | npm builds a flat tree, whereas pnpm uses a symlinked, content-addressable store. Mixing the two causes runtime resolution errors. |
| `.npm/` / npm cache | Any local cache folders generated during previous installs are obsolete.                                                           |

> **Do not delete `package.json`.** Both npm and pnpm use the exact same `package.json` file for scripts, metadata, and direct dependency declarations.

---

## 2. Complete Cleanup & Migration Workflow

Run these commands from the **root of your repository**:

### Step 1: Remove Old Artifacts Across All Folders

```bash
# Remove npm lockfiles
find . -name "package-lock.json" -type f -delete

# Remove existing node_modules directories
rm -rf node_modules frontend/node_modules backend/node_modules

```

### Step 2: Install pnpm

If not already installed on your local host:

```bash
corepack enable
corepack prepare pnpm@latest --activate
# Or via global install: npm install -g pnpm

```

### Step 3: Generate Clean `pnpm-lock.yaml` Files

Install dependencies cleanly in both sub-projects:

```bash
# Frontend
cd frontend
pnpm install
cd ..

# Backend
cd backend
pnpm install
cd ..

```

---

## 3. Prevent Outdated Files from Returning

### Update `.gitignore`

Ensure your root `.gitignore` explicitly blocks old artifacts and local pnpm stores from ever being tracked by Git:

```gitignore
# Dependencies
node_modules/
.pnpm-store/

# Legacy lockfiles (prevents accidental npm usage)
package-lock.json
yarn.lock

# Build artifacts & caches
dist/
build/
.eslintcache

```

### Update Docker Ignore (`.dockerignore`)

Add a `.dockerignore` file inside both `/frontend` and `/backend` (or at root) so local development folders are never copied into container contexts during `COPY . .`:

```dockerignore
node_modules
dist
build
.git
.env
package-lock.json

```

---

## 4. Prune Docker Build Caches

Docker layers often cache previous `RUN npm install` steps. To guarantee a clean slate:

```bash
# Remove stopped containers and volumes
docker compose down -v

# Rebuild without using cached layers
docker compose build --no-cache

# Boot the new environment
docker compose up

```
