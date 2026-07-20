import type { EntityId } from '../../domain/todo/entity-id.vo.js';

export class NotFoundUsecaseError extends Error {
  constructor(entityId: EntityId, options?: ErrorOptions) {
    super(`User: ${entityId.getEntityId()} not found`, options);
    this.name = new.target.name;
    Error.captureStackTrace?.(this, new.target);
  }
}
