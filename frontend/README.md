# Frontend – Booking App

This is the frontend for the Designli Booking App Challenge. Built with **Next.js App Router**, **Tailwind CSS**, and **Google Sign-In**, it connects to a NestJS backend for booking creation and availability checking.

---

## 🚀 Features

- 🔐 Google login flow
- 📅 Book a time slot (with availability check)
- 🔁 Connect Google Calendar for conflict detection
- ✅ Client-side token management
- 📦 Tailwind CSS UI
a
---

## ⚙️ Setup

```bash
npm install
```

---

## 🧑‍💻 Run locally

```bash
npm run dev
```

→ App at `http://localhost:3000`

---

## 🌐 Environment Variables

Create `.env`:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:4000
```

This URL should match the NestJS backend.

---

## 🧠 Pages Overview

- `/` → Google login (redirect to backend)
- `/dashboard` → List bookings, create new one, delete

---

## 🧪 Notes

This app assumes:
- You already have the **backend running on port 4000**
- You already have a Google email
---

## 🧭 App Structure

```
src/
    ├─-app/
        ├──
        ├── dashboard/   # Main dashboard with booking list
        ├── auth/        # Main auth page for login logic
        ├── components/  # Needed components for Booking interface
        └── hooks        # Needed Context for state management
    ├──lib              # Api calls, types
```

## Auth0 Notes

- Using **@auth0/nextjs-auth0** with App Router. The route handler is **nodejs** runtime (not edge) to ensure cookies/sessions work reliably.
- Do not call `getAccessToken()` in client components. All browser requests go through `/api/backend/...` which attaches the token server-side.
- Login URL: `/api/auth/login?returnTo=/dashboard`.
- Callback page simply checks session and redirects, the SDK handles the OAuth callback.
