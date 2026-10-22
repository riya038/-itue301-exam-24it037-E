import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import FleetPage from './pages/FleetPage';
import MyBookingsPage from './pages/MyBookingsPage';

// Lazy loading AdminPanel using React.lazy as mandated by Task 2
const AdminPanel = React.lazy(() => import('./pages/AdminPanel'));

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <main>
          <Suspense fallback={
            <div className="loading-box">
              <div className="spinner"></div>
              <p>Loading module with React.lazy + Suspense...</p>
            </div>
          }>
            <Routes>
              {/* Public Route: LoginPage at / */}
              <Route path="/" element={<LoginPage />} />

              {/* Protected Route: FleetPage at /fleet */}
              <Route
                path="/fleet"
                element={
                  <ProtectedRoute>
                    <FleetPage />
                  </ProtectedRoute>
                }
              />

              {/* Protected Route: MyBookingsPage at /my-bookings */}
              <Route
                path="/my-bookings"
                element={
                  <ProtectedRoute>
                    <MyBookingsPage />
                  </ProtectedRoute>
                }
              />

              {/* Lazy-Loaded Route: AdminPanel at /admin */}
              <Route
                path="/admin"
                element={<AdminPanel />}
              />

              {/* Fallback redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
}
