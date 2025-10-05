#!/usr/bin/env sh
set -e

# Wait for DB (requires postgresql-client installed in the image)
until pg_isready -h db -p 5432 -U postgres -d bookingdb >/dev/null 2>&1; do
  sleep 2
done

echo "Applying Prisma migrations..."
npx prisma migrate deploy

echo "Starting API..."
node dist/main.js
