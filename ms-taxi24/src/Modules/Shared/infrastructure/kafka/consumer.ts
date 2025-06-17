import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'taxi24-logger',
  brokers: [process.env.KAFKA_BROKERS || 'kafka:29092'],
});

const consumer = kafka.consumer({ groupId: 'event-logger-group' });

export const startKafkaConsumer = async () => {
  await consumer.connect();
  console.log('[Kafka] Consumer conectado');

  const topics = [
    'ms-taxi24-events',
    'user-events',
    'domain.events',
    'user.authenticated',
    'ride.assigned',
  ];

  for (const topic of topics) {
    await consumer.subscribe({ topic, fromBeginning: true });
  }

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const content = message.value?.toString();
      console.log(`📥 Evento recibido en tópico "${topic}":`, content);
    },
  });
};
