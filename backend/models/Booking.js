const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: [true, 'Customer ID reference is required']
  },
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: [true, 'Vehicle ID reference is required']
  },
  pickupDate: {
    type: Date,
    required: [true, 'Pickup date is required']
  },
  returnDate: {
    type: Date,
    required: [true, 'Return date is required']
  },
  totalAmount: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: {
      values: ['reserved', 'ongoing', 'completed', 'cancelled'],
      message: '{VALUE} is not a valid booking status'
    },
    default: 'reserved'
  }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
