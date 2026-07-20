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
  limit: number;
  offset: number;
};

export interface TodoQueryService {
  findAll(input: FindTodosInput): Promise<TodoReadModel[]>;
}
