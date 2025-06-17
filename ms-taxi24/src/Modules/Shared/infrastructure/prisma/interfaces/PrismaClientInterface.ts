import { PrismaClient, Prisma } from '@prisma/client';

export interface PrismaClientInterface {
  user: PrismaClient['user'];
  driver: PrismaClient['driver'];
  passenger: PrismaClient['passenger'];
  trip: PrismaClient['trip'];
  car: PrismaClient['car'];
  invoice: PrismaClient['invoice'];
  $connect(): Promise<void>;
  $disconnect(): Promise<void>;
  $transaction<T>(fn: (tx: Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>) => Promise<T>): Promise<T>;
  $on(event: Prisma.LogLevel | Prisma.LogDefinition, callback: (e: Prisma.LogEvent) => void): void;
  $use(middleware: Prisma.Middleware): void;
} 