import { Server } from './server';
import { connectKafkaProducer } from '@Shared/infrastructure/kafka/producer';
import { startKafkaConsumer } from '@Shared/infrastructure/kafka/consumer';
import { registerDomainEvents } from '@Shared/domain/RegisterDomainEvents';
import { prisma } from '@Modules/Shared/infrastructure/prisma/client';
import { container } from '@Shared/infrastructure/container';

const PORT = process.env.PORT || '3000';
const logger = container.logger;

async function main() {
  try {
    await prisma.$connect();
    logger.info('Database connection established successfully');

    await connectKafkaProducer();
    await startKafkaConsumer(); 
    registerDomainEvents();

    const server = new Server(PORT);
    await server.listen();

    process.on('uncaughtException', (error) => {
      logger.error('Uncaught Exception:', error);
    });

    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
    });

    process.on('SIGINT', async () => {
      logger.info('Initiating graceful shutdown...');
      await prisma.$disconnect();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      logger.info('Initiating graceful shutdown...');
      await prisma.$disconnect();
      process.exit(0);
    });

  } catch (error) {
    logger.error('Failed to start server:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

main();
