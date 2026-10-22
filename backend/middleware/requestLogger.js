/**
 * Custom requestLogger Middleware
 * Logs [METHOD] [PATH] [TIMESTAMP] for every incoming request
 * Applied globally in server.js
 */
const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${req.method}] [${req.originalUrl || req.url}] [${timestamp}]`);
  next();
};

module.exports = requestLogger;
