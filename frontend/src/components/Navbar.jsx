import React from 'react';

export default function Navbar({ activeTab, setActiveTab }) {
  return (
    <nav className="navbar">
      <div className="brand">
        <span className="brand-icon">🚗</span>
        <span>DriveEasy</span>
      </div>

      <div className="nav-links">
        <button
          type="button"
          className={`nav-link ${activeTab === 'fleet' ? 'active' : ''}`}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
          onClick={() => setActiveTab('fleet')}
        >
          Fleet
        </button>
        <button
          type="button"
          className={`nav-link ${activeTab === 'bookings' ? 'active' : ''}`}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
          onClick={() => setActiveTab('bookings')}
        >
          My Bookings
        </button>
        <button
          type="button"
          className={`nav-link ${activeTab === 'login' ? 'active' : ''}`}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
          onClick={() => setActiveTab('login')}
        >
          Login
        </button>
      </div>

      <div className="user-badge">
        <span>👤 Guest User</span>
      </div>
    </nav>
  );
}
