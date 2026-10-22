const mongoose = require('mongoose');
const Vehicle = require('../models/Vehicle');
const Customer = require('../models/Customer');

/**
 * Connect to MongoDB using connection string stored in .env
 */
const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/driveeasy';

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000
    });
    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}`);
    await seedInitialData();
  } catch (error) {
    console.warn(`[MongoDB Warning] Could not connect to MongoDB at ${uri}: ${error.message}`);
    console.warn(`[MongoDB Note] Ensure MongoDB is running or specify MONGO_URI in .env`);
  }
};

/**
 * Seed initial sample vehicles and customer if database is empty
 */
const seedInitialData = async () => {
  try {
    const vehicleCount = await Vehicle.countDocuments();
    if (vehicleCount === 0) {
      console.log('[MongoDB] Seeding initial fleet vehicles...');
      await Vehicle.create([
        {
          model: 'Hyundai i20 Asta',
          type: 'Hatchback',
          pricePerDay: 1800,
          available: true
        },
        {
          model: 'Honda City ZX',
          type: 'Sedan',
          pricePerDay: 2500,
          available: true
        },
        {
          model: 'Tata Harrier Fearless',
          type: 'SUV',
          pricePerDay: 3800,
          available: false
        },
        {
          model: 'Maruti Suzuki Swift ZXi',
          type: 'Hatchback',
          pricePerDay: 1500,
          available: true
        },
        {
          model: 'Mahindra XUV700 AX7',
          type: 'SUV',
          pricePerDay: 4200,
          available: false
        },
        {
          model: 'Hyundai Verna SX Turbo',
          type: 'Sedan',
          pricePerDay: 2700,
          available: true
        }
      ]);
      console.log('[MongoDB] Seeded 6 initial vehicles successfully.');
    }

    const customerCount = await Customer.countDocuments();
    if (customerCount === 0) {
      await Customer.create({
        name: 'Riya Patel',
        email: 'riya038@driveeasy.com',
        phone: '9876543210',
        licenseNumber: 'GJ-06-2026-24IT037',
        password: 'password123'
      });
      console.log('[MongoDB] Seeded default customer: riya038@driveeasy.com');
    }
  } catch (err) {
    console.error('[MongoDB Seeding Error]:', err.message);
  }
};

module.exports = connectDB;
