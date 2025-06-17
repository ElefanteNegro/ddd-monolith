export abstract class DomainEvent {
    public readonly eventName: string;
    public readonly aggregateId: string;
    public readonly occurredOn: Date;
  
    constructor(eventName: string, aggregateId: string, occurredOn: Date = new Date()) {
      this.eventName = eventName;
      this.aggregateId = aggregateId;
      this.occurredOn = occurredOn;
    }
}