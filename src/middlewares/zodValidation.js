const { logger } = require('../config/logger');
const rTracer = require('cls-rtracer');

const zodValidation = (schema) => async (req, res, next) => {
  try {
    const data = req.method === 'GET' ? req.query : req.body;
    const result = schema.safeParse(data);
    if (!result.success) {
      logger.error('Validation failed', { statusCode: res.statusCode, result: result });
      return res.status(400).json({
        requestId: rTracer.id(),
        message: JSON.parse(result.error.message),
      });
    }
    req.validatedData = result.data;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = zodValidation;
