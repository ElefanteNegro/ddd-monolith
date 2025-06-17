import express from 'express';
import * as http from 'http';
import bodyParser from 'body-parser';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { Middleware } from '@Shared/infrastructure/middleware/middleware';
import { ErrorHandler } from '@Shared/infrastructure/middleware/errorHandler';
import routes from './Routes/routes';
import { swaggerSpec, swaggerUiOptions } from './swagger';
import { container } from '@Shared/infrastructure/container';
import { Logger } from '@Shared/domain/interfaces/Logger';
import { AppError } from '@Shared/domain/exceptions/AppError';
import { HttpResponseCodes } from '@Shared/HttpResponseCodes';

export class Server {
  private express: express.Express;
  readonly port: string;
  private readonly logger: Logger;
  httpServer?: http.Server;

  constructor(port: string) {
    this.port = port;
    this.logger = container.logger;
    this.express = express();
    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandlers();
  }

  private setupMiddleware(): void {
    this.express.use(cors({
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
      credentials: true
    }));
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: true }));
    this.express.use(Middleware);
  }

  private setupRoutes(): void {
    this.express.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));
    this.express.use(routes);

    const errorHandler = new ErrorHandler(this.logger);
    this.express.use(errorHandler.handle);
  }

  private setupErrorHandlers(): void {
    process.on('unhandledRejection', (reason: any) => {
      this.logger.error('Unhandled Rejection:', reason);
      
      if (!(reason instanceof AppError)) {
        const error = new AppError(
          reason?.message || 'An unexpected error occurred',
          reason?.statusCode || HttpResponseCodes.INTERNAL_SERVER_ERROR,
          reason?.code || 'INTERNAL_SERVER_ERROR'
        );
        this.logger.error('Converted to AppError:', error);
      }
    });

    process.on('uncaughtException', (error: Error) => {
      this.logger.error('Uncaught Exception:', error);
      
      if (!(error instanceof AppError)) {
        const appError = new AppError(
          error.message || 'An unexpected error occurred',
          HttpResponseCodes.INTERNAL_SERVER_ERROR,
          'INTERNAL_SERVER_ERROR'
        );
        this.logger.error('Converted to AppError:', appError);
      }
    });
  }

  async listen(): Promise<void> {
    return new Promise(resolve => {
      this.httpServer = this.express.listen(this.port, () => {
        this.logger.info(`Server is running at http://localhost:${this.port}`);
        this.logger.info(`Swagger documentation available at http://localhost:${this.port}/api-docs`);
        resolve();
      });
    });
  }

  getHTTPServer(): http.Server | undefined {
    return this.httpServer;
  }

  async stop(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.httpServer) {
        this.httpServer.close(error => {
          if (error) {
            return reject(error);
          }
          return resolve();
        });
      }
      return resolve();
    });
  }
}
