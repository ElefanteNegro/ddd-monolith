import { ValueObject } from '../ValueObject';
import { ValueObjectException } from '../../exceptions/ValueObjectException';

export class Destination extends ValueObject<string> {
  constructor(value: string) {
    super(value);
    this.ensureIsValid(value);
  }

  private ensureIsValid(value: string): void {
    if (!value || value.trim().length === 0) {
      throw new ValueObjectException('Destination cannot be empty');
    }
    if (value.trim().length < 3) {
      throw new ValueObjectException(
        'Destination must have more than 3 characters'
      );
    }
  }
}
