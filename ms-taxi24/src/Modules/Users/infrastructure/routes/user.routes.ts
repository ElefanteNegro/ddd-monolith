import { Router, Request, Response } from 'express';
import { UserController } from '../controllers/UserController';
import { UserService } from '../../application/services/UserService';
import { UserRepository } from '../repositories/UserRepository';
import { container } from '@Shared/infrastructure/container';
import { prisma } from '@Shared/infrastructure/prisma/client';
import { asyncHandler } from '@Shared/infrastructure/middleware/asyncHandler';

const router = Router();
const { logger } = container;

const userRepository = new UserRepository(prisma, logger);
const userService = new UserService(userRepository, logger);
const userController = new UserController(userService, logger);

router.post('/', asyncHandler((req: Request, res: Response) => userController.createUser(req, res)));
router.get('/', asyncHandler((req: Request, res: Response) => userController.getAllUsers(req, res)));
router.get('/:userId', asyncHandler((req: Request, res: Response) => userController.getUserById(req, res)));
router.put('/:userId', asyncHandler((req: Request, res: Response) => userController.updateUser(req, res)));
router.delete('/:userId', asyncHandler((req: Request, res: Response) => userController.deleteUser(req, res)));
router.post('/authenticate', asyncHandler((req: Request, res: Response) => userController.authenticateUser(req, res)));

export default router;
