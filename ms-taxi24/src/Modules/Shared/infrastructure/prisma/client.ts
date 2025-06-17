import { PrismaClient } from '@prisma/client';
import { PrismaClientInterface } from './interfaces/PrismaClientInterface';

export class PrismaSingleton implements PrismaClientInterface {
  private static instance: PrismaSingleton;
  private client: PrismaClient;

  private constructor() {
    this.client = new PrismaClient();
  }

  public static getInstance(): PrismaSingleton {
    if (!PrismaSingleton.instance) {
      PrismaSingleton.instance = new PrismaSingleton();
    }
    return PrismaSingleton.instance;
  }

  // Acceso a los modelos
  get user() { return this.client.user; }
  get driver() { return this.client.driver; }
  get passenger() { return this.client.passenger; }
  get trip() { return this.client.trip; }
  get car() { return this.client.car; }
  get invoice() { return this.client.invoice; }

  // Métodos de conexión
  async connect(): Promise<void> {
    await this.client.$connect();
  }

  async disconnect(): Promise<void> {
    await this.client.$disconnect();
  }

  // Métodos de transacción
  async transaction<T>(fn: (tx: PrismaClient) => Promise<T>): Promise<T> {
    return this.client.$transaction(fn);
  }

  // Métodos de eventos
  on(event: string, callback: (e: any) => void): void {
    this.client.$on(event, callback);
  }

  // Métodos de middleware
  use(middleware: any): void {
    this.client.$use(middleware);
  }
}

// Exportamos una única instancia para usar en toda la aplicación
export const prisma = PrismaSingleton.getInstance(); 