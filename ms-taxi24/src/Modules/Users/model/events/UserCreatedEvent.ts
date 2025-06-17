import { DomainEvent } from '@Shared/domain/DomainEvent';

export class UserCreatedEvent extends DomainEvent {
  constructor(
    public readonly uuid: string,
    public readonly email: string
  ) {
    super('UserCreatedEvent', uuid);
  }
}
