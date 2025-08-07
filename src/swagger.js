const swaggerUi = require('swagger-ui-express');
const { OpenAPIRegistry, OpenApiGeneratorV31 } = require('@asteasolutions/zod-to-openapi');
const RegisterDTO = require('./dtos/register.dto');
const SuspendDTO = require('./dtos/suspend.dto');
const NotificationDTO = require('./dtos/notification.dto');
const { z } = require('zod');

const registry = new OpenAPIRegistry();

registry.registerPath({
  method: 'post',
  path: '/api/register',
  description: 'Register one or more students to a teacher',
  requestFormat: 'json',
  request: {
    body: {
      content: {
        'application/json': {
          schema: RegisterDTO,
        },
      },
    },
  },
  responses: {
    204: { description: 'Success - no content' },
    400: { description: 'Bad Request - validation error' },
  },
});

registry.registerPath({
  method: 'post',
  path: '/api/suspend',
  description: 'Suspend a specified student',
  requestFormat: 'json',
  request: {
    body: {
      content: {
        'application/json': {
          schema: SuspendDTO,
        },
      },
    },
  },
  responses: {
    204: { description: 'Success - no content' },
    400: { description: 'Bad Request - validation error' },
  },
});

const NotificationResponseSchema = registry.register(
  'NotificationResponse',
  z.object({
    recipients: z.array(z.email()).openapi(['studentbob@gmail.com', 'studentagnes@gmail.com', 'studentmiche@gmail.com']),
  })
);

registry.registerPath({
  method: 'post',
  path: '/api/retrievefornotifications',
  description: 'Retrieve list of students eligible for notifications',
  requestFormat: 'json',
  request: {
    body: {
      content: {
        'application/json': {
          schema: NotificationDTO,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'List of recipients',
      content: {
        'application/json': {
          schema: NotificationResponseSchema,
        },
      },
    },
    400: { description: 'Bad Request - validation error' },
  },
});

const CommonStudentsResponseSchema = registry.register(
  'CommonStudentsResponse',
  z.object({
    students: z.array(z.email()).openapi(['commonstudent1@gmail.com', 'commonstudent2@gmail.com']),
  })
);

registry.registerPath({
  method: 'get',
  path: '/api/commonstudents',
  description: 'Retrieve students common to one or more teachers',
  request: {
    query: z.object({
      teacher: z.union([z.email(), z.array(z.email())]).default('teacherken@gmail.com'),
    }),
  },
  responses: {
    200: {
      description: 'List of students',
      content: {
        'application/json': {
          schema: CommonStudentsResponseSchema,
        },
      },
    },
    400: { description: 'Bad Request - validation error' },
  },
});

const generator = new OpenApiGeneratorV31(registry.definitions);

const openApiDocument = generator.generateDocument({
  openapi: '3.0.0',
  info: {
    title: 'Teacher Student API',
    version: '1.0.0',
    description: 'API for managing teachers and students',
  },
  servers: [{ url: 'http://localhost:3000' }],
});

module.exports = { swaggerUi, openApiDocument };
