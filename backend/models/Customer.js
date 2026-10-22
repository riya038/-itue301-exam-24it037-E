const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Customer name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Customer email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
  },
  phone: {
    type: String,
    trim: true
  },
  licenseNumber: {
    type: String,
    required: [true, 'Driving license number is required'],
    unique: true,
    trim: true
  },
  password: {
    type: String,
    default: 'driveeasy123'
  }
}, { timestamps: true });

module.exports = mongoose.model('Customer', customerSchema);
