const { createLogger, format, transports } = require('winston');
const { combine, timestamp, prettyPrint, json } = format;
const rTracer = require('cls-rtracer');
require('winston-daily-rotate-file');

const rotateTransport = new transports.DailyRotateFile({
  filename: 'logs/app-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '30d',
});

const requestIdFormat = format((info) => {
  info.requestId = rTracer.id();
  return info;
});

const logger = createLogger({
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  format: combine(requestIdFormat(), timestamp(), json()),
  transports: [
    new transports.Console({
      format: prettyPrint({
        colorize: true,
      }),
    }),
    rotateTransport,
  ],
});

// Provide per‑module/fn child logger
function logWithContext(context = {}) {
  return logger.child(context);
}

module.exports = { logger, logWithContext };
