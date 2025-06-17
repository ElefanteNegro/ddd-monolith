import winston, { Logger as WinstonLoggerType } from 'winston';
import { Logger } from '../domain/interfaces/Logger';

enum Levels {
  DEBUG = 'debug',
  ERROR = 'error',
  INFO = 'info',
  WARN = 'warn'
}

class WinstonLogger implements Logger {
  private logger: WinstonLoggerType;

  constructor() {
    this.logger = winston.createLogger({
      format: winston.format.combine(
        winston.format.prettyPrint(),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.colorize(),
        winston.format.simple()
      ),
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: `logs/${Levels.DEBUG}.log`, level: Levels.DEBUG }),
        new winston.transports.File({ filename: `logs/${Levels.ERROR}.log`, level: Levels.ERROR }),
        new winston.transports.File({ filename: `logs/${Levels.INFO}.log`, level: Levels.INFO }),
        new winston.transports.File({ filename: `logs/${Levels.WARN}.log`, level: Levels.WARN })
      ]
    });
  }

  debug(message: string, ...args: any[]): void {
    this.logger.debug(message, ...args);
  }

  error(message: string | Error, ...args: any[]): void {
    this.logger.error(message, ...args);
  }

  info(message: string, ...args: any[]): void {
    this.logger.info(message, ...args);
  }

  warn(message: string, ...args: any[]): void {
    this.logger.warn(message, ...args);
  }
}

export default WinstonLogger;
