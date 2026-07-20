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
  const otherUserId = ulid();
  let todoId: string;
  let nextTodoId: string;
  let otherTodoId: string;
  let title: string;
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
    await prisma.user.create({
      data: {
        id: otherUserId,
        name: '別の結合テストユーザー',
        email: `${otherUserId}@example.com`,
        password: 'password',
      },
    });
  });

  beforeEach(async () => {
    todoId = ulid();
    title = `${todoId} 取得対象のTodo`;
    const todo = await prisma.todo.create({
      data: {
        id: todoId,
        title,
        userId,
        status: 'PENDING',
        priority: 5,
      },
    });
    updatedAt = todo.updatedAt;
    nextTodoId = ulid();
    await prisma.todo.create({
      data: {
        id: nextTodoId,
        title: `${nextTodoId} ページング対象のTodo`,
        userId,
        status: 'PENDING',
        priority: 5,
      },
    });
    otherTodoId = ulid();
    await prisma.todo.create({
      data: {
        id: otherTodoId,
        title: `${otherTodoId} 別ユーザーのTodo`,
        userId: otherUserId,
        status: 'PENDING',
        priority: 5,
      },
    });
  });

  afterEach(async () => {
    await prisma.todo.deleteMany({
      where: { id: { in: [todoId, nextTodoId, otherTodoId] } },
    });
  });

  afterAll(async () => {
    await prisma.user.delete({ where: { id: userId } });
    await prisma.user.delete({ where: { id: otherUserId } });
    await prisma.$disconnect();
  });

  it('【正常系】Todoをオブジェクトの配列で取得する', async () => {
    const app = createApp(prisma);

    const response = await app.request(`/todos?userId=${userId}`);

    expect(response.status).toBe(200);
    const body: unknown = await response.json();
    expect(body).toEqual(
      expect.arrayContaining([
        {
          id: todoId,
          title,
          userId,
          status: 'PENDING',
          priority: 5,
          updatedAt: updatedAt.toISOString(),
        },
      ]),
    );
    expect(body).not.toEqual(
      expect.arrayContaining([expect.objectContaining({ id: otherTodoId })]),
    );
  });

  it('【正常系】titleで部分一致検索したTodoを取得する', async () => {
    const app = createApp(prisma);

    const response = await app.request(
      `/todos?userId=${userId}&title=${todoId}`,
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual([
      expect.objectContaining({
        id: todoId,
        title,
      }),
    ]);
  });

  it('【正常系】pageとページサイズを指定してTodoを取得する', async () => {
    const app = createApp(prisma);
    const [expectedTodo] = await prisma.todo.findMany({
      where: { userId },
      orderBy: { id: 'asc' },
      skip: 1,
      take: 1,
    });

    const response = await app.request(
      `/todos?userId=${userId}&limit=1&page=2`,
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual([
      expect.objectContaining({ id: expectedTodo?.id }),
    ]);
  });

  // PostgreSQLにはSELECTトリガーがないため、テーブル名を一時的に変更して取得エラーを再現する
  it('【異常系】DBエラーが発生すると503とエラー形式を返す', async () => {
    const app = createApp(prisma);
    await prisma.$executeRawUnsafe(
      'ALTER TABLE "Todo" RENAME TO "TodoForReadError";',
    );

    try {
      const response = await app.request(`/todos?userId=${userId}`);

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
