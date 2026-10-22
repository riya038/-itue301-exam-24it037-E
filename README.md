# DriveEasy Car Rental System

**Course:** ITUE301: Advanced Web Development Frameworks  
**Practical Exam:** Set E  
**Tech Stack:** React (Vite) + Express.js + MongoDB with Mongoose  

---

## 📁 Project Architecture & Folder Structure
```text
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   └── VehicleCard.jsx
│   │   ├── pages/
│   │   │   ├── FleetPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   └── MyBookingsPage.jsx
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── .env.example
├── .gitignore
├── README.md
└── SetE.docx
```

---

## 🚀 Setup & Execution Guide

### 1. Prerequisites
- **Node.js**: v18+ or v22+
- **MongoDB**: Installed and running locally on port `27017`

### 2. Frontend Setup (React)
```bash
cd frontend
npm install
npm run dev
```
The React development server runs at `http://localhost:5173/`.

### 3. Backend Setup (Express & MongoDB)
```bash
cd backend
npm install
npm start
# OR: node server.js
```
The Express backend runs at `http://localhost:5000/`.

---

## 🛠️ Tasks Overview

### Task 1: React Component Architecture
- Implemented reusable `VehicleCard` in `frontend/src/components/VehicleCard.jsx`.
- Accepts props: `model`, `type`, `pricePerDay`, `available`.
- Implemented ternary logic for rendering **"Book Now"** button when `available: true`, or **"Not Available"** badge when `available: false`.
- Created pages: `LoginPage`, `FleetPage`, and `MyBookingsPage`.
- Composition and prop-passing demonstrated in `FleetPage`.

### Task 2: React Routing and State Management
- Configured React Router (`react-router-dom`) with client-side navigation without full-page reloads.
- Configured routes:
  - `/` -> `LoginPage`
  - `/fleet` -> `FleetPage` (protected)
  - `/my-bookings` -> `MyBookingsPage` (protected)
  - `/admin` -> `AdminPanel` (lazy-loaded with `React.lazy()` and `Suspense`)
- Implemented `AuthContext` managing `{ customer, token, login, logout, isAuthenticated }`.
- Implemented `ProtectedRoute` wrapper redirecting unauthenticated users to `/`.
- Created `Navbar` with React Router `NavLink`s and dynamic authentication status.
- Implemented Booking Form in `FleetPage` using `useState` for `selectedVehicle`, `pickupDate`, and `returnDate`.
- Meaningful state utilization: real-time duration and price calculation, live active selection banner, and auto-populating vehicle when selecting a card.

### Task 3: Express REST API + Middleware
- Built complete Express backend running at `http://localhost:5000/`.
- Implemented custom `requestLogger` middleware logging `[METHOD] [PATH] [TIMESTAMP]` globally for every request.
- Implemented `authGuard` middleware validating JWT Bearer tokens and returning 401 Unauthorized for missing/invalid tokens on all protected routes.
- Implemented global `errorHandler` middleware returning structured JSON error responses.
- Implemented all 5 REST endpoints under `/api/v1/`:
  | Method | Endpoint | Access | Purpose |
  | --- | --- | --- | --- |
  | `POST` | `/api/v1/auth/login` | Public | Authenticate customer & issue JWT token |
  | `GET` | `/api/v1/vehicles` | Public | Return all fleet vehicles |
  | `POST` | `/api/v1/bookings` | Protected | Create booking & mark vehicle unavailable (201 Created) |
  | `GET` | `/api/v1/bookings/my` | Protected | Return customer's bookings with populated vehicle & customer |
  | `PATCH` | `/api/v1/bookings/:id/status` | Protected | Update booking status (`reserved`, `ongoing`, `completed`, `cancelled`) |

### Task 4: REST API Consumption in React
- Consumed `GET /api/v1/vehicles` inside `FleetPage` on component mount via `useEffect()`.
- Maintained three distinct states: `vehicles`, `loading`, and `error`.
- Displays loading spinner indicator while the request is in progress.
- Displays friendly error banner with a retry action if the request fails.
- Renders dynamic grid of `VehicleCard` components from API response (not hardcoded).
- Added client-side vehicle type filter (`All` \| `Hatchback` \| `Sedan` \| `SUV`) derived from state with `.filter()`, avoiding redundant API roundtrips.
- Connected booking form to `POST /api/v1/bookings` with Bearer token authentication.

### Task 5: MongoDB + Mongoose Schema Design and Validation
- Created Mongoose schemas with schema-level validation:
  - **Customer**: `name` (required), `email` (required, unique), `licenseNumber` (required, unique).
  - **Vehicle**: `model` (required), `type` (required, enum), `pricePerDay` (min 0), `available` (Boolean, default true).
  - **Booking**: `customerId` (ref Customer), `vehicleId` (ref Vehicle), `pickupDate` (required), `returnDate` (required), `status` (enum: `reserved`, `ongoing`, `completed`, `cancelled`, default `reserved`).
- Atomic double-booking prevention: `POST /api/v1/bookings` verifies `vehicle.available === true`, returns structured 400 error if unavailable, creates booking, and updates `vehicle.available = false`.
- Populated references: `GET /api/v1/bookings/my` populates customer (`name email`) and vehicle (`model type`).
- Connection string securely loaded via `.env` with a committed `.env.example`.
