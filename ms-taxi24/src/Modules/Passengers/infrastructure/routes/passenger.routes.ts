import { Router, Request, Response } from 'express';
import { PassengerController } from '../controllers/PassengerController';
import { PassengerService } from '../../application/services/PassengerService';
import { PassengerRepository } from '../repositories/PassengerRepository';
import WinstonLogger from '@Shared/infrastructure/WinstoneLogger';
import { prisma } from '@Shared/infrastructure/prisma/client';

const router = Router();
const logger = new WinstonLogger();

const passengerRepository = new PassengerRepository(prisma, logger);
const passengerService = new PassengerService(passengerRepository, logger);
const passengerController = new PassengerController(passengerService, logger);

router.get('/', (req: Request, res: Response) => passengerController.getAllPassengers(req, res));
router.get('/:userId', (req: Request, res: Response) => passengerController.getPassengerById(req, res));

export default router;
