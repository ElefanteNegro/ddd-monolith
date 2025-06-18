import { Kafka } from 'kafkajs';
import { container } from '@Shared/infrastructure/container';
import { KafkaEventHandler } from './types';

const logger = container.logger;

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

export class KafkaEventRegistry {
  private static handlers: Map<string, KafkaEventHandler> = new Map();
  private static topics: Set<string> = new Set();

  static register(topic: string, handler: KafkaEventHandler): void {
    this.handlers.set(topic, handler);
    this.topics.add(topic);
    logger.info('[Kafka] Handler registrado para tópico', { topic });
  }

  static registerTopics(topics: string[]): void {
    topics.forEach(topic => this.topics.add(topic));
    logger.info('[Kafka] Tópicos registrados', { topics });
  }

  static getHandler(topic: string): KafkaEventHandler | undefined {
    return this.handlers.get(topic);
  }

  static hasHandler(topic: string): boolean {
    return this.handlers.has(topic);
  }

  static getAllTopics(): string[] {
    return Array.from(this.topics);
  }
}

const handleMessage = async (topic: string, content: string): Promise<void> => {
  try {
    const eventData = JSON.parse(content);
    const handler = KafkaEventRegistry.getHandler(topic);

    if (!handler) {
      logger.warn('[Kafka] No hay handler registrado para el tópico', { topic });
      return;
    }

    logger.info('[Kafka] Procesando mensaje', { 
      topic,
      handler: handler.constructor.name
    });

    await handler.handle(eventData);

    logger.info('[Kafka] Mensaje procesado exitosamente', { topic });
  } catch (error) {
    logger.error('[Kafka] Error procesando mensaje', {
      topic,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    throw error;
  }
};

export const startKafkaConsumer = async () => {
  try {
    await consumer.connect();
    logger.info('[Kafka] Consumer conectado exitosamente');

    // Los dominios deben registrar sus handlers antes de llamar a startKafkaConsumer
    // Esto se hace en el archivo principal de la aplicación

    const allTopics = KafkaEventRegistry.getAllTopics();

    for (const topic of allTopics) {
      if (KafkaEventRegistry.hasHandler(topic)) {
        await consumer.subscribe({ topic, fromBeginning: true });
        logger.info('[Kafka] Suscrito al tópico', { topic });
      } else {
        logger.warn('[Kafka] Tópico sin handler registrado, no se suscribirá', { topic });
      }
    }

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const content = message.value?.toString();
          if (!content) {
            logger.warn('[Kafka] Mensaje recibido sin contenido', { topic, partition });
            return;
          }

          logger.info('[Kafka] Evento recibido', { 
            topic, 
            partition,
            messageId: message.headers?.messageId?.toString() || 'unknown'
          });

          await handleMessage(topic, content);
        } catch (error) {
          logger.error('[Kafka] Error en el procesamiento del mensaje', {
            topic,
            partition,
            error: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined
          });
          // Aquí podríamos implementar una lógica de retry o dead letter queue
        }
      },
    });

    // Manejo de eventos del consumer
    consumer.on('consumer.disconnect', () => {
      logger.warn('[Kafka] Consumer desconectado');
    });

    consumer.on('consumer.network.request_timeout', () => {
      logger.error('[Kafka] Timeout en el consumer');
    });

  } catch (error) {
    logger.error('[Kafka] Error al iniciar el consumer', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    throw error;
  }
};
