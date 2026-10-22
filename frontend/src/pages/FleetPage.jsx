import React, { useState } from 'react';
import VehicleCard from '../components/VehicleCard';

export default function FleetPage() {
  // Vehicle fleet list
  const [vehicles] = useState([
    {
      id: '1',
      model: 'Hyundai i20 Asta',
      type: 'Hatchback',
      pricePerDay: 1800,
      available: true,
    },
    {
      id: '2',
      model: 'Honda City ZX',
      type: 'Sedan',
      pricePerDay: 2500,
      available: true,
    },
    {
      id: '3',
      model: 'Tata Harrier Fearless',
      type: 'SUV',
      pricePerDay: 3800,
      available: false, // demonstrates "Not Available" badge
    },
    {
      id: '4',
      model: 'Maruti Suzuki Swift ZXi',
      type: 'Hatchback',
      pricePerDay: 1500,
      available: true,
    },
    {
      id: '5',
      model: 'Mahindra XUV700 AX7',
      type: 'SUV',
      pricePerDay: 4200,
      available: false, // demonstrates "Not Available" badge
    },
    {
      id: '6',
      model: 'Hyundai Verna SX Turbo',
      type: 'Sedan',
      pricePerDay: 2700,
      available: true,
    },
  ]);

  // Task 2: Form state management using useState
  const [selectedVehicle, setSelectedVehicle] = useState('Hyundai i20 Asta');
  const [pickupDate, setPickupDate] = useState('2026-09-01');
  const [returnDate, setReturnDate] = useState('2026-09-04');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  // Derive selected vehicle object for pricing
  const currentVehicleObj = vehicles.find((v) => v.model === selectedVehicle) || vehicles[0];

  // Calculate rental duration meaningfully from pickupDate and returnDate
  const calculateDays = () => {
    if (!pickupDate || !returnDate) return 1;
    const diff = new Date(returnDate).getTime() - new Date(pickupDate).getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 1;
  };

  const rentalDays = calculateDays();
  const estimatedCost = rentalDays * (currentVehicleObj?.pricePerDay || 1800);

  const handleSelectFromCard = (model) => {
    setSelectedVehicle(model);
    setBookingConfirmed(false);
    // Smooth scroll down to the booking form
    const formEl = document.getElementById('booking-section');
    if (formEl) {
      formEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    setBookingConfirmed(true);
  };

  return (
    <div className="container">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">DriveEasy Vehicle Fleet</h1>
        <p className="page-subtitle">
          Browse our fleet, select your car, and reserve it instantly without phone-call delays.
        </p>
      </div>

      {/* Real-time State Display Banner */}
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
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
            Active Selection State (Task 2)
          </span>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)', marginTop: '0.2rem' }}>
            {selectedVehicle ? `Selected Car: ${selectedVehicle}` : 'No vehicle selected'}
          </div>
          <div style={{ fontSize: '0.9rem', color: '#475569', marginTop: '0.2rem' }}>
            Pickup: <strong>{pickupDate}</strong> ➔ Return: <strong>{returnDate}</strong> ({rentalDays} {rentalDays === 1 ? 'day' : 'days'})
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Estimated Price</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--success)' }}>
            ₹{estimatedCost.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Grid of VehicleCard Components */}
      <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1rem' }}>
        Available & Fleet Vehicles
      </h2>
      <div className="vehicles-grid" style={{ marginBottom: '3.5rem' }}>
        {vehicles.map((v) => (
          <VehicleCard
            key={v.id}
            model={v.model}
            type={v.type}
            pricePerDay={v.pricePerDay}
            available={v.available}
            onSelect={handleSelectFromCard}
          />
        ))}
      </div>

      {/* Task 2: Booking Form Section */}
      <div id="booking-section" style={{ maxWidth: '640px', margin: '0 auto' }}>
        <div className="form-card">
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.25rem' }}>
            Book Your Chosen Vehicle
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Fill in the rental dates to confirm your reservation.
          </p>

          {bookingConfirmed && (
            <div className="success-banner">
              🎉 <strong>Booking Reserved!</strong> You reserved <strong>{selectedVehicle}</strong> from <strong>{pickupDate}</strong> to <strong>{returnDate}</strong> for <strong>₹{estimatedCost}</strong>.
            </div>
          )}

          <form onSubmit={handleBookingSubmit}>
            {/* 1. Selected Vehicle State */}
            <div className="form-group">
              <label className="form-label" htmlFor="vehicle-select">Selected Vehicle</label>
              <select
                id="vehicle-select"
                className="form-select"
                value={selectedVehicle}
                onChange={(e) => {
                  setSelectedVehicle(e.target.value);
                  setBookingConfirmed(false);
                }}
              >
                {vehicles.filter(v => v.available).map((v) => (
                  <option key={v.id} value={v.model}>
                    {v.model} ({v.type}) - ₹{v.pricePerDay}/day
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Pickup Date State */}
            <div className="form-group">
              <label className="form-label" htmlFor="pickup-date">Pickup Date</label>
              <input
                id="pickup-date"
                type="date"
                required
                className="form-input"
                value={pickupDate}
                onChange={(e) => {
                  setPickupDate(e.target.value);
                  setBookingConfirmed(false);
                }}
              />
            </div>

            {/* 3. Return Date State */}
            <div className="form-group">
              <label className="form-label" htmlFor="return-date">Return Date</label>
              <input
                id="return-date"
                type="date"
                required
                className="form-input"
                value={returnDate}
                min={pickupDate}
                onChange={(e) => {
                  setReturnDate(e.target.value);
                  setBookingConfirmed(false);
                }}
              />
            </div>

            {/* Dynamic Summary using State Values */}
            <div style={{
              background: 'var(--bg-main)',
              borderRadius: '8px',
              padding: '1rem',
              marginBottom: '1.5rem',
              border: '1px dashed var(--border-color)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Selected Model:</span>
                <strong>{selectedVehicle}</strong>
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

            <button type="submit" className="btn-primary">
              Confirm Reservation for {selectedVehicle}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
