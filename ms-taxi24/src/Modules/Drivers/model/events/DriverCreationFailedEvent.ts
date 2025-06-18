import { UserDTO } from '@Modules/Users/model/UserDTO';
import { DomainEvent } from '@Shared/domain/events/DomainEvent';

export class DriverCreationFailedEvent implements DomainEvent {
  public readonly eventName = 'DriverCreationFailedEvent';

  constructor(public readonly user: UserDTO) {}
} 