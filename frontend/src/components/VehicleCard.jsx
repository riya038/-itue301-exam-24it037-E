import React from 'react';

/**
 * Reusable VehicleCard Component
 * Accepts props: model, type, pricePerDay, available
 * Renders vehicle details and conditionally renders "Book Now" button or "Not Available" badge
 */
export default function VehicleCard({ model, type, pricePerDay, available, onSelect }) {
  return (
    <div className="vehicle-card" data-testid="vehicle-card">
      <div className="vehicle-card-top">
        <span className="vehicle-type-tag">{type}</span>
        <h3 className="vehicle-model">{model}</h3>
        
        <div className="vehicle-price-box">
          <span className="vehicle-price">₹{pricePerDay}</span>
          <span className="vehicle-price-period">/ day</span>
        </div>

        <div className="vehicle-status-row">
          <small style={{ color: 'var(--text-muted)' }}>
            Status: <strong>{available ? 'Available for Rent' : 'Currently Rented'}</strong>
          </small>
        </div>
      </div>

      <div className="vehicle-card-action">
        {/* Ternary condition handling Book Now button vs Not Available badge */}
        {available ? (
          <button 
            type="button" 
            className="btn-book"
            onClick={() => onSelect && onSelect(model)}
          >
            Book Now
          </button>
        ) : (
          <span className="badge badge-not-available">
            Not Available
          </span>
        )}
      </div>
    </div>
  );
}
