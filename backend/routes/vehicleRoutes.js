const express = require('express');
const router = express.Router();
const Vehicle = require('../models/Vehicle');
const { memoryDB, isMongooseConnected } = require('../config/store');

/**
 * Controller: Get All Vehicles
 * GET /api/v1/vehicles
 * Public endpoint
 */
const getAllVehicles = async (req, res, next) => {
  try {
    let vehicles;
    if (isMongooseConnected()) {
      vehicles = await Vehicle.find().sort({ createdAt: -1 });
    } else {
      vehicles = memoryDB.vehicles;
    }

    return res.status(200).json({
      success: true,
      count: vehicles.length,
      data: vehicles
    });
  } catch (error) {
    next(error);
  }
};

router.get('/', getAllVehicles);

module.exports = router;
