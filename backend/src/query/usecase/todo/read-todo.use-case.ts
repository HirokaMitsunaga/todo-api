import type {
  TodoQueryService,
  FindTodosInput,
  TodoReadModel,
} from '../../todo/todo-query-service.interface.js';

export class ReadTodoUseCase {
  constructor(private readonly todoQueryService: TodoQueryService) {}

  async execute(input: FindTodosInput): Promise<TodoReadModel[]> {
    return await this.todoQueryService.findAll(input);
  }
}
