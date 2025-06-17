import { BaseDomainEvent } from '@Modules/Shared/domain/events/DomainEvent';
import { TripDTO } from '../../model/TripDTO';

export class TripStatusChangedEvent extends BaseDomainEvent {
  constructor(
    public readonly trip: TripDTO,
    public readonly previousStatus: string,
    public readonly newStatus: string
  ) {
    super();
  }
} 