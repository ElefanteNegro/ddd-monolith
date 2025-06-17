import { DomainEvent } from '@Modules/Shared/domain/DomainEvent';
import { TripDTO } from '../TripDTO';

export class TripCreatedEvent extends DomainEvent {
  constructor(
    public readonly trip: TripDTO,
    aggregateId: string = trip.id
  ) {
    super('TripCreatedEvent', aggregateId);
  }
}
