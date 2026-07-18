import type { EntityId } from '../entity-id.vo.js';

export abstract class RepositoryError extends Error {
  protected constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = new.target.name;
    Error.captureStackTrace?.(this, new.target);
  }
}

export class NotFoundRepositoryError extends RepositoryError {
  constructor(entityId: EntityId, options?: ErrorOptions) {
    super(`Todo ${entityId.getEntityId()} not found`, options);
  }
}
