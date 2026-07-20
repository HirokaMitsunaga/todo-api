import { z } from '@hono/zod-openapi';

export const TodoResponseSchema = z
  .object({
    id: z.string().openapi({
      example: '01J123456789ABCDEFGHJKMNPQ',
    }),
    title: z.string().openapi({
      example: '牛乳を買う',
    }),
    userId: z.string().openapi({
      example: '01J123456789ABCDEFGHJKMNPQ',
    }),
    status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED']).openapi({
      example: 'PENDING',
    }),
    priority: z.number().int().openapi({
      example: 5,
    }),
    updatedAt: z.iso.datetime().openapi({
      example: '2026-07-20T12:00:00.000Z',
    }),
  })
  .openapi('TodoResponse');
