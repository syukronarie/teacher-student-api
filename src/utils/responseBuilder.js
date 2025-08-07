/**
 * Constructs a standardized success response object.
 *
 * @param {Object} options
 * @param {string|undefined} [options.message] - Optional message message.
 * @param {string|undefined} [options.notification] - Optional notification message.
 * @param {Object|Array|null|undefined} [options.data] - Payload data to return.
 * @returns {Object} Standardized API response.
 */
function constructSuccessResponse({ notification = '', message = '', data = undefined } = {}) {
  const response = {};

  if (message) {
    response.message = message;
  }

  if (notification) {
    response.notification = notification;
  }

  if (data) {
    response.data = data;
  }

  return response;
}

module.exports = { constructSuccessResponse };
