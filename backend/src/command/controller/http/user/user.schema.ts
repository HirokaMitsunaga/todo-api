import { z } from '@hono/zod-openapi';

export const UserRequestSchema = z
  .object({
    name: z.string().openapi({
      example: '山田 太郎',
    }),
    email: z.email().openapi({
      example: 'taro.yamada@example.com',
    }),
    password: z.string().openapi({
      example: 'password',
    }),
  })
  .openapi('UserRequest');
