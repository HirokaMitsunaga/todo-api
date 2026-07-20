import { OpenAPIHono } from '@hono/zod-openapi';
import type { PrismaClient } from '@prisma/client';

import { createTodoApp } from './command/controller/http/todo/todo.route.js';

export const createApp = (db: Pick<PrismaClient, 'todo' | 'user'>) => {
  const app = new OpenAPIHono({
    defaultHook: (result, c) => {
      if (!result.success) {
        return c.json({ message: 'Validation Error' }, 400);
      }
    },
  });

  app.onError((error, c) => {
    console.error(error);
    return c.json({ message: 'Internal Server Error' }, 503);
  });

  const todoApp = createTodoApp({ prisma: db });
  app.route('/todos', todoApp);

  return app;
};
