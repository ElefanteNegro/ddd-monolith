import { DomainEvent } from '@Shared/domain/DomainEvent';
import { UserInterface } from '../interfaces/UserInterface';

export class UserCreatedEvent extends DomainEvent {
  constructor(
    public readonly user: UserInterface,
    public readonly occurredOn: Date = new Date()
  ) {
    super('UserCreatedEvent', user.id || '');
  }
}
