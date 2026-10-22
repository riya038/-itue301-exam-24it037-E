const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Customer = require('../models/Customer');
const { memoryDB, isMongooseConnected } = require('../config/store');

const JWT_SECRET = process.env.JWT_SECRET || 'driveeasy_secret_key_24it037';

/**
 * Controller: Authenticate Customer and Issue Token
 * POST /api/v1/auth/login
 * Public endpoint
 */
const loginCustomer = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide customer email'
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    let customer;

    if (isMongooseConnected()) {
      customer = await Customer.findOne({ email: cleanEmail });
      if (!customer) {
        customer = await Customer.create({
          name: cleanEmail.split('@')[0].toUpperCase(),
          email: cleanEmail,
          phone: '9876543210',
          licenseNumber: `DL-${Date.now().toString().slice(-6)}`,
          password: password || 'driveeasy123'
        });
      }
    } else {
      customer = memoryDB.customers.find(c => c.email === cleanEmail);
      if (!customer) {
        customer = {
          _id: `66c8b1a2000000000000000${memoryDB.customers.length + 1}`,
          name: cleanEmail.split('@')[0].toUpperCase(),
          email: cleanEmail,
          phone: '9876543210',
          licenseNumber: `DL-${Date.now().toString().slice(-6)}`,
          password: password || 'driveeasy123'
        };
        memoryDB.customers.push(customer);
      }
    }

    const token = jwt.sign(
      {
        id: customer._id.toString(),
        email: customer.email,
        name: customer.name,
        role: 'Customer'
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      success: true,
      message: 'Authentication successful',
      token,
      customer: {
        id: customer._id,
        name: customer.name,
        email: customer.email,
        licenseNumber: customer.licenseNumber
      }
    });
  } catch (error) {
    next(error);
  }
};

router.post('/login', loginCustomer);

module.exports = router;
