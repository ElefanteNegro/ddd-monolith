import { Kafka } from 'kafkajs';
import { container } from '@Shared/infrastructure/container';

const logger = container.logger;

const kafka = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID || 'taxi24-service',
  brokers: [process.env.KAFKA_BROKERS || 'kafka:29092'],
});

export const kafkaProducer = kafka.producer({
  allowAutoTopicCreation: true,
  transactionTimeout: 30000
});

export const connectKafkaProducer = async () => {
  try {
    await kafkaProducer.connect();
    logger.info('[Kafka] Producer conectado exitosamente');

    // Manejo de eventos del producer
    kafkaProducer.on('producer.disconnect', () => {
      logger.warn('[Kafka] Producer desconectado');
    });

    kafkaProducer.on('producer.network.request_timeout', () => {
      logger.error('[Kafka] Timeout en el producer');
    });

  } catch (error) {
    logger.error('[Kafka] Error al conectar el producer', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    throw error;
  }
};
