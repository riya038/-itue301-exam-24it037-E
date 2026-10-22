import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Navigation component using React Router NavLinks for client-side navigation
 * without full-page reloads.
 */
export default function Navbar() {
  const { customer, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <NavLink to="/" className="brand">
        <span className="brand-icon">🚗</span>
        <span>DriveEasy</span>
      </NavLink>

      <div className="nav-links">
        <NavLink
          to="/fleet"
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          Fleet
        </NavLink>

        <NavLink
          to="/my-bookings"
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          My Bookings
        </NavLink>

        <NavLink
          to="/admin"
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          Admin
        </NavLink>

        {!isAuthenticated ? (
          <NavLink
            to="/"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            Login
          </NavLink>
        ) : null}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {isAuthenticated ? (
          <>
            <div className="user-badge">
              <span>👤 {customer?.name || 'Customer'}</span>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="btn-logout"
            >
              Log Out
            </button>
          </>
        ) : (
          <NavLink
            to="/"
            style={{
              padding: '0.4rem 1rem',
              backgroundColor: 'var(--primary)',
              color: 'white',
              borderRadius: '9999px',
              textDecoration: 'none',
              fontSize: '0.85rem',
              fontWeight: 700
            }}
          >
            Sign In
          </NavLink>
        )}
      </div>
    </nav>
  );
}
