import type { TodoStatus } from '../../command/domain/todo/todo-status.js';

export type TodoReadModel = {
  id: string;
  title: string;
  userId: string;
  status: TodoStatus;
  priority: number;
  updatedAt: Date;
};

export type FindTodosInput = {
  userId: string;
  limit: number;
  offset: number;
  title?: string;
};

export type ReadTodosInput = {
  userId: string;
  limit: number;
  page: number;
  title?: string;
};

export interface TodoQueryService {
  findAllByUser(input: FindTodosInput): Promise<TodoReadModel[]>;
}
