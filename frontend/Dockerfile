# ---- Build ----
FROM node:20-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm@12.5.1

COPY package*.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

COPY . .

ARG VITE_API_URL
ARG VITE_WS_URL
ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_WS_URL=${VITE_WS_URL}

RUN pnpm run build

# ---- Production ----
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]