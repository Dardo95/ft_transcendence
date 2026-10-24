# ---- Build ----
FROM node:20-alpine AS builder

RUN apk add --no-cache openssl python3 make g++

WORKDIR /app

RUN npm install -g pnpm@12.5.1

COPY pnpm-workspace.yaml package.json* pnpm-lock.yaml .npmrc* ./
COPY shared ./shared
COPY backend ./backend

RUN pnpm install --frozen-lockfile

WORKDIR /app/backend

RUN ./node_modules/.bin/prisma generate
RUN pnpm run build

# ---- Production dependencies ----
FROM node:20-alpine AS production-dependencies

RUN apk add --no-cache openssl python3 make g++ libstdc++

WORKDIR /app

RUN npm install -g pnpm@12.5.1

COPY pnpm-workspace.yaml package.json* pnpm-lock.yaml .npmrc* ./
COPY shared ./shared
COPY backend ./backend

RUN pnpm install --prod --no-frozen-lockfile

WORKDIR /app/backend

RUN ./node_modules/.bin/prisma generate
# ---- Production ----
FROM node:20-alpine

RUN apk add --no-cache curl openssl libstdc++
RUN npm install -g pnpm@12.5.1

ENV NODE_ENV=production

WORKDIR /app

COPY --chown=node:node --from=production-dependencies /app/node_modules ./node_modules
COPY --chown=node:node --from=production-dependencies /app/backend/node_modules ./backend/node_modules
COPY --chown=node:node --from=builder /app/backend/dist ./backend/dist
COPY --chown=node:node --from=builder /app/backend/package*.json ./backend/
COPY --chown=node:node --from=builder /app/backend/prisma ./backend/prisma

WORKDIR /app/backend

USER node

EXPOSE 3000

CMD ["sh", "-c", "./node_modules/.bin/prisma db push --skip-generate && exec node dist/main.js"]
