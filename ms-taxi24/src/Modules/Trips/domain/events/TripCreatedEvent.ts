import { BaseDomainEvent } from '@Modules/Shared/domain/events/DomainEvent';
import { TripDTO } from '../../model/TripDTO';

export class TripCreatedEvent extends BaseDomainEvent {
  constructor(public readonly trip: TripDTO) {
    super();
  }
} 