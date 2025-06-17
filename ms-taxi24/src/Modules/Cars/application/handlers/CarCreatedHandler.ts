import { CarCreatedEvent } from '@Modules/Cars/model/events/CarCreatedEvent';
import { kafkaProducer } from '@Shared/infrastructure/kafka/producer';

export const handleCarCreated = async (event: CarCreatedEvent) => {
  await kafkaProducer.send({
    topic: 'ms-taxi24-events',
    messages: [
      {
        key: event.aggregateId,
        value: JSON.stringify({
          id: event.id,
          plate: event.plate,
          brand: event.brand,
          model: event.model,
          year: event.year,
          color: event.color,
          driverId: event.driverId,
          createdAt: event.occurredOn
        })
      }
    ]
  });
}; 