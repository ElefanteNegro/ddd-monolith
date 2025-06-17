import { Router, Request, Response } from 'express';
import { UserController } from '../controllers/UserController';
import { UserService } from '../../application/services/UserService';
import { UserRepository } from '../repositories/UserRepository';
import WinstonLogger from '@Shared/infrastructure/WinstoneLogger';
import { prisma } from '@Shared/infrastructure/prisma/client';

const router = Router();
const logger = new WinstonLogger();

const userRepository = new UserRepository(prisma, logger);
const userService = new UserService(userRepository, logger);
const userController = new UserController(userService, logger);

router.post('/', (req: Request, res: Response) => userController.createUser(req, res));
router.get('/', (req: Request, res: Response) => userController.getAllUsers(req, res));
router.get('/:userId', (req: Request, res: Response) => userController.getUserById(req, res));
router.put('/:userId', (req: Request, res: Response) => userController.updateUser(req, res));
router.delete('/:userId', (req: Request, res: Response) => userController.deleteUser(req, res));
router.post('/authenticate', (req: Request, res: Response) => userController.authenticateUser(req, res));

export default router;
