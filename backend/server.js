const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables from .env
dotenv.config();

const connectDB = require('./config/db');
const requestLogger = require('./middleware/requestLogger');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Global Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Task 3: Global custom requestLogger middleware [METHOD] [PATH] [TIMESTAMP]
app.use(requestLogger);

// Health check endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'online',
    system: 'DriveEasy Car Rental REST API',
    version: '1.0.0',
    endpoints: {
      auth: 'POST /api/v1/auth/login',
      vehicles: 'GET /api/v1/vehicles',
      createBooking: 'POST /api/v1/bookings',
      myBookings: 'GET /api/v1/bookings/my',
      updateStatus: 'PATCH /api/v1/bookings/:id/status'
    }
  });
});

// Task 3: REST API Endpoints under /api/v1/
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/vehicles', vehicleRoutes);
app.use('/api/v1/bookings', bookingRoutes);

// Catch 404 for unknown endpoints
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `API Route ${req.originalUrl} not found on DriveEasy server`
  });
});

// Task 3: Global error-handling middleware applied as the last middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🚗 DriveEasy Backend Server running on port ${PORT}`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`===============================================`);
});

module.exports = app;
