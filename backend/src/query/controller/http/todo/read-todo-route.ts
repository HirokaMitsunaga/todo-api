import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';

import type { ReadTodoUseCase } from '../../../usecase/todo/read-todo.use-case.js';
import { TodoResponseSchema } from './todo.schema.js';

const route = createRoute({
  method: 'get',
  path: '/',
  responses: {
    200: {
      description: 'Todos retrieved successfully',
      content: {
        'application/json': {
          schema: z.array(TodoResponseSchema),
        },
      },
    },
    503: {
      description: 'Internal Server Error',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
    },
  },
});

export const readTodoRoute = ({
  app,
  readTodoUseCase,
}: {
  app: OpenAPIHono;
  readTodoUseCase: ReadTodoUseCase;
}) => {
  app.openapi(route, async (c) => {
    const todos = await readTodoUseCase.execute();

    return c.json(
      todos.map((todo) => ({
        id: todo.id,
        title: todo.title,
        userId: todo.userId,
        status: todo.status,
        priority: todo.priority,
        updatedAt: todo.updatedAt.toISOString(),
      })),
      200,
    );
  });
};
