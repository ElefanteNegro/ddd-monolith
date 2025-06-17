import { Router } from 'express';
import { HealthController } from '../controllers/HealthController';
import WinstonLogger from '@Shared/infrastructure/WinstoneLogger';

const router = Router();
const logger = new WinstonLogger();
const healthController = new HealthController(logger);

router.get('/health', (req, res) => healthController.check(req, res));

export default router; 