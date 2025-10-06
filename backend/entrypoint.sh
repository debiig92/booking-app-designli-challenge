#!/usr/bin/env sh
set -e

DB_HOST="db"
DB_PORT="5432"
DB_USER="postgres"
DB_NAME="bookingdb"

echo "Waiting for Postgres at $DB_HOST:$DB_PORT..."
until pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" >/dev/null 2>&1; do
  sleep 2
done
echo "Postgres is ready."

echo "Applying Prisma migrations..."
npx prisma migrate dev --name init_postgres

echo "Starting NestJS on port ${PORT:-4000}..."
node dist/main.js
