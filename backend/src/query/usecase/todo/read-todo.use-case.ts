import type {
  TodoQueryService,
  FindTodosOutput,
  ReadTodosInput,
} from '../../todo/todo-query-service.interface.js';

export class ReadTodoUseCase {
  constructor(private readonly todoQueryService: TodoQueryService) {}

  async execute({
    userId,
    limit,
    cursor,
    title,
  }: ReadTodosInput): Promise<FindTodosOutput> {
    return await this.todoQueryService.findAllByUser({
      userId,
      limit,
      cursor,
      title,
    });
  }
}
