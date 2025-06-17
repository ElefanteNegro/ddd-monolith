import WinstonLogger from './WinstoneLogger';
import { DriverController } from '@Modules/Drivers/infrastructure/controllers/DriverController';
import { DriverService } from '@Modules/Drivers/application/services/DriverService';
import { DriverRepository } from '@Modules/Drivers/infrastructure/repositories/DriverRepository';
import { PassengerService } from '@Modules/Passengers/application/services/PassengerService';
import { PassengerRepository } from '@Modules/Passengers/infrastructure/repositories/PassengerRepository';
import { PrismaSingleton } from './prisma/client';

const logger = WinstonLogger.getInstance();
const prisma = PrismaSingleton.getInstance();

const driverRepository = new DriverRepository(prisma, logger);
const driverService = new DriverService(driverRepository, logger);
const driverController = new DriverController(driverService, logger);

const passengerRepository = new PassengerRepository(prisma, logger);
const passengerService = new PassengerService(passengerRepository, logger);

export const container = {
  logger,
  prisma,
  driverController,
  driverService,
  passengerService
}; 