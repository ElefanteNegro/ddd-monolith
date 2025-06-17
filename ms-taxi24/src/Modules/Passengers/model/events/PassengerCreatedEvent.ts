import { DomainEvent } from '@Shared/domain/DomainEvent';

export class PassengerCreatedEvent extends DomainEvent {
  constructor(
    public readonly id: string,
    public readonly userId: string
  ) {
    super('PassengerCreatedEvent', id);
  }
}
