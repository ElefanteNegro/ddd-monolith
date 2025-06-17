type Handler<T> = (event: T) => void | Promise<void>;
export class DomainEventDispatcher {
  private static handlers: { [eventName: string]: Handler<any>[] } = {};

  static register<T>(eventName: string, handler: Handler<T>) {
    if (!this.handlers[eventName]) this.handlers[eventName] = [];
    this.handlers[eventName].push(handler);
  }

  static async dispatch<T extends { eventName: string }>(event: T): Promise<void> {
    const handlers = this.handlers[event.eventName] || [];
    for (const handler of handlers) {
      await handler(event); 
    }
  }

  static clearHandlers() {
    this.handlers = {};
  }
}
