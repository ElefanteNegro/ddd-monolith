import { Router } from 'express';
import { HealthController } from '../controllers/HealthController';
import { container } from '@Shared/infrastructure/container';
import { asyncHandler } from '@Shared/infrastructure/middleware/asyncHandler';

const router = Router();
const { logger } = container;
const healthController = new HealthController(logger);

router.get('/health', asyncHandler((req, res) => healthController.check(req, res)));

export default router; 