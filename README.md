# 🅿️ ParkSmart - Smart Parking Lot Management System

A full-stack MERN application for digitizing parking lot management.

## 📁 Folder Structure

```
parking-system/
├── backend/
│   ├── middleware/
│   │   └── auth.js          # JWT auth + admin guard
│   ├── models/
│   │   ├── User.js
│   │   ├── ParkingSlot.js
│   │   └── Booking.js
│   ├── routes/
│   │   ├── auth.js          # POST /register, /login
│   │   ├── slots.js         # GET/POST/PUT/DELETE /slots
│   │   └── bookings.js      # POST /book, GET /my-bookings, etc.
│   ├── .env.example
│   ├── package.json
│   └── server.js
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   └── Navbar.js
    │   ├── context/
    │   │   └── AuthContext.js
    │   ├── pages/
    │   │   ├── Login.js
    │   │   ├── Register.js
    │   │   ├── Dashboard.js    # Slot grid + booking modal
    │   │   ├── MyBookings.js
    │   │   └── AdminPanel.js
    │   ├── utils/
    │   │   └── api.js          # Axios instance with JWT interceptor
    │   ├── App.js
    │   └── index.js
    └── package.json
```

## 🚀 Setup & Run

### Prerequisites
- Node.js v16+
- MongoDB running locally (or MongoDB Atlas URI)

### 1. Backend Setup

```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

npm install
npm run dev   # runs on http://localhost:5000
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm start     # runs on http://localhost:3000
```

## 🔌 API Reference

### Auth
| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login |

### Slots
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | /api/slots | User | Get all slots |
| POST | /api/slots | Admin | Add new slot |
| PUT | /api/slots/:id | Admin | Update slot |
| DELETE | /api/slots/:id | Admin | Delete slot |

### Bookings
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | /api/book | User | Create booking |
| GET | /api/book/my-bookings | User | Get my bookings |
| GET | /api/book/all | Admin | Get all bookings |
| DELETE | /api/book/:id | User/Admin | Cancel booking |

## 👤 User Roles

**User:** Register → Login → View slots → Book slot → View/cancel bookings

**Admin:** All user abilities + Add/delete/toggle slots + View all bookings + Cancel any booking

## 🛡️ Environment Variables

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/parking_system
JWT_SECRET=your_super_secret_key_here
```

## 🎨 Features

- **Slot Grid View** — Color-coded available (green) and occupied (red) slots
- **Booking Modal** — Select time range, enter vehicle number, instant confirmation
- **Double-Booking Prevention** — Time-conflict detection on the backend
- **Role-Based Access** — Admin-only routes protected by middleware
- **JWT Auth** — Tokens stored in localStorage, sent via Authorization header
- **Admin Panel** — Full slot and booking management with stats
