const rTracer = require('cls-rtracer');

/**
 * Constructs a standard error response
 * @param {Object} options
 * @param {string} options.message - A human-readable error message
 * @param {number} [options.statusCode=500] - HTTP status code
 * @param {string} [options.errorCode] - Application-specific error code
 * @param {Object} [options.details] - Optional detailed error info
 * @returns {Object} Error response object
 */
function constructErrorResponse({ message, statusCode = 500, errorCode, details } = {}) {
  const response = {
    success: false,
    message: message || 'Internal Server Error',
    statusCode,
    requestId: rTracer.id() || undefined,
  };

  if (errorCode) response.errorCode = errorCode;
  if (details) response.details = details;

  return response;
}

module.exports = { constructErrorResponse };
