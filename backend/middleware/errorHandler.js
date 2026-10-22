/**
 * Global Error Handling Middleware
 * Catches unhandled errors and returns structured JSON responses
 * instead of raw HTML error stacks
 */
const errorHandler = (err, req, res, next) => {
  console.error('[Error Details]:', err.message);

  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'Internal Server Error';

  // Handle Mongoose Validation Errors
  if (err.name === 'ValidationError') {
    statusCode = 400;
    const errors = Object.values(err.errors).map(el => el.message);
    message = `Validation Error: ${errors.join(', ')}`;
  }

  // Handle Mongoose Duplicate Key Error (e.g. unique email or license)
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    message = `Duplicate field value entered: ${field} already exists.`;
  }

  // Handle Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Resource not found with invalid id format: ${err.value}`;
  }

  res.status(statusCode).json({
    success: false,
    status: statusCode,
    message: message
  });
};

module.exports = errorHandler;
