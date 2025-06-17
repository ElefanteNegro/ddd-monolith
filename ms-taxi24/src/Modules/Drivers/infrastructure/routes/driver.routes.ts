import { Router, Request, Response } from 'express';
import { DriverController } from '../controllers/DriverController';
import { DriversService } from '../../application/services/DriverService';
import { DriverRepository } from '../repositories/DriverRepository';
import WinstonLogger from '@Shared/infrastructure/WinstoneLogger';
import { prisma } from '@Shared/infrastructure/prisma/client';

const router = Router();
const logger = new WinstonLogger();

const driverRepository = new DriverRepository(prisma, logger);
const driverService = new DriversService(driverRepository, logger);
const driverController = new DriverController(driverService, logger);

router.get('/', (req: Request, res: Response) => driverController.getAllDrivers(req, res));
router.get('/active', (req: Request, res: Response) => driverController.getAllDriversActive(req, res));
router.get('/:driverId', (req: Request, res: Response) => driverController.getDriverById(req, res));
router.post('/', (req: Request, res: Response) => driverController.createDriver(req, res));
router.put('/:driverId', (req: Request, res: Response) => driverController.updateDriver(req, res));
router.delete('/:driverId', (req: Request, res: Response) => driverController.deleteDriver(req, res));
router.post('/:driverId/car', (req: Request, res: Response) => driverController.assignCar(req, res));

export default router;
