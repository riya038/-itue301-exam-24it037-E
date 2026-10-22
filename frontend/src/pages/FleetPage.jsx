import React, { useState } from 'react';
import VehicleCard from '../components/VehicleCard';

export default function FleetPage() {
  // Sample initial vehicle data demonstrating component composition and props passing
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

  const [selectedVehicle, setSelectedVehicle] = useState('');

  const handleSelectVehicle = (model) => {
    setSelectedVehicle(model);
  };

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">DriveEasy Vehicle Fleet</h1>
        <p className="page-subtitle">
          Browse our premium self-drive vehicles. Select an available car to start your journey.
        </p>
      </div>

      {selectedVehicle && (
        <div className="success-banner">
          Currently Selected Car: <strong>{selectedVehicle}</strong>
        </div>
      )}

      {/* Grid of reusable VehicleCard components rendered by passing props */}
      <div className="vehicles-grid">
        {vehicles.map((v) => (
          <VehicleCard
            key={v.id}
            model={v.model}
            type={v.type}
            pricePerDay={v.pricePerDay}
            available={v.available}
            onSelect={handleSelectVehicle}
          />
        ))}
      </div>
    </div>
  );
}
