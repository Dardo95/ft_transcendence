### Suggestion 1: "Create an API for client-server connections. Easy to do."

- **Verdict: Fully Recommended (and standard practice)**
- **Why:** Avoid scattering raw `fetch()` or Axios calls with hardcoded URLs across React components.
- **Pending implementation:** Create `src/api/client.ts` with `baseURL: '/api'` and `withCredentials: true`, then group domain functions such as `authApi.login()`, `authApi.register()`, and `usersApi.getProfile()`.

### Suggestion 2: "Use TypeORM if you use TypeScript (instead of Prisma)."

- **Verdict: Not Recommended (stick with Prisma)**
- **Why:** Prisma already provides TypeScript type safety, generated client types, and the project schema is already built around it. Replacing it with TypeORM would add migration work without an architectural benefit.

### Suggestion 3: "Use pnpm instead of npm for cybersecurity."

- **Status: Implemented.** Backend and frontend use `pnpm install --frozen-lockfile`.
- Obsolete npm lockfiles were removed and ignored.
- Docker build manifests include the pnpm workspace configuration required by pnpm 10.
- Local `.env`, certificates, dependencies, and build output are excluded from the repository.
