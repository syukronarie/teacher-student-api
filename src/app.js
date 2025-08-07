const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimiter = require('./middlewares/rateLimiter');
const errorHandler = require('./middlewares/errorHandler');
const teacherRoutes = require('./routes/teacher.routes');
const { swaggerUi, openApiDocument } = require('./swagger');
const { rTracerMiddleware, httpLogger, requestResponseLogger } = require('./middlewares/tracer');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.disable('etag');

// CLS tracer first
app.use(rTracerMiddleware);

// Morgan for concise HTTP logs
app.use(httpLogger);

// Capture and log full request/response bodies with correlation ID
app.use(requestResponseLogger);

app.use(rateLimiter);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));
app.use('/api', teacherRoutes);

app.use(errorHandler);

app.use((_req, res) => {
  res.status(404).json({ message: 'Resource not found' });
});

module.exports = app;
