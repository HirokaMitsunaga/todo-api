import type { PrismaClient } from '@prisma/client';
import type {
  TodoQueryService,
  FindTodosInput,
  TodoReadModel,
} from '../todo/todo-query-service.interface.js';

export class TodoQueryServicePrisma implements TodoQueryService {
  constructor(private readonly prisma: Pick<PrismaClient, 'todo'>) {}

  async findAllByUser({
    userId,
    limit,
    offset,
    title,
  }: FindTodosInput): Promise<TodoReadModel[]> {
    const todos = await this.prisma.todo.findMany({
      take: limit,
      skip: offset,
      where: {
        userId,
        ...(title
          ? {
              title: {
                contains: title,
              },
            }
          : {}),
      },
      orderBy: {
        id: 'asc',
      },
      select: {
        id: true,
        title: true,
        userId: true,
        status: true,
        priority: true,
        updatedAt: true,
      },
    });

    return todos;
  }
}
