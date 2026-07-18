import { EntityId } from '../entity-id.vo.js';
import type { PriorityVO } from '../priority.vo.js';
import type { TitleVO } from '../title.vo.js';
import type { TodoStatus } from '../todo-status.js';
import { Todo } from '../todo.entity.js';

export type TodoParams = {
  title: TitleVO;
  status: TodoStatus;
  userId: EntityId;
  priority: PriorityVO;
};

export interface ITodoRepository {
  findById({ id }: { id: EntityId }): Promise<Todo | undefined>;
  create(params: { todo: Todo }): Promise<void>;
  update(params: { todo: Todo }): Promise<void>;
  delete(params: { todo: Todo }): Promise<void>;
}
