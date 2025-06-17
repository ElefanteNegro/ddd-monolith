import { DomainEvent } from "@Shared/domain/DomainEvent";

export class DriverCreatedEvent extends DomainEvent {
  constructor(
    public readonly uuid: string,
    public readonly email: string
  ) {
    super("DriverCreatedEvent", uuid);
  }
}
