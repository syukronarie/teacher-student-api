const rTracer = require('cls-rtracer');
const { logWithContext, logger } = require('../config/logger');

module.exports = (err, _req, res, _next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  logger.info(err.message, { stack: err.stack || '' });
  res.status(statusCode).json({ message, requestId: rTracer.id() });
};
