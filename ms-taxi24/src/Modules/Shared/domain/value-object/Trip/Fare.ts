import { ValueObject } from '../ValueObject';
import { ValueObjectException } from '../../exceptions/ValueObjectException';

export class Fare extends ValueObject<number> {
  constructor(value: number) {
    super(value);
    this.ensureIsPositive(value);
  }

  private ensureIsPositive(value: number): void {
    if (value < 0) {
      throw new ValueObjectException('Fare must be a positive number');
    }
  }
}
