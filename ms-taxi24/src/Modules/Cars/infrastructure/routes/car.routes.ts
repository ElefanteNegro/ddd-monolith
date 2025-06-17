import { Router, Request, Response } from 'express';
import { CarController } from '../controllers/CarController';
import { CarService } from '../../application/services/CarService';
import { CarRepository } from '../repositories/CarRepository';
import { container } from '@Shared/infrastructure/container';
import { prisma } from '@Shared/infrastructure/prisma/client';
import { asyncHandler } from '@Shared/infrastructure/middleware/asyncHandler';

const router = Router();
const { logger } = container;

const carRepository = new CarRepository(prisma, logger);
const carService = new CarService(carRepository);
const carController = new CarController(carService, logger);

// Car routes
router.post('/cars', asyncHandler((req: Request, res: Response) => carController.createCar(req, res)));
router.get('/cars/:id', asyncHandler((req: Request, res: Response) => carController.getCarById(req, res)));
router.get('/cars/driver/:driverId', asyncHandler((req: Request, res: Response) => carController.getCarsByDriver(req, res)));
router.put('/cars/:id', asyncHandler((req: Request, res: Response) => carController.updateCar(req, res)));
router.delete('/cars/:id', asyncHandler((req: Request, res: Response) => carController.deleteCar(req, res)));

export default router;
