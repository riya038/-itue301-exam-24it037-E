const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Vehicle = require('../models/Vehicle');
const Customer = require('../models/Customer');
const authGuard = require('../middleware/authGuard');
const { memoryDB, isMongooseConnected } = require('../config/store');

// All booking routes are protected by authGuard middleware
router.use(authGuard);

/**
 * Controller: Create Booking
 * POST /api/v1/bookings (Protected)
 * Checks vehicle.available === true before creating booking (returns 400 if not),
 * creates Booking record, and sets vehicle.available = false.
 */
const createBooking = async (req, res, next) => {
  try {
    const { vehicleId, pickupDate, returnDate } = req.body;
    const customerId = req.customer.id;

    // 1. Validation checks
    if (!vehicleId || !pickupDate || !returnDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide vehicleId, pickupDate, and returnDate.'
      });
    }

    if (isMongooseConnected()) {
      // Validate ObjectId
      if (!mongoose.Types.ObjectId.isValid(vehicleId)) {
        return res.status(400).json({
          success: false,
          message: `Invalid vehicleId format: ${vehicleId}`
        });
      }

      // 2. Sequential findById check for vehicle availability (Task 5 requirement)
      const vehicle = await Vehicle.findById(vehicleId);

      if (!vehicle) {
        return res.status(404).json({
          success: false,
          message: 'Vehicle not found.'
        });
      }

      if (vehicle.available === false) {
        return res.status(400).json({
          success: false,
          message: `Vehicle "${vehicle.model}" is currently not available for booking.`
        });
      }

      // Calculate total amount
      const days = Math.max(1, Math.ceil((new Date(returnDate) - new Date(pickupDate)) / (1000 * 60 * 60 * 24)));
      const totalAmount = days * vehicle.pricePerDay;

      // 3. Create Booking record
      const newBooking = await Booking.create({
        customerId,
        vehicleId,
        pickupDate,
        returnDate,
        totalAmount,
        status: 'reserved'
      });

      // 4. Atomically set vehicle.available = false to prevent double-booking
      await Vehicle.findByIdAndUpdate(vehicleId, { available: false });

      const populatedBooking = await Booking.findById(newBooking._id)
        .populate('customerId', 'name email licenseNumber')
        .populate('vehicleId', 'model type pricePerDay');

      return res.status(201).json({
        success: true,
        message: 'Booking created successfully',
        data: populatedBooking
      });
    } else {
      // In-Memory store operations with identical validation
      const vehicle = memoryDB.vehicles.find(v => v._id === vehicleId);

      if (!vehicle) {
        return res.status(404).json({
          success: false,
          message: 'Vehicle not found.'
        });
      }

      if (vehicle.available === false) {
        return res.status(400).json({
          success: false,
          message: `Vehicle "${vehicle.model}" is currently not available for booking.`
        });
      }

      const days = Math.max(1, Math.ceil((new Date(returnDate) - new Date(pickupDate)) / (1000 * 60 * 60 * 24)));
      const totalAmount = days * vehicle.pricePerDay;

      // Update vehicle available to false
      vehicle.available = false;

      const customer = memoryDB.customers.find(c => c._id === customerId) || {
        _id: customerId,
        name: req.customer.name,
        email: req.customer.email
      };

      const newBooking = {
        _id: `66c8b1a3000000000000000${memoryDB.bookings.length + 1}`,
        customerId: {
          _id: customer._id,
          name: customer.name,
          email: customer.email
        },
        vehicleId: {
          _id: vehicle._id,
          model: vehicle.model,
          type: vehicle.type,
          pricePerDay: vehicle.pricePerDay
        },
        pickupDate,
        returnDate,
        totalAmount,
        status: 'reserved',
        createdAt: new Date().toISOString()
      };

      memoryDB.bookings.unshift(newBooking);

      return res.status(201).json({
        success: true,
        message: 'Booking created successfully',
        data: newBooking
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Controller: Get Customer's Own Bookings
 * GET /api/v1/bookings/my (Protected)
 * Uses .populate('customerId', 'name email') and .populate('vehicleId', 'model type')
 */
const getMyBookings = async (req, res, next) => {
  try {
    const customerId = req.customer.id;

    if (isMongooseConnected()) {
      const bookings = await Booking.find({ customerId })
        .populate('customerId', 'name email')
        .populate('vehicleId', 'model type pricePerDay')
        .sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        count: bookings.length,
        data: bookings
      });
    } else {
      const userBookings = memoryDB.bookings.filter(
        b => (b.customerId?._id || b.customerId) === customerId
      );

      return res.status(200).json({
        success: true,
        count: userBookings.length,
        data: userBookings
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Controller: Update Booking Status
 * PATCH /api/v1/bookings/:id/status (Protected)
 * Updates status: 'reserved' | 'ongoing' | 'completed' | 'cancelled'
 */
const updateBookingStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['reserved', 'ongoing', 'completed', 'cancelled'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    if (isMongooseConnected()) {
      const booking = await Booking.findById(id);
      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found.'
        });
      }

      booking.status = status;
      await booking.save();

      // If completed or cancelled, release vehicle back to available: true
      if (status === 'completed' || status === 'cancelled') {
        await Vehicle.findByIdAndUpdate(booking.vehicleId, { available: true });
      }

      const updatedBooking = await Booking.findById(id)
        .populate('customerId', 'name email')
        .populate('vehicleId', 'model type');

      return res.status(200).json({
        success: true,
        message: `Booking status updated to ${status}`,
        data: updatedBooking
      });
    } else {
      const booking = memoryDB.bookings.find(b => b._id === id);
      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found.'
        });
      }

      booking.status = status;

      if (status === 'completed' || status === 'cancelled') {
        const vId = booking.vehicleId?._id || booking.vehicleId;
        const vehicle = memoryDB.vehicles.find(v => v._id === vId);
        if (vehicle) vehicle.available = true;
      }

      return res.status(200).json({
        success: true,
        message: `Booking status updated to ${status}`,
        data: booking
      });
    }
  } catch (error) {
    next(error);
  }
};

// Route Definitions
router.post('/', createBooking);
router.get('/my', getMyBookings);
router.patch('/:id/status', updateBookingStatus);

module.exports = router;
