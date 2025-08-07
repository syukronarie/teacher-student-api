const { logger, logWithContext } = require('../config/logger');
const morgan = require('morgan');
const onFinished = require('on-finished');
const rTracer = require('cls-rtracer');
const log = logWithContext({ module: 'Tracer' });

const MAX_BODY_LENGTH = 5 * 1024; // 5 KB

// Redact sensitive data
const redactSensitive = (obj, keysToRedact = ['password', 'token', 'authorization']) => {
  if (typeof obj !== 'object' || obj === null) return obj;
  if (Array.isArray(obj)) return obj.map((item) => redactSensitive(item, keysToRedact));
  return Object.entries(obj).reduce((acc, [key, value]) => {
    acc[key] = keysToRedact.includes(key.toLowerCase()) ? '[REDACTED]' : redactSensitive(value, keysToRedact);
    return acc;
  }, {});
};

const requestResponseLogger = (req, res, next) => {
  log.info('Request response log', { statusCode: res.statusCode });
  const originalSend = res.send;
  let responseBody;

  // Capture response body
  res.send = function (body) {
    responseBody = body;
    return originalSend.call(this, body);
  };

  onFinished(res, () => {
    // Process response
    let parsedResponse = responseBody;
    try {
      if (typeof parsedResponse === 'string') {
        parsedResponse = JSON.parse(parsedResponse);
      }
    } catch {
      // Keep as-is
    }

    if (typeof parsedResponse === 'object') {
      parsedResponse = redactSensitive(parsedResponse);
    }

    if (typeof parsedResponse === 'string' && parsedResponse.length > MAX_BODY_LENGTH) {
      parsedResponse = '[Response too large to log]';
    }

    // Process request body
    let requestBody = req.body;
    if (typeof requestBody === 'object') {
      requestBody = redactSensitive(requestBody);
    }

    log.info(res.message, {
      module: 'HTTP',
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      request: {
        headers: req.headers,
        query: req.query,
        body: requestBody,
      },
      responseBody: parsedResponse,
    });
  });

  next();
};

// Express middleware to generate/propagate the request ID
const rTracerMiddleware = rTracer.expressMiddleware({
  echoHeader: true, // echo back existing X-Request-Id if present
  useHeader: true,
  headerName: 'X-Correlation-ID',
});

// Morgan format capturing method, url, status, response time
const morganFormat = ':method :url :status :res[content-length] - :response-time ms';

const httpLogger = morgan(morganFormat, {
  stream: {
    write: (msg) => log.info(msg.trim(), { module: 'HTTP' }),
  },
});

module.exports = { rTracerMiddleware, httpLogger, requestResponseLogger };
