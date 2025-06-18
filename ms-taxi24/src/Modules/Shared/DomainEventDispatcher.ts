import { Logger } from './domain/interfaces/Logger';
import { container } from './infrastructure/container';

type Handler<T> = (event: T) => void | Promise<void>;
export class DomainEventDispatcher {
  private static handlers: { [eventName: string]: Handler<any>[] } = {};
  private static logger: Logger;

  static {
    try {
      this.logger = container.logger;
    } catch (error) {
      console.error('Error initializing DomainEventDispatcher logger:', error);
      // Fallback a un logger básico si container.logger no está disponible
      this.logger = {
        info: (message: string, meta?: any) => console.log(`[INFO] ${message}`, meta),
        error: (message: string, meta?: any) => console.error(`[ERROR] ${message}`, meta),
        warn: (message: string, meta?: any) => console.warn(`[WARN] ${message}`, meta),
        debug: (message: string, meta?: any) => console.debug(`[DEBUG] ${message}`, meta)
      };
    }
  }

  static register<T>(eventName: string, handler: Handler<T>) {
    if (!this.handlers[eventName]) this.handlers[eventName] = [];
    this.handlers[eventName].push(handler);
    this.logger.info('[DomainEventDispatcher] Handler registrado', { eventName });
  }

  static async dispatch<T extends { eventName: string }>(event: T): Promise<void> {
    this.logger.info('[DomainEventDispatcher] Disparando evento', { 
      eventName: event.eventName,
      eventId: (event as any).id || 'unknown'
    });

    const handlers = this.handlers[event.eventName] || [];
    this.logger.info('[DomainEventDispatcher] Handlers encontrados', { 
      eventName: event.eventName,
      handlerCount: handlers.length 
    });

    for (const handler of handlers) {
      try {
        this.logger.info('[DomainEventDispatcher] Ejecutando handler', { 
          eventName: event.eventName 
        });
        await handler(event);
        this.logger.info('[DomainEventDispatcher] Handler ejecutado exitosamente', { 
          eventName: event.eventName 
        });
      } catch (error) {
        this.logger.error('[DomainEventDispatcher] Error ejecutando handler', {
          error: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined,
          eventName: event.eventName
        });
        throw error;
      }
    }
  }

  static clearHandlers() {
    this.handlers = {};
    this.logger.info('[DomainEventDispatcher] Handlers limpiados');
  }
}
