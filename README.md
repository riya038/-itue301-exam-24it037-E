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
