import { DriverLocationSeeder } from './DriverLocationSeeder';
import WinstonLogger from '@Modules/Shared/infrastructure/WinstoneLogger';

async function main() {
  const logger = new WinstonLogger();
  const seeder = new DriverLocationSeeder(logger);
  
  try {
    await seeder.seed();
    logger.info('Redis seeding completed successfully');
    process.exit(0);
  } catch (error) {
    logger.error('Error seeding Redis:', error);
    process.exit(1);
  }
}

main(); 