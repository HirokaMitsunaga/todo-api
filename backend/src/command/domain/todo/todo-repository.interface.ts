import { EntityId } from './entity-id.vo.js';
import type { PriorityVO } from './priority.vo.js';
import type { TitleVO } from './title.vo.js';
import type { TodoStatus } from './todo-status.js';
import { Todo } from './todo.entitiy.js';

export type TodoParams = {
  title: TitleVO;
  status: TodoStatus;
  userId: EntityId;
  priority: PriorityVO;
  workDate: Date; // 日付の扱いは DateUtil で正規化したものを渡す
};

export interface ITodoRepository {
  findByUserId({ userId }: { userId: EntityId }): Promise<Todo | undefined>;
  save(params: { todo: Todo }): Promise<void>;
  update(params: { todo: Todo }): Promise<void>;
  delete(params: { todo: Todo }): Promise<void>;
}
