import type { EntityId } from '../../domain/todo/entity-id.vo.js';
import { NotFoundRepositoryError } from '../../domain/user/repository/user-repository-error.js';
import type { IUserRepository } from '../../domain/user/repository/user-repository.interface.js';
import { NotFoundUsecaseError } from './user-usecase-error.js';

type DeleteUserInput = {
  id: EntityId;
};

export class DeleteUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute({ id }: DeleteUserInput): Promise<void> {
    const user = await this.userRepository.findById({ id });

    if (!user) {
      throw new NotFoundUsecaseError(id);
    }

    try {
      await this.userRepository.delete({ user });
    } catch (error: unknown) {
      if (error instanceof NotFoundRepositoryError) {
        throw new NotFoundUsecaseError(id, { cause: error });
      }
      throw error;
    }
  }
}
