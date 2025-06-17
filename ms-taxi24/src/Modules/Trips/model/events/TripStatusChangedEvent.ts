import { DomainEvent } from '@Modules/Shared/domain/DomainEvent';
import { TripDTO } from '../TripDTO';

export class TripStatusChangedEvent extends DomainEvent {
  constructor(
    public readonly trip: TripDTO,
    public readonly previousStatus: string,
    public readonly newStatus: string,
    aggregateId: string = trip.id
  ) {
    super('TripStatusChangedEvent', aggregateId);
  }
} 