const { extendZodWithOpenApi } = require('@asteasolutions/zod-to-openapi');
const { z } = require('zod');
extendZodWithOpenApi(z);

const NotificationDTO = z
  .object({
    teacher: z.email().openapi({
      description: 'Teacher sending notification',
      example: 'teacherken@gmail.com',
    }),
    notification: z.string().openapi({
      description: 'Notification text',
      example: 'Hello students! @studentagnes@gmail.com',
    }),
  })
  .openapi('NotificationDTO');

module.exports = NotificationDTO;
