import WinstonLogger from './WinstoneLogger';
import { DriverController } from '@Modules/Drivers/infrastructure/controllers/DriverController';
import { DriverService } from '@Modules/Drivers/application/services/DriverService';
import { DriverRepository } from '@Modules/Drivers/infrastructure/repositories/DriverRepository';
import { PrismaSingleton } from './prisma/client';

const logger = new WinstonLogger();
const driverRepository = new DriverRepository(PrismaSingleton.getInstance(), logger);
const driverService = new DriverService(driverRepository, logger);
const driverController = new DriverController(driverService, logger);

export const container = {
  logger,
  driverController
}; 