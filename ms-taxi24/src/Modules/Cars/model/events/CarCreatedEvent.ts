import { DomainEvent } from '@Shared/domain/DomainEvent';

export class CarCreatedEvent extends DomainEvent {
  constructor(
    public readonly id: string,
    public readonly plate: string,
    public readonly brand: string,
    public readonly model: string,
    public readonly year: number,
    public readonly color: string,
    public readonly driverId: string
  ) {
    super('CarCreatedEvent', id);
  }
} 