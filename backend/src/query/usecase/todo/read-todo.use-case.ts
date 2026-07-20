import type {
  TodoQueryService,
  ReadTodosInput,
  TodoReadModel,
} from '../../todo/todo-query-service.interface.js';

export class ReadTodoUseCase {
  constructor(private readonly todoQueryService: TodoQueryService) {}

  async execute({
    userId,
    limit,
    page,
    title,
  }: ReadTodosInput): Promise<TodoReadModel[]> {
    return await this.todoQueryService.findAllByUser({
      userId,
      limit,
      offset: (page - 1) * limit,
      title,
    });
  }
}
