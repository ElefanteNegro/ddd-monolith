import { Router, Request, Response } from 'express';
import { TripController } from '../controllers/TripController';
import { TripService } from '../../application/services/TripService';
import { TripRepository } from '../repositories/TripRepository';
import { container } from '@Shared/infrastructure/container';
import { prisma } from '@Shared/infrastructure/prisma/client';
import { asyncHandler } from '@Shared/infrastructure/middleware/asyncHandler';

const router = Router();
const { logger } = container;

const tripRepository = new TripRepository(prisma, logger);
const tripService = new TripService(tripRepository, logger);
const tripController = new TripController(tripService, logger);

router.post('/', asyncHandler((req: Request, res: Response) => tripController.createTrip(req, res)));
router.get('/', (req: Request, res: Response) => tripController.getAllTrips(req, res));
router.get('/:tripId', asyncHandler((req: Request, res: Response) => tripController.getTripById(req, res)));
router.put('/:tripId', asyncHandler((req: Request, res: Response) => tripController.updateTrip(req, res)));
router.delete('/:tripId', asyncHandler((req: Request, res: Response) => tripController.deleteTrip(req, res)));

export default router;
