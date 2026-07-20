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
    const body = (await response.json()) as {
      todos: unknown[];
      nextCursor?: string;
    };

    expect(response.status).toBe(200);
    expect(body.todos).toEqual(
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

  it('【正常系】カーソルを使って次のページのTodoを取得する', async () => {
    const app = createApp(prisma);
    const secondTodoId = ulid();
    await prisma.todo.create({
      data: {
        id: secondTodoId,
        title: '次ページのTodo',
        userId,
        status: 'PENDING',
        priority: 5,
      },
    });

    try {
      const response = await app.request('/todos?limit=1');
      const { todos, nextCursor } = (await response.json()) as {
        todos: { id: string }[];
        nextCursor?: string;
      };
      const nextResponse = await app.request(
        `/todos?limit=1&cursor=${nextCursor}`,
      );
      const { todos: nextTodos } = (await nextResponse.json()) as {
        todos: { id: string }[];
        nextCursor?: string;
      };

      expect(response.status).toBe(200);
      expect(todos).toHaveLength(1);
      expect(nextCursor).toEqual(expect.any(String));
      expect(nextResponse.status).toBe(200);
      expect(nextTodos).toHaveLength(1);
      expect(nextTodos[0].id).not.toBe(todos[0].id);
    } finally {
      await prisma.todo.delete({ where: { id: secondTodoId } });
    }
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
