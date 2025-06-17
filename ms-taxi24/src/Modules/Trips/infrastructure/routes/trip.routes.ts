import { Router, Request, Response } from 'express';
import { TripController } from '../controllers/TripController';
import { TripService } from '../../application/services/TripService';
import { TripRepository } from '../repositories/TripRepository';
import WinstonLogger from '@Shared/infrastructure/WinstoneLogger';
import { prisma } from '@Shared/infrastructure/prisma/client';

const router = Router();
const logger = new WinstonLogger();

const tripRepository = new TripRepository(prisma, logger);
const tripService = new TripService(tripRepository, logger);
const tripController = new TripController(tripService, logger);

router.post('/', (req: Request, res: Response) => tripController.createTrip(req, res));
router.get('/', (req: Request, res: Response) => tripController.getAllTrips(req, res));
router.get('/:tripId', (req: Request, res: Response) => tripController.getTripById(req, res));
router.put('/:tripId', (req: Request, res: Response) => tripController.updateTrip(req, res));
router.delete('/:tripId', (req: Request, res: Response) => tripController.deleteTrip(req, res));

export default router;
