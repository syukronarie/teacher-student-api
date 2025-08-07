const { extendZodWithOpenApi } = require('@asteasolutions/zod-to-openapi');
const { z } = require('zod');
extendZodWithOpenApi(z);

const RegisterDTO = z
  .object({
    teacher: z.email().openapi({
      description: 'Teacher email',
      example: 'teacherken@gmail.com',
    }),
    students: z.array(z.email()).openapi({
      description: 'Array of student emails',
      example: ['studentjon@gmail.com'],
    }),
  })
  .openapi('RegisterDTO');

module.exports = RegisterDTO;
