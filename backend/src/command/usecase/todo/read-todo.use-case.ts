import type { Todo } from '../../domain/todo/todo.entity.js';
import type { ITodoRepository } from '../../domain/todo/repository/todo-repository.interface.js';

export class ReadTodoUseCase {
  constructor(private readonly todoRepository: ITodoRepository) {}

  async execute(): Promise<Todo[]> {
    return await this.todoRepository.findAll();
  }
}
