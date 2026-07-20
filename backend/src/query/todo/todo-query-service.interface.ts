import type { TodoStatus } from '../../command/domain/todo/todo-status.js';

export type TodoReadModel = {
  id: string;
  title: string;
  userId: string;
  status: TodoStatus;
  priority: number;
  updatedAt: Date;
};

export interface TodoQueryService {
  findAll(): Promise<TodoReadModel[]>;
}
