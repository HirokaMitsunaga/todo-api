export class TitleVO {
  private readonly value: string;
  private constructor(value: string) {
    this.value = value;
  }

  public static create(value: string): TitleVO {
    if (value.length < 3 || value.length > 100) {
      throw new Error('Title must be between 3 and 100 characters long');
    }
    return new TitleVO(value);
  }
  public static reconstruct(value: string): TitleVO {
    return new TitleVO(value);
  }

  public getValue(): string {
    return this.value;
  }
}
