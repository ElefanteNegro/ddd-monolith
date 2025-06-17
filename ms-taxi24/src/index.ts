import { Server } from './server';
import { connectKafkaProducer } from '@Shared/infrastructure/kafka/producer';
import { startKafkaConsumer } from '@Shared/infrastructure/kafka/consumer';
import { registerDomainEvents } from '@Shared/domain/RegisterDomainEvents';
import { prisma } from '@Modules/Shared/infrastructure/prisma/client';

const PORT = process.env.PORT || '3000';

async function main() {
  try {
    // Conectar a Prisma
    await prisma.connect();
    console.log('Database connection established');

    // Iniciar otros servicios
    await connectKafkaProducer();
    await startKafkaConsumer(); 
    registerDomainEvents();

    const server = new Server(PORT);
    await server.listen();
    console.log(`Server running on port ${PORT}`);

    // Manejar el cierre de la aplicación
    process.on('SIGINT', async () => {
      console.log('Shutting down server...');
      await prisma.disconnect();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      console.log('Shutting down server...');
      await prisma.disconnect();
      process.exit(0);
    });

  } catch (error) {
    console.error('Error starting the server:', error);
    await prisma.disconnect();
    process.exit(1);
  }
}

main();
