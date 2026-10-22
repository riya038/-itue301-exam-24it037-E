const mongoose = require('mongoose');

// In-memory collections
const memoryDB = {
  vehicles: [
    {
      _id: '66c8b1a10000000000000001',
      model: 'Hyundai i20 Asta',
      type: 'Hatchback',
      pricePerDay: 1800,
      available: true,
      createdAt: new Date().toISOString()
    },
    {
      _id: '66c8b1a10000000000000002',
      model: 'Honda City ZX',
      type: 'Sedan',
      pricePerDay: 2500,
      available: true,
      createdAt: new Date().toISOString()
    },
    {
      _id: '66c8b1a10000000000000003',
      model: 'Tata Harrier Fearless',
      type: 'SUV',
      pricePerDay: 3800,
      available: false,
      createdAt: new Date().toISOString()
    },
    {
      _id: '66c8b1a10000000000000004',
      model: 'Maruti Suzuki Swift ZXi',
      type: 'Hatchback',
      pricePerDay: 1500,
      available: true,
      createdAt: new Date().toISOString()
    },
    {
      _id: '66c8b1a10000000000000005',
      model: 'Mahindra XUV700 AX7',
      type: 'SUV',
      pricePerDay: 4200,
      available: false,
      createdAt: new Date().toISOString()
    },
    {
      _id: '66c8b1a10000000000000006',
      model: 'Hyundai Verna SX Turbo',
      type: 'Sedan',
      pricePerDay: 2700,
      available: true,
      createdAt: new Date().toISOString()
    }
  ],
  customers: [
    {
      _id: '66c8b1a20000000000000001',
      name: 'Riya Patel',
      email: 'riya038@driveeasy.com',
      phone: '9876543210',
      licenseNumber: 'GJ-06-2026-24IT037',
      password: 'driveeasy123'
    }
  ],
  bookings: [
    {
      _id: '66c8b1a30000000000000001',
      customerId: {
        _id: '66c8b1a20000000000000001',
        name: 'Riya Patel',
        email: 'riya038@driveeasy.com'
      },
      vehicleId: {
        _id: '66c8b1a10000000000000003',
        model: 'Tata Harrier Fearless',
        type: 'SUV'
      },
      pickupDate: '2026-09-01T00:00:00.000Z',
      returnDate: '2026-09-04T00:00:00.000Z',
      totalAmount: 11400,
      status: 'ongoing',
      createdAt: new Date().toISOString()
    }
  ]
};

const isMongooseConnected = () => mongoose.connection.readyState === 1;

module.exports = {
  memoryDB,
  isMongooseConnected
};
