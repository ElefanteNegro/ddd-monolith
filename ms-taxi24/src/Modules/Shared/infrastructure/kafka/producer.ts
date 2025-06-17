import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'taxi24-service',
  brokers: [process.env.KAFKA_BROKERS || 'kafka:29092'],
});

export const kafkaProducer = kafka.producer();

export const connectKafkaProducer = async () => {
  await kafkaProducer.connect();
  console.log('[Kafka] Producer connected');
};
