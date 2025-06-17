import { ValueObject } from '../ValueObject';
import { ValueObjectException } from '../../exceptions/ValueObjectException';
import { TripStatus } from '@prisma/client';

export class Status extends ValueObject<TripStatus> {
  constructor(value: TripStatus) {
    super(value);
    this.ensureIsValidStatus(value);
  }

  private ensureIsValidStatus(value: TripStatus): void {
    if (!Object.values(TripStatus).includes(value)) {
      throw new ValueObjectException(`Invalid status: ${value}`);
    }
  }
}
