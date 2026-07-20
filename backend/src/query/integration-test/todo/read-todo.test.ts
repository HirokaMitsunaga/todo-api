import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
} from 'vitest';
import { ulid } from 'ulid';

import { createApp } from '../../../app.js';

if (!process.env.DATABASE_URL) {
  process.loadEnvFile(new URL('../../../../.env', import.meta.url));
}

const { prisma } = await import('../../../prisma.js');

describe('read-todo', () => {
  const userId = ulid();
  let todoId: string;
  let updatedAt: Date;

  beforeAll(async () => {
    await prisma.user.create({
      data: {
        id: userId,
        name: '結合テストユーザー',
        email: `${userId}@example.com`,
        password: 'password',
      },
    });
  });

  beforeEach(async () => {
    todoId = ulid();
    const todo = await prisma.todo.create({
      data: {
        id: todoId,
        title: '取得対象のTodo',
        userId,
        status: 'PENDING',
        priority: 5,
      },
    });
    updatedAt = todo.updatedAt;
  });

  afterEach(async () => {
    await prisma.todo.deleteMany({ where: { id: todoId } });
  });

  afterAll(async () => {
    await prisma.user.delete({ where: { id: userId } });
    await prisma.$disconnect();
  });

  it('【正常系】Todoをオブジェクトの配列で取得する', async () => {
    const app = createApp(prisma);

    const response = await app.request('/todos');

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual(
      expect.arrayContaining([
        {
          id: todoId,
          title: '取得対象のTodo',
          userId,
          status: 'PENDING',
          priority: 5,
          updatedAt: updatedAt.toISOString(),
        },
      ]),
    );
  });

  it('【正常系】ページサイズを指定してTodoを取得する', async () => {
    const app = createApp(prisma);

    const response = await app.request('/todos?limit=1&offset=0');

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toHaveLength(1);
  });

  // PostgreSQLにはSELECTトリガーがないため、テーブル名を一時的に変更して取得エラーを再現する
  it('【異常系】DBエラーが発生すると503とエラー形式を返す', async () => {
    const app = createApp(prisma);
    await prisma.$executeRawUnsafe(
      'ALTER TABLE "Todo" RENAME TO "TodoForReadError";',
    );

    try {
      const response = await app.request('/todos');

      expect(response.status).toBe(503);
      await expect(response.json()).resolves.toEqual({
        message: 'Internal Server Error',
      });
    } finally {
      await prisma.$executeRawUnsafe(
        'ALTER TABLE "TodoForReadError" RENAME TO "Todo";',
      );
    }
  });
});
