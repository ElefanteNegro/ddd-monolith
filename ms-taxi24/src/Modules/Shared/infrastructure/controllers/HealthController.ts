import { Request, Response } from 'express';
import { prisma } from '@Modules/Shared/infrastructure/prisma/client';
import redis from '@Modules/Shared/infrastructure/redis/RedisClient';
import { kafkaProducer } from '@Modules/Shared/infrastructure/kafka/producer';
import { Logger } from '@Modules/Shared/domain/interfaces/Logger';

export class HealthController {
  constructor(private readonly logger: Logger) {}

  async check(req: Request, res: Response): Promise<void> {
    try {
      const health = {
        status: 'ok',
        timestamp: new Date().toISOString(),
        services: {
          database: 'ok',
          redis: 'ok',
          kafka: 'ok'
        }
      };

      // Verificar PostgreSQL
      try {
        await prisma.connect();
      } catch (error) {
        health.services.database = 'error';
        health.status = 'error';
        this.logger.error('Database health check failed', error);
      }

      // Verificar Redis
      try {
        await redis.ping();
      } catch (error) {
        health.services.redis = 'error';
        health.status = 'error';
        this.logger.error('Redis health check failed', error);
      }

      // Verificar Kafka
      try {
        await kafkaProducer.connect();
      } catch (error) {
        health.services.kafka = 'error';
        health.status = 'error';
        this.logger.error('Kafka health check failed', error);
      }

      const statusCode = health.status === 'ok' ? 200 : 503;
      res.status(statusCode).json(health);
    } catch (error) {
      this.logger.error('Health check failed', error);
      res.status(500).json({
        status: 'error',
        timestamp: new Date().toISOString(),
        error: 'Internal server error'
      });
    }
  }
} 