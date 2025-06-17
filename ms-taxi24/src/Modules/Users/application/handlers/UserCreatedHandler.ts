import { UserCreatedEvent } from '@Modules/Users/model/events/UserCreatedEvent';
import { kafkaProducer } from '@Shared/infrastructure/kafka/producer';

export const handleUserCreated = async (event: UserCreatedEvent) => {
  await kafkaProducer.send({
    topic: 'ms-taxi24-events',
    messages: [
      {
        key: event.aggregateId,
        value: JSON.stringify({
          uuid: event.uuid,
          email: event.email,
          createdAt: event.occurredOn
        })
      }
    ]
  });
};
