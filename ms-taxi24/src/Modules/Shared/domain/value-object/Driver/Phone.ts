import { ValueObject } from '../ValueObject';
import { ValueObjectException } from '../../exceptions/ValueObjectException';

export class Phone extends ValueObject<string> {
  constructor(value: string) {
    super(value);
    this.ensureIsValid(value);
  }

  private ensureIsValid(phone: string): void {
    const trimmed = phone.trim();

    if (trimmed.length === 0) {
      throw new ValueObjectException('Phone number cannot be empty');
    }

    if (trimmed.length < 7) {
      throw new ValueObjectException(
        'Phone number must have at least 7 digits'
      );
    }

    const phoneRegex = /^[\d+()\s-]+$/;
    if (!phoneRegex.test(trimmed)) {
      throw new ValueObjectException(
        'Phone number contains invalid characters'
      );
    }
  }
}
