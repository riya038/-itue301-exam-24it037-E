import React, { useState, useEffect } from 'react';
import VehicleCard from '../components/VehicleCard';
import { useAuth } from '../context/AuthContext';

export default function FleetPage() {
  // Task 4: Maintain three states: vehicles, loading, and error
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Client-side type filter state (All | Hatchback | Sedan | SUV)
  const [selectedType, setSelectedType] = useState('All');

  // Form states
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const [selectedVehicleModel, setSelectedVehicleModel] = useState('');
  const [pickupDate, setPickupDate] = useState('2026-09-01');
  const [returnDate, setReturnDate] = useState('2026-09-05');
  const [bookingSuccess, setBookingSuccess] = useState('');
  const [bookingError, setBookingError] = useState('');
  const [submittingBooking, setSubmittingBooking] = useState(false);

  const { token } = useAuth();

  // Task 4: Fetch vehicle information from GET /api/v1/vehicles on component mount
  const fetchVehicles = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/v1/vehicles');
      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}: Failed to fetch vehicles.`);
      }
      const json = await response.json();
      if (json.success && Array.isArray(json.data)) {
        setVehicles(json.data);
        // Pre-select first available car
        const firstAvail = json.data.find((v) => v.available);
        if (firstAvail) {
          setSelectedVehicleId(firstAvail._id);
          setSelectedVehicleModel(firstAvail.model);
        }
      } else {
        throw new Error('Unexpected data format from vehicles API');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Unable to load vehicle fleet. Please check backend connection at http://localhost:5000');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  // Task 4: Client-side type filter applied to already-fetched array without re-fetching
  const vehicleTypes = ['All', 'Hatchback', 'Sedan', 'SUV'];
  const filteredVehicles = selectedType === 'All'
    ? vehicles
    : vehicles.filter((v) => v.type.toLowerCase() === selectedType.toLowerCase());

  // Derive selected vehicle object for pricing calculation
  const currentVehicleObj = vehicles.find((v) => v._id === selectedVehicleId || v.model === selectedVehicleModel);

  const calculateDays = () => {
    if (!pickupDate || !returnDate) return 1;
    const diff = new Date(returnDate).getTime() - new Date(pickupDate).getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 1;
  };

  const rentalDays = calculateDays();
  const estimatedCost = rentalDays * (currentVehicleObj?.pricePerDay || 1800);

  const handleSelectFromCard = (model) => {
    const matched = vehicles.find((v) => v.model === model);
    if (matched) {
      setSelectedVehicleId(matched._id);
      setSelectedVehicleModel(matched.model);
    } else {
      setSelectedVehicleModel(model);
    }
    setBookingSuccess('');
    setBookingError('');
    const formEl = document.getElementById('booking-section');
    if (formEl) {
      formEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Submit booking to backend POST /api/v1/bookings
  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setBookingSuccess('');
    setBookingError('');
    setSubmittingBooking(true);

    try {
      const response = await fetch('http://localhost:5000/api/v1/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          vehicleId: selectedVehicleId || currentVehicleObj?._id,
          pickupDate,
          returnDate
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setBookingSuccess(`🎉 Booking confirmed! (ID: ${data.data._id}) - ${currentVehicleObj?.model} reserved from ${pickupDate} to ${returnDate}.`);
        // Refresh fleet to update availability
        fetchVehicles();
      } else {
        setBookingError(data.message || 'Failed to create booking.');
      }
    } catch {
      setBookingError('Network error while connecting to booking API.');
    } finally {
      setSubmittingBooking(false);
    }
  };

  return (
    <div className="container">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">DriveEasy Vehicle Fleet</h1>
        <p className="page-subtitle">
          Live fleet powered by Express REST API (GET /api/v1/vehicles). Real-time availability tracking.
        </p>
      </div>

      {/* Task 4: Client-side Type Filter */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div className="filter-bar" style={{ margin: 0 }}>
          <span style={{ alignSelf: 'center', fontWeight: 700, fontSize: '0.9rem', marginRight: '0.5rem', color: 'var(--text-muted)' }}>
            Filter by Type:
          </span>
          {vehicleTypes.map((type) => (
            <button
              key={type}
              type="button"
              className={`filter-btn ${selectedType === type ? 'active' : ''}`}
              onClick={() => setSelectedType(type)}
            >
              {type}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={fetchVehicles}
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
          🔄 Refresh Fleet
        </button>
      </div>

      {/* Meaningful Real-time State Display Banner */}
      {selectedVehicleModel && (
        <div style={{
          background: 'white',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius)',
          padding: '1.25rem 1.5rem',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
              Currently Selected Car
            </span>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary)', marginTop: '0.1rem' }}>
              {selectedVehicleModel}
            </div>
            <div style={{ fontSize: '0.9rem', color: '#475569', marginTop: '0.2rem' }}>
              Period: <strong>{pickupDate}</strong> ➔ <strong>{returnDate}</strong> ({rentalDays} {rentalDays === 1 ? 'day' : 'days'})
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Estimated Price</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--success)' }}>
              ₹{estimatedCost.toLocaleString()}
            </div>
          </div>
        </div>
      )}

      {/* Task 4: 1) Loading Indicator */}
      {loading && (
        <div className="loading-box">
          <div className="spinner"></div>
          <p>Fetching vehicle fleet from Express REST API (GET /api/v1/vehicles)...</p>
        </div>
      )}

      {/* Task 4: 2) Friendly Error Message */}
      {error && !loading && (
        <div className="error-banner">
          <strong>Error:</strong> {error}
          <div style={{ marginTop: '0.5rem' }}>
            <button
              type="button"
              onClick={fetchVehicles}
              style={{
                background: 'var(--danger)',
                color: 'white',
                border: 'none',
                padding: '0.35rem 0.8rem',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              Retry API Request
            </button>
          </div>
        </div>
      )}

      {/* Task 4: 3) Grid of VehicleCard Components rendered from API Response */}
      {!loading && !error && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>
              Fleet Inventory ({filteredVehicles.length} {filteredVehicles.length === 1 ? 'car' : 'cars'} shown)
            </h2>
          </div>

          <div className="vehicles-grid" style={{ marginBottom: '3.5rem' }}>
            {filteredVehicles.map((v) => (
              <VehicleCard
                key={v._id || v.id}
                model={v.model}
                type={v.type}
                pricePerDay={v.pricePerDay}
                available={v.available}
                onSelect={handleSelectFromCard}
              />
            ))}
          </div>
        </>
      )}

      {/* Booking Form Section */}
      <div id="booking-section" style={{ maxWidth: '640px', margin: '0 auto' }}>
        <div className="form-card">
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.25rem' }}>
            Reserve Vehicle
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Instant reservation connected to POST /api/v1/bookings
          </p>

          {bookingSuccess && <div className="success-banner">{bookingSuccess}</div>}
          {bookingError && <div className="error-banner">{bookingError}</div>}

          <form onSubmit={handleBookingSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="vehicle-select">Selected Vehicle</label>
              <select
                id="vehicle-select"
                className="form-select"
                value={selectedVehicleId}
                onChange={(e) => {
                  setSelectedVehicleId(e.target.value);
                  const matched = vehicles.find((v) => v._id === e.target.value);
                  if (matched) setSelectedVehicleModel(matched.model);
                }}
              >
                {vehicles
                  .filter((v) => v.available)
                  .map((v) => (
                    <option key={v._id} value={v._id}>
                      {v.model} ({v.type}) - ₹{v.pricePerDay}/day
                    </option>
                  ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="pickup-date">Pickup Date</label>
              <input
                id="pickup-date"
                type="date"
                required
                className="form-input"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="return-date">Return Date</label>
              <input
                id="return-date"
                type="date"
                required
                className="form-input"
                value={returnDate}
                min={pickupDate}
                onChange={(e) => setReturnDate(e.target.value)}
              />
            </div>

            <div style={{
              background: 'var(--bg-main)',
              borderRadius: '8px',
              padding: '1rem',
              marginBottom: '1.5rem',
              border: '1px dashed var(--border-color)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Selected Model:</span>
                <strong>{selectedVehicleModel || currentVehicleObj?.model}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Rental Duration:</span>
                <strong>{rentalDays} {rentalDays === 1 ? 'day' : 'days'}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.5rem' }}>
                <span style={{ fontWeight: 700 }}>Total Estimate:</span>
                <span style={{ fontWeight: 800, color: 'var(--primary)' }}>₹{estimatedCost}</span>
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={submittingBooking || !selectedVehicleId}
            >
              {submittingBooking ? 'Reserving...' : `Confirm Reservation for ${selectedVehicleModel || 'Car'}`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
