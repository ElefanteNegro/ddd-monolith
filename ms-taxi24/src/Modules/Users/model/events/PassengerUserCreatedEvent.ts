import { DomainEvent } from '@Shared/domain/DomainEvent';
import { UserInterface } from '../interfaces/UserInterface';

export class PassengerUserCreatedEvent extends DomainEvent {
  constructor(
    public readonly user: UserInterface,
    public readonly occurredOn: Date = new Date()
  ) {
    super('PassengerUserCreatedEvent', user.id || '');
  }
} 