import { DomainEvent } from '@Shared/domain/events/DomainEvent';

export interface KafkaMessage<T = any> {
  topic: string;
  value: T;
  headers?: Record<string, string>;
}

export interface KafkaEventHandler<T = any> {
  handle(message: T): Promise<void>;
}

export interface KafkaEventPublisher {
  publish(event: DomainEvent): Promise<void>;
}

export interface KafkaEventSubscriber {
  subscribe(topic: string, handler: KafkaEventHandler): void;
  unsubscribe(topic: string): void;
} 