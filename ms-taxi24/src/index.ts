import { Server } from './server';
import { connectKafkaProducer } from '@Shared/infrastructure/kafka/producer';
import { startKafkaConsumer } from '@Shared/infrastructure/kafka/consumer';
import { registerDomainEvents } from '@Shared/domain/RegisterDomainEvents';
import { prisma } from '@Modules/Shared/infrastructure/prisma/client';

const PORT = process.env.PORT || '3000';

async function main() {
  try {
    await prisma.connect();
    console.log('Database connection established successfully');

    await connectKafkaProducer();
    await startKafkaConsumer(); 
    registerDomainEvents();

    const server = new Server(PORT);
    await server.listen();

    process.on('SIGINT', async () => {
      console.log('Initiating graceful shutdown...');
      await prisma.disconnect();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      console.log('Initiating graceful shutdown...');
      await prisma.disconnect();
      process.exit(0);
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    await prisma.disconnect();
    process.exit(1);
  }
}

main();
