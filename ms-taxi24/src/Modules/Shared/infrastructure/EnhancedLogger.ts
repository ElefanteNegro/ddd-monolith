import winston, { Logger as WinstonLoggerType } from 'winston';
import { Logger } from '../domain/interfaces/Logger';

enum Levels {
  DEBUG = 'debug',
  ERROR = 'error',
  INFO = 'info',
  WARN = 'warn'
}

class EnhancedLogger implements Logger {
  private static instance: EnhancedLogger;
  private logger: WinstonLoggerType;

  private constructor() {
    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message, ...meta }) => {
          // Extraer información del stack trace si existe
          const stack = meta.stack ? `\nStack: ${meta.stack}` : '';
          delete meta.stack;

          // Formatear el mensaje con contexto
          const context = meta.context ? `[${meta.context}] ` : '';
          delete meta.context;

          // Formatear el requestId si existe
          const requestId = meta.requestId ? `[RequestId: ${meta.requestId}] ` : '';
          delete meta.requestId;

          // Formatear el resto de metadata
          const metadata = Object.keys(meta).length ? `\nMetadata: ${JSON.stringify(meta, null, 2)}` : '';

          return `${timestamp} [${level}] ${context}${requestId}${message}${metadata}${stack}`;
        })
      ),
      defaultMeta: { service: 'ms-taxi24' },
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
          )
        }),
        new winston.transports.File({ 
          filename: 'logs/combined.log',
          maxsize: 5242880, // 5MB
          maxFiles: 5,
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json()
          )
        }),
        new winston.transports.File({ 
          filename: 'logs/error.log',
          level: 'error',
          maxsize: 5242880,
          maxFiles: 5,
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json()
          )
        })
      ]
    });
  }

  public static getInstance(): EnhancedLogger {
    if (!EnhancedLogger.instance) {
      EnhancedLogger.instance = new EnhancedLogger();
    }
    return EnhancedLogger.instance;
  }

  private formatMessage(message: string | Error, context?: string): { message: string; stack?: string } {
    if (message instanceof Error) {
      return {
        message: message.message,
        stack: message.stack
      };
    }
    return { message };
  }

  debug(message: string | Error, ...args: any[]): void {
    const { message: formattedMessage, stack } = this.formatMessage(message);
    this.logger.debug(formattedMessage, { ...args[0], stack });
  }

  error(message: string | Error, ...args: any[]): void {
    const { message: formattedMessage, stack } = this.formatMessage(message);
    this.logger.error(formattedMessage, { ...args[0], stack });
  }

  info(message: string, ...args: any[]): void {
    this.logger.info(message, ...args);
  }

  warn(message: string, ...args: any[]): void {
    this.logger.warn(message, ...args);
  }

  // Métodos adicionales para logging específico
  logRequest(req: any, res: any, next: any): void {
    const requestId = req.id || 'unknown';
    this.info('Incoming request', {
      context: 'HTTP',
      requestId,
      method: req.method,
      path: req.path,
      query: req.query,
      body: req.body,
      ip: req.ip
    });
  }

  logResponse(req: any, res: any, responseTime: number): void {
    const requestId = req.id || 'unknown';
    this.info('Response sent', {
      context: 'HTTP',
      requestId,
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      responseTime: `${responseTime}ms`
    });
  }

  logError(error: Error, context?: string, metadata?: any): void {
    this.error(error, {
      context,
      ...metadata
    });
  }
}

export default EnhancedLogger; 