import type {
  TodoQueryService,
  FindTodosInput,
  FindTodosOutput,
} from '../../todo/todo-query-service.interface.js';

export class ReadTodoUseCase {
  constructor(private readonly todoQueryService: TodoQueryService) {}

  async execute({ limit, cursor }: FindTodosInput): Promise<FindTodosOutput> {
    return await this.todoQueryService.findAll({ limit, cursor });
  }
}
