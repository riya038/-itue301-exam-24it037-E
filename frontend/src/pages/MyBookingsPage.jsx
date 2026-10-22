import React, { useState } from 'react';

export default function MyBookingsPage() {
  const [bookings] = useState([
    {
      id: 'BK-1001',
      vehicle: 'Honda City ZX (Sedan)',
      pickupDate: '2026-09-01',
      returnDate: '2026-09-05',
      totalCost: 10000,
      status: 'completed',
    },
    {
      id: 'BK-1002',
      vehicle: 'Hyundai i20 Asta (Hatchback)',
      pickupDate: '2026-09-10',
      returnDate: '2026-09-12',
      totalCost: 3600,
      status: 'ongoing',
    },
    {
      id: 'BK-1003',
      vehicle: 'Mahindra XUV700 (SUV)',
      pickupDate: '2026-10-01',
      returnDate: '2026-10-04',
      totalCost: 12600,
      status: 'reserved',
    },
  ]);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'reserved':
        return 'badge';
      case 'ongoing':
        return 'badge badge-available';
      case 'completed':
        return 'badge';
      case 'cancelled':
        return 'badge badge-not-available';
      default:
        return 'badge';
    }
  };

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">My Car Bookings</h1>
        <p className="page-subtitle">Track your past and active DriveEasy reservations</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {bookings.map((booking) => (
          <div
            key={booking.id}
            style={{
              background: 'white',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius)',
              padding: '1.25rem 1.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: 'var(--shadow-sm)',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                Booking ID: {booking.id}
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0.2rem 0' }}>
                {booking.vehicle}
              </h3>
              <p style={{ fontSize: '0.9rem', color: '#475569' }}>
                Period: <strong>{booking.pickupDate}</strong> to <strong>{booking.returnDate}</strong>
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Cost</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)' }}>
                  ₹{booking.totalCost}
                </div>
              </div>

              <span
                className={getStatusBadgeClass(booking.status)}
                style={{
                  width: 'auto',
                  padding: '0.4rem 0.9rem',
                  textTransform: 'uppercase',
                  fontSize: '0.75rem',
                  letterSpacing: '0.05em',
                }}
              >
                {booking.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
