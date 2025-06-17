import { Router, Request, Response } from 'express';
import { DriverLocationController } from '../controllers/DriverLocationController';
import { DriverLocationService } from '../../application/services/DriverLocationService';
import { RedisDriverLocationRepository } from '../repositories/RedisDriverLocationRepository';
import { container } from '@Shared/infrastructure/container';
import { asyncHandler } from '@Shared/infrastructure/middleware/asyncHandler';

const router = Router();
const { logger } = container;

const driverLocationRepository = new RedisDriverLocationRepository(logger);
const driverLocationService = new DriverLocationService(driverLocationRepository, logger);
const driverLocationController = new DriverLocationController(driverLocationService, logger);

router.get('/nearest', asyncHandler((req: Request, res: Response) => driverLocationController.findNearestDrivers(req, res)));
router.get('/:driverId/location', asyncHandler((req: Request, res: Response) => driverLocationController.getDriverLocation(req, res)));
router.put('/:driverId/location', asyncHandler((req: Request, res: Response) => driverLocationController.updateDriverLocation(req, res)));
router.patch('/:driverId/status', asyncHandler((req: Request, res: Response) => driverLocationController.updateDriverStatus(req, res)));
router.delete('/:driverId', asyncHandler((req: Request, res: Response) => driverLocationController.removeDriver(req, res)));

export default router;
