import express, { Request, Response } from 'express';
import * as http from 'http';
import httpStatus from 'http-status';
import bodyParser from 'body-parser';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { Middleware } from '@Shared/infrastructure/middleware/middleware';
import routes from './Routes/routes';
import { swaggerSpec, swaggerUiOptions } from './swagger';
import WinstonLogger from '@Shared/infrastructure/WinstoneLogger';
import Logger from '@Shared/domain/Logger';

const logger: Logger = new WinstonLogger();

export class Server {
  private express: express.Express;
  readonly port: string;
  private readonly logger: Logger;
  httpServer?: http.Server;

  constructor(port: string) {
    this.port = port;
    this.logger = new WinstonLogger();
    this.express = express();
    this.setupMiddleware();
    this.setupRoutes();
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

    this.express.use((err: Error, _req: Request, res: Response, _next: Function) => {
      this.logger.error(err);
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err.message);
    });

    this.express.use(routes);
  }

  async listen(): Promise<void> {
    return new Promise(resolve => {
      this.httpServer = this.express.listen(this.port, () => {
        this.logger.info(`Server running on http://localhost:${this.port} (${this.express.get('env')} mode)`);
        this.logger.info('Press CTRL-C to stop');
        this.logger.info(`API documentation: http://localhost:${this.port}/api-docs`);
        resolve();
      });
    });
  }

  getHTTPServer() {
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
