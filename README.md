# Aurevia Grand — Hotel Management System

A full-stack hotel booking application built with **React + Vite** (frontend) and **Node.js + Express + MongoDB** (backend).

## Features

- 🏨 Browse and search hotels
- 🛏️ View room availability and details
- 📅 Book rooms with check-in/check-out date selection
- 💰 Live total price calculation
- 📋 View and cancel your bookings
- 🔐 JWT-based authentication
- 🛡️ Role-based access (User / Admin)
- 🧑‍💼 Admin dashboard: manage hotels, rooms, and view all bookings

## Project Structure

```
hotel-management-system/
├── backend/                  # Express API
│   ├── config/db.js
│   ├── middleware/
│   │   ├── auth.js           # JWT verification
│   │   └── admin.js          # Admin-only guard
│   ├── models/
│   │   ├── Hotel.js
│   │   ├── Booking.js
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── hotelRoutes.js
│   │   └── bookingRoutes.js
│   └── server.js
└── src/                      # React frontend
    ├── Components/
    ├── context/AuthContext.jsx
    ├── pages/
    ├── utils/api.js           # Centralized API helper
    └── App.jsx
```

## Setup

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### Backend

```bash
cd backend
npm install
# Copy and edit .env
cp ../.env.example .env
npm start
```

### Frontend

```bash
npm install
# Set API URL
echo "VITE_API_URL=http://localhost:5000" > .env
npm run dev
```

## Environment Variables

**Backend** (`backend/.env`):
```
MONGO_URI=mongodb://localhost:27017/hotel-management
JWT_SECRET=your_super_secret_key_here
PORT=5000
CLIENT_URL=http://localhost:5173
```

**Frontend** (`.env`):
```
VITE_API_URL=http://localhost:5000
```

## API Endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | /api/auth/register | — | Register user |
| POST | /api/auth/login | — | Login |
| GET | /api/hotels | — | List all hotels |
| GET | /api/hotels/:id | — | Hotel details |
| POST | /api/hotels | Admin | Add hotel |
| PUT | /api/hotels/:id | Admin | Update hotel |
| DELETE | /api/hotels/:id | Admin | Delete hotel |
| POST | /api/hotels/:id/rooms | Admin | Add room |
| DELETE | /api/hotels/:id/rooms/:idx | Admin | Delete room |
| POST | /api/bookings | User | Create booking |
| GET | /api/bookings/my | User | My bookings |
| PUT | /api/bookings/:id/cancel | User | Cancel booking |
| GET | /api/bookings | Admin | All bookings |
