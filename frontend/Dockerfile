# --- Build stage ---
FROM node:20-alpine AS builder
WORKDIR /app

# 1) System deps for native modules (sharp, node-gyp, etc.)
RUN apk add --no-cache libc6-compat python3 make g++ pkgconfig

# 2) Install deps
COPY package*.json ./
RUN npm ci

# 3) Copy app and build
COPY . .
# Optional: disable telemetry noise in CI
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# --- Runtime stage ---
FROM node:20-alpine
WORKDIR /app

ENV NODE_ENV=production
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000
CMD ["npm", "run", "start"]
