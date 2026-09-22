# ---- Build ----
FROM node:20-alpine AS builder

RUN apk add --no-cache openssl

WORKDIR /app

RUN npm install -g pnpm@latest

COPY package*.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN npx prisma generate
RUN pnpm run build

# ---- Production ----
FROM node:20-alpine

RUN apk add --no-cache curl openssl

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

CMD ["sh", "-c", "npx prisma db push && node dist/main.js"]