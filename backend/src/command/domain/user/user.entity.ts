import { EntityId } from '../todo/entity-id.vo.js';

type UserParams = {
  id: EntityId;
  name: string;
  email: string;
};

export class User {
  private readonly id: EntityId;
  private readonly name: string;
  private readonly email: string;
  private constructor({ id, name, email }: UserParams) {
    this.id = id;
    this.name = name;
    this.email = email;
  }

  public static create({ name, email }: UserParams): User {
    return new User({
      id: EntityId.generate(),
      name,
      email,
    });
  }

  public static reconstruct({ id, name, email }: UserParams): User {
    return new User({
      id: EntityId.reconstruct({ entityId: id.getEntityId() }),
      name,
      email,
    });
  }

  getName(): string {
    return this.name;
  }

  getEmail(): string {
    return this.email;
  }

  getId(): EntityId {
    return this.id;
  }
}
