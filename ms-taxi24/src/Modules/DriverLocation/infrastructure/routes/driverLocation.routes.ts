import { Router, Request, Response } from 'express';
import { DriverLocationController } from '../controllers/DriverLocationController';
import { DriverLocationService } from '../../application/services/DriverLocationService';
import { RedisDriverLocationRepository } from '../repositories/RedisDriverLocationRepository';
import WinstonLogger from '@Shared/infrastructure/WinstoneLogger';

const router = Router();
const logger = new WinstonLogger();

const redisDriverLocationRepository = new RedisDriverLocationRepository(logger);
const driverLocationService = new DriverLocationService(redisDriverLocationRepository, logger);
const driverLocationController = new DriverLocationController(driverLocationService, logger);

router.get('/nearest', (req: Request, res: Response) => driverLocationController.findNearestDrivers(req, res));
router.get('/:driverId/location', (req: Request, res: Response) => driverLocationController.getDriverLocation(req, res));
router.put('/:driverId/location', (req: Request, res: Response) => driverLocationController.updateDriverLocation(req, res));
router.patch('/:driverId/status', (req: Request, res: Response) => driverLocationController.updateDriverStatus(req, res));
router.delete('/:driverId', (req: Request, res: Response) => driverLocationController.removeDriver(req, res));

export default router;
