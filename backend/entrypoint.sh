#!/usr/bin/env sh
set -e

echo "Waiting for Postgres to be ready..."
# tiny wait loop (compose healthcheck should handle most of this)
sleep 2

echo "Running Prisma migrations..."
npx prisma migrate deploy

echo "Starting NestJS..."
node dist/main.js
