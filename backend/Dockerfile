# --- Build stage ---
FROM node:20-alpine AS builder
WORKDIR /app

# Install deps
COPY package*.json ./
RUN npm ci

# Prisma & source
COPY prisma ./prisma
COPY tsconfig*.json ./
COPY src ./src

# Generate Prisma client and build Nest
RUN npx prisma generate
RUN npm run build

# --- Runtime stage ---
FROM node:20-alpine
WORKDIR /app

ENV NODE_ENV=production
# copy only what's needed to run
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY package*.json ./
COPY entrypoint.sh ./entrypoint.sh

# Expose API port
ENV PORT=4000
EXPOSE 4000

# Ensure script is executable
RUN chmod +x /app/entrypoint.sh

# Start: wait for DB, run migrations, then start
CMD ["/app/entrypoint.sh"]
