import { DomainEvent } from '@Shared/domain/DomainEvent';

export class TripCompletedEvent extends DomainEvent {
    constructor(
      public readonly tripId: string,
      public readonly passengerId: string,
      public readonly driverId: string,
      public readonly fare: number,
      public readonly completedAt: Date
    ) {
      super('TripCompletedEvent', tripId);
    }
  }
  