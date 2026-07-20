import type { TodoStatus } from '../../command/domain/todo/todo-status.js';

type TodoReadModel = {
  id: string;
  title: string;
  userId: string;
  status: TodoStatus;
  priority: number;
  updatedAt: Date;
};

export type FindTodosInput = {
  limit: number;
  cursor?: string;
};

export type FindTodosOutput = {
  todos: TodoReadModel[];
  nextCursor?: string;
};

export interface TodoQueryService {
  findAll({ limit, cursor }: FindTodosInput): Promise<FindTodosOutput>;
}
