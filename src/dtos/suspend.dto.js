const { extendZodWithOpenApi } = require('@asteasolutions/zod-to-openapi');
const { z } = require('zod');
extendZodWithOpenApi(z);

const SuspendDTO = z
  .object({
    student: z.email().openapi({
      description: 'Student email to suspend',
      example: 'studentmary@gmail.com',
    }),
  })
  .openapi('SuspendDTO');

module.exports = SuspendDTO;
