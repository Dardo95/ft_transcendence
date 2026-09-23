# ---- Build ----
FROM node:20-alpine AS builder

RUN apk add --no-cache openssl

WORKDIR /app

RUN npm install -g pnpm@12.5.1

COPY package*.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN npx prisma generate
RUN pnpm run build

# ---- Production dependencies ----
FROM node:20-alpine AS production-dependencies

RUN apk add --no-cache openssl

WORKDIR /app

RUN npm install -g pnpm@12.5.1

COPY package*.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY prisma ./prisma
RUN pnpm install --prod --frozen-lockfile && npx prisma generate

# ---- Production ----
FROM node:20-alpine

RUN apk add --no-cache curl openssl

ENV NODE_ENV=production

WORKDIR /app

COPY --chown=node:node --from=builder /app/dist ./dist
COPY --chown=node:node --from=production-dependencies /app/node_modules ./node_modules
COPY --chown=node:node --from=builder /app/package*.json ./
COPY --chown=node:node --from=builder /app/prisma ./prisma

USER node

EXPOSE 3000

CMD ["sh", "-c", "./node_modules/.bin/prisma db push --skip-generate && exec node dist/main.js"]
