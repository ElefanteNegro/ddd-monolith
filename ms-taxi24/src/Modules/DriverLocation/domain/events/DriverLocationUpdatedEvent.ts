import { DomainEvent } from '@Modules/Shared/domain/DomainEvent';

export class DriverLocationUpdatedEvent implements DomainEvent {
  public readonly eventName = 'DriverLocationUpdatedEvent';
  public readonly aggregateId: string;

  constructor(
    public readonly driverId: string,
    public readonly latitude: number,
    public readonly longitude: number,
    public readonly isAvailable: boolean,
    public readonly occurredOn: Date = new Date()
  ) {
    this.aggregateId = driverId;
  }
} 