# Backend – Booking App API (SQLite Version)

This is the backend service for the Designli Booking App Challenge, built with **NestJS**, **Prisma ORM**, **SQLite**, and **Google OAuth2**. It exposes secure API endpoints for creating, listing, and deleting calendar bookings, with optional Google Calendar conflict checking.

---

## 🚀 Features

- 🔐 JWT-based Auth (Google Login)
- 📅 Booking creation with:
  - Conflict detection against system bookings
  - Conflict detection against Google Calendar (if authorized)
- 🗃️ Prisma ORM (SQLite)
- ✅ Unit tested with Jest

---

## 📦 Setup

```bash
npm install
```

---

## ⚙️ Environment Variables

Create an `.env` and set your credentials:

```env
PORT=4000
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:4000
JWT_SECRET=your-very-secret-value
DATABASE_URL="file:./dev.db"

# OAuth2 (Google)
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_CALLBACK_URL=http://localhost:4000/auth/google/callback
```

---

## 🛠️ Prisma (SQLite)

### Generate Prisma client

```bash
npx prisma generate
```

### Run migrations

```bash
npx prisma migrate dev --name init
```

This will create a local SQLite database at `./db`.

---

## 🧪 Tests

```bash
npm test
```

---

## 🧑‍💻 Dev server

```bash
npm run start:dev
```

## 📂 Project Structure

```
src/
  ├── auth/             # Google login, calendar connect
  ├── bookings/         # Booking controller/service/dto
  ├── google/           # Google Calendar API wrapper
  ├── prisma/           # PrismaService
  ├── users/            # Minimal user storage layer
```
---

## 🔁 Auth Flows

- `/auth/google` → Sign in with Google (email/profile only)
- `/auth/google-calendar` → Connect your Google Calendar for conflict checking


## 🧩 API Reference

```
POST /bookings
GET /bookings/me
DELETE /bookings/:id
GET /bookings/check?start=...&end=...
```