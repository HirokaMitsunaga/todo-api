import type { PrismaClient } from '@prisma/client';
import type {
  TodoQueryService,
  TodoReadModel,
} from '../todo/todo-query-service.interface.js';

export class TodoQueryServicePrisma implements TodoQueryService {
  constructor(private readonly prisma: Pick<PrismaClient, 'todo'>) {}

  async findAll(): Promise<TodoReadModel[]> {
    const todos = await this.prisma.todo.findMany({
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
