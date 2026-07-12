export class PriorityVO {
  private readonly value: number;
  private constructor(value: number) {
    this.value = value;
  }

  public static create(value: number): PriorityVO {
    if (value < 1 || value > 10) {
      throw new Error('Priority must be between 1 and 10');
    }
    return new PriorityVO(value);
  }
  public static reconstruct(value: number): PriorityVO {
    return new PriorityVO(value);
  }
  public getValue(): number {
    return this.value;
  }
}
