import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token, customer } = useAuth();

  const fetchMyBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/v1/bookings/my', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setBookings(data.data);
      } else {
        throw new Error(data.message || 'Failed to fetch your bookings');
      }
    } catch (err) {
      console.error(err);
      setError('Could not load bookings from backend API.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchMyBookings();
    }
  }, [token]);

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
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">My Car Bookings</h1>
          <p className="page-subtitle">
            Authenticated customer: <strong>{customer?.name || 'Customer'}</strong> ({customer?.email})
          </p>
        </div>
        <button
          type="button"
          onClick={fetchMyBookings}
          style={{
            padding: '0.45rem 0.9rem',
            background: 'white',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '0.85rem',
            fontWeight: 600
          }}
        >
          🔄 Refresh
        </button>
      </div>

      {loading && (
        <div className="loading-box">
          <div className="spinner"></div>
          <p>Loading your reservations from GET /api/v1/bookings/my...</p>
        </div>
      )}

      {error && !loading && (
        <div className="error-banner">
          {error}
        </div>
      )}

      {!loading && !error && bookings.length === 0 && (
        <div style={{
          background: 'white',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius)',
          padding: '3rem 1.5rem',
          textAlign: 'center',
          color: 'var(--text-muted)'
        }}>
          <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>No bookings found yet.</p>
          <small>Go to the Fleet page and reserve an available vehicle!</small>
        </div>
      )}

      {!loading && !error && bookings.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {bookings.map((booking) => (
            <div
              key={booking._id}
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
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  Booking ID: {booking._id}
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0.2rem 0' }}>
                  {booking.vehicleId?.model || 'DriveEasy Vehicle'} ({booking.vehicleId?.type || 'Car'})
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#475569' }}>
                  Rental Window: <strong>{new Date(booking.pickupDate).toLocaleDateString()}</strong> to <strong>{new Date(booking.returnDate).toLocaleDateString()}</strong>
                </p>
                <small style={{ color: 'var(--text-muted)' }}>
                  Customer: {booking.customerId?.name || customer?.name}
                </small>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Cost</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary)' }}>
                    ₹{(booking.totalAmount || 0).toLocaleString()}
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
      )}
    </div>
  );
}
