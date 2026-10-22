const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'driveeasy_secret_key_24it037';

/**
 * authGuard Middleware
 * Validates the Authorization Bearer token header
 * Returns 401 if token is missing or invalid
 * Attaches decoded customer data to req.customer
 */
const authGuard = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: Access denied. Bearer token missing.'
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify JWT token
    const decoded = jwt.verify(token, JWT_SECRET);
    req.customer = decoded;
    next();
  } catch (error) {
    // If token verification fails (expired, tampered, or invalid)
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: Invalid or expired token.'
    });
  }
};

module.exports = authGuard;
