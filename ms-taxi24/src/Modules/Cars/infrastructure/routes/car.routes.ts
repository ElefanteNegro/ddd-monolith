import { Router, Request, Response } from 'express';
import { CarController } from '../controllers/CarController';
import { CarService } from '../../application/services/CarService';
import { CarRepository } from '../repositories/CarRepository';
import WinstonLogger from '@Shared/infrastructure/WinstoneLogger';
import { prisma } from '@Shared/infrastructure/prisma/client';

const router = Router();
const logger = new WinstonLogger();

const carRepository = new CarRepository(prisma, logger);
const carService = new CarService(carRepository);
const carController = new CarController(carService, logger);

// Car routes
router.post('/cars', (req: Request, res: Response) => carController.createCar(req, res));
router.get('/cars/:id', (req: Request, res: Response) => carController.getCarById(req, res));
router.get('/cars/driver/:driverId', (req: Request, res: Response) => carController.getCarsByDriver(req, res));
router.put('/cars/:id', (req: Request, res: Response) => carController.updateCar(req, res));
router.delete('/cars/:id', (req: Request, res: Response) => carController.deleteCar(req, res));

export default router;
