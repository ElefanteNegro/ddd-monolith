import { PassengerCreatedEvent } from '@Modules/Passengers/model/events/PassengerCreatedEvent';
import { kafkaProducer } from '@Shared/infrastructure/kafka/producer';

export const handlePassengerCreated = async (event: PassengerCreatedEvent) => {
  await kafkaProducer.send({
    topic: 'ms-taxi24-events',
    messages: [
      {
        key: event.aggregateId,
        value: JSON.stringify({
          id: event.id,
          userId: event.userId,
          createdAt: event.occurredOn
        })
      }
    ]
  });
}; 