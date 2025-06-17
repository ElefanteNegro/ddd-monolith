import { ValueObject } from '../ValueObject';

export class Phone extends ValueObject<string> {
  constructor(value: string) {
    super(value);
    this.ensureValueIsDefined(value);
    this.ensureIsValidPhone(value);
  }

  private ensureIsValidPhone(value: string): void {
    if (!value || value.trim().length === 0) {
      throw new Error('Phone number must be defined');
    }
    // Aquí podríamos agregar más validaciones específicas para números de teléfono
  }
} 