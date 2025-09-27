# 🧭 Designli -- Booking App Challenge

A full-stack booking app designed with a clean and scalable
architecture. This project was built as part of a design challenge using
modern technologies: **NestJS + Prisma** on the backend and **Next.js 15** on the frontend.

------------------------------------------------------------------------

## 📦 Tech Stack

### 🖥 Backend

-   **Framework**: [NestJS](https://nestjs.com/)
-   **Database**: SQLite (via [Prisma ORM](https://www.prisma.io/))
-   **Authentication**: Google OAuth2 + JWT (Bearer Token or HttpOnly
    Cookie)
-   **Testing**: Jest

### 🌐 Frontend

-   **Framework**: [Next.js 15](https://nextjs.org/)
-   **Rendering**: App Router (React 19)
-   **State Management**: React Context API
-   **HTTP Client**: Axios
-   **Styling**: TailwindCSS

------------------------------------------------------------------------

## 🚀 Getting Started

### 📁 Prerequisites

-   Node.js ≥ 18.x
-   npm

------------------------------------------------------------------------

### 🧪 Local Setup

``` bash
# Clone the repo
git clone https://github.com/your-org/booking-app-designli-challenge.git
cd booking-app-designli-challenge
```

#### 1. Backend

``` bash
cd backend
npm install

# Generate DB + Prisma
npx prisma generate
npx prisma migrate dev --name init

# Start dev server
npm run start:dev
```

``` bash
# Run unit tests
npm run test
```

#### 2. Frontend

``` bash
cd frontend
npm install

# Start the Next.js dev server
npm run dev
```

------------------------------------------------------------------------

## ✅ Features

### Backend 

-   REST API for creating, listing, and deleting bookings
-   Google Calendar integration
-   Booking overlap validation
-   Auth via Google + JWT
-   Full DTO validation
-   Prisma data access layer

Please check Backend Readme file: `https://github.com/debiig92/booking-app-designli-challenge/blob/main/backend/README.md`

### Frontend

-   Login via Google
-   Create new booking
-   View your bookings
-   Clean and responsive UI

Please check Frontend Readme file:  `https://github.com/debiig92/booking-app-designli-challenge/blob/main/frontend/README.md`


## 📁 Project Structure

### Backend

    backend/
        src/
        ├── auth/             # Google login, calendar connect
        ├── bookings/         # Booking controller/service/dto
        ├── google/           # Google Calendar API wrapper
        ├── prisma/           # PrismaService
        ├── users/            # Minimal user storage layer

### Frontend

    frontend/
        src/
            ├─-app/
                ├──
                ├── dashboard/   # Main dashboard with booking list
                ├── auth/        # Main auth page for login logic
                ├── components/  # Needed components for Booking interface
                └── hooks        # Needed Context for state management
            ├──lib              # Api calls, types
