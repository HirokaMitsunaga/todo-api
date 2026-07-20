import type {
  TodoQueryService,
  TodoReadModel,
} from '../../todo/todo-query-service.interface.js';

export class ReadTodoUseCase {
  constructor(private readonly todoQueryService: TodoQueryService) {}

  async execute(): Promise<TodoReadModel[]> {
    return await this.todoQueryService.findAll();
  }
}
