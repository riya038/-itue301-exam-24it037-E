import React from 'react';

export default function AdminPanel() {
  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">Admin Management Panel</h1>
        <p className="page-subtitle">
          Lazy-loaded administrative module for fleet managers and system administrators
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: 'var(--radius)',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>Total Fleet</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', marginTop: '0.5rem' }}>18 Cars</div>
          <div style={{ color: 'var(--success)', fontSize: '0.85rem', marginTop: '0.25rem' }}>● 12 Available</div>
        </div>

        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: 'var(--radius)',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>Active Bookings</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f59e0b', marginTop: '0.5rem' }}>6 Ongoing</div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>0 Double-Bookings Detected</div>
        </div>

        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: 'var(--radius)',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>Fleet Utilization</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.5rem' }}>84.5%</div>
          <div style={{ color: 'var(--success)', fontSize: '0.85rem', marginTop: '0.25rem' }}>+12% this month</div>
        </div>
      </div>

      <div style={{
        background: 'white',
        padding: '1.75rem',
        borderRadius: 'var(--radius)',
        border: '1px solid var(--border-color)'
      }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1rem' }}>
          DriveEasy Double-Booking Prevention Engine
        </h2>
        <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
          System status: <strong>Active</strong>. When any customer completes a reservation on an available car, the backend atomically transitions the vehicle's status to <code>available: false</code>, preventing phone-based or concurrent web collisions.
        </p>
      </div>
    </div>
  );
}
