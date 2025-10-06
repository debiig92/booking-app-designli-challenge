# --- Build stage ---
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY prisma ./prisma
COPY tsconfig*.json ./
COPY src ./src

# Generate Prisma client before TS build
RUN  npx prisma generate
RUN npm run build

# --- Runtime stage ---
FROM node:20-alpine
WORKDIR /app

# Needed by Prisma on Alpine and for pg_isready
RUN apk add --no-cache openssl postgresql-client

ENV NODE_ENV=production
# The app will listen on 4000
ENV PORT=4000

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY package*.json ./
COPY entrypoint.sh ./entrypoint.sh

EXPOSE 4000
RUN chmod +x /app/entrypoint.sh

CMD ["/app/entrypoint.sh"]
