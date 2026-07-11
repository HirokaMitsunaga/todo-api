import { Hono } from 'hono';
import type { PrismaClient } from '@prisma/client';

import { checkDbHealth } from './db-health.js';

export const createApp = (db: Pick<PrismaClient, '$queryRaw'>) => {
  const app = new Hono();

  app.get('/', (c) => {
    return c.text('Hello World');
  });

  app.get('/db/health', async (c) => {
    const result = await checkDbHealth(db);

    return c.json(result);
  });

  return app;
};
