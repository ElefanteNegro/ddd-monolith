import { ValueObject } from '../ValueObject';
import { ValueObjectException } from '../../exceptions/ValueObjectException';

export class Origin extends ValueObject<string> {
  constructor(value: string) {
    super(value);
    this.ensureIsValid(value);
  }

  private ensureIsValid(value: string): void {
    if (!value || value.trim().length === 0) {
      throw new ValueObjectException('Origin cannot be empty');
    }
    if (value.trim().length < 3) {
      throw new ValueObjectException('Origin must have more than 3 characters');
    }
  }
}
