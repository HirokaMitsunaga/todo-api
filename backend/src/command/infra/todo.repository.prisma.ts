import { Prisma, type PrismaClient } from '@prisma/client';
import type { ITodoRepository } from '../domain/todo/repository/todo-repository.interface.js';
import { EntityId } from '../domain/todo/entity-id.vo.js';
import { PriorityVO } from '../domain/todo/priority.vo.js';
import { Todo } from '../domain/todo/todo.entity.js';
import { TitleVO } from '../domain/todo/title.vo.js';
import { NotFoundRepositoryError } from '../domain/todo/repository/todo-repository-error.js';
export class TodoRepositoryPrisma implements ITodoRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findByUserId({
    userId,
  }: {
    userId: EntityId;
  }): Promise<Todo | undefined> {
    const todoEntity = await this.prisma.todo.findFirst({
      where: {
        userId: userId.getEntityId(),
      },
    });
    if (!todoEntity) {
      return undefined;
    }
    return Todo.reconstruct({
      id: EntityId.reconstruct({ entityId: todoEntity.id }),
      title: TitleVO.reconstruct(todoEntity.title),
      status: todoEntity.status,
      userId: EntityId.reconstruct({ entityId: todoEntity.userId }),
      priority: PriorityVO.reconstruct(todoEntity.priority),
    });
  }

  async save({ todo }: { todo: Todo }): Promise<void> {
    await this.prisma.todo.create({
      data: {
        id: todo.getId().getEntityId(),
        title: todo.getTitle().getValue(),
        status: todo.getStatus(),
        userId: todo.getUserId().getEntityId(),
        priority: todo.getPriority().getValue(),
      },
    });
  }

  async update({ todo }: { todo: Todo }): Promise<void> {
    try {
      await this.prisma.todo.update({
        where: {
          id: todo.getId().getEntityId(),
        },
        data: {
          title: todo.getTitle().getValue(),
          status: todo.getStatus(),
          userId: todo.getUserId().getEntityId(),
          priority: todo.getPriority().getValue(),
        },
      });
    } catch (error) {
      this.handlePrismaError({ error, entityId: todo.getId() });
    }
  }

  async delete({ todo }: { todo: Todo }): Promise<void> {
    try {
      await this.prisma.todo.delete({
        where: {
          id: todo.getId().getEntityId(),
        },
      });
    } catch (error) {
      this.handlePrismaError({ error, entityId: todo.getId() });
    }
  }

  private handlePrismaError({
    error,
    entityId,
  }: {
    error: unknown;
    entityId: EntityId;
  }): never {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      throw new NotFoundRepositoryError(entityId, {
        cause: error,
      });
    }

    throw error;
  }
}
