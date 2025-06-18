import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID || 'taxi24-service',
  brokers: [process.env.KAFKA_BROKERS || 'kafka:29092'],
});

const consumer = kafka.consumer({ 
  groupId: process.env.KAFKA_GROUP_ID || 'taxi24-group',
  sessionTimeout: 30000,
  heartbeatInterval: 3000,
  maxBytesPerPartition: 1048576, // 1MB
});

export const startKafkaConsumer = async () => {
  try {
    await consumer.connect();
    console.log('[Kafka] Consumer conectado');

    const topics = [
      'domain.user.created',
      'domain.user.authenticated',
      'domain.ride.assigned',
      'DriverUserCreatedEvent',
      'DriverCreatedEvent',
      'DriverCreationFailedEvent'
    ];

    for (const topic of topics) {
      await consumer.subscribe({ topic, fromBeginning: true });
      console.log(`[Kafka] Suscrito al tópico: ${topic}`);
    }

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const content = message.value?.toString();
          console.log(`📥 Evento recibido en tópico "${topic}":`, content);
        } catch (error) {
          console.error(`Error procesando mensaje en tópico ${topic}:`, error);
        }
      },
    });
  } catch (error) {
    console.error('[Kafka] Error al iniciar el consumidor:', error);
    throw error;
  }
};
