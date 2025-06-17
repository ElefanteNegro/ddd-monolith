import { DriverCreatedEvent } from '@Modules/Drivers/model/events/DriverCreatedEvent';
import { kafkaProducer } from '@Shared/infrastructure/kafka/producer';

export const handleDriverCreated = async (event: DriverCreatedEvent) => {
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
