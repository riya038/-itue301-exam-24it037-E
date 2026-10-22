const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  model: {
    type: String,
    required: [true, 'Vehicle model is required'],
    trim: true
  },
  type: {
    type: String,
    required: [true, 'Vehicle type is required'],
    enum: {
      values: ['Hatchback', 'Sedan', 'SUV'],
      message: '{VALUE} is not a supported vehicle type'
    }
  },
  pricePerDay: {
    type: Number,
    required: [true, 'Price per day is required'],
    min: [0, 'Price per day must be at least 0']
  },
  available: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Vehicle', vehicleSchema);
