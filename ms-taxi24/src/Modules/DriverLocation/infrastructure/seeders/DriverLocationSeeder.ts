import Redis from 'ioredis';
import { Logger } from '@Modules/Shared/domain/interfaces/Logger';
import { DriverLocation } from '../../domain/interfaces/DriverLocationInterface';
import { PrismaClient } from '@prisma/client';

export class DriverLocationSeeder {
  private readonly client: Redis;
  private readonly locationKeyPrefix = 'driver:location:';
  private readonly prisma: PrismaClient;

  constructor(
    private readonly logger: Logger,
    host: string = process.env.REDIS_HOST || 'redis',
    port: string = process.env.REDIS_PORT || '6379'
  ) {
    this.client = new Redis(`redis://${host}:${port}`);
    this.prisma = new PrismaClient();
  }

  async seed(): Promise<void> {
    try {
      this.logger.info('Connected to Redis for seeding');

      // Limpiar datos existentes
      await this.cleanup();

      // Obtener conductores de la base de datos
      const drivers = await this.prisma.driver.findMany({
        include: {
          user: true
        }
      });

      if (drivers.length === 0) {
        this.logger.warn('No drivers found in database. Please run Prisma seed first.');
        return;
      }

      // Crear ubicaciones para cada conductor
      const locations = this.createDriverLocations(drivers);
      
      // Guardar ubicaciones en Redis
      for (const location of locations) {
        await this.saveDriverLocation(location);
      }

      this.logger.info('Driver locations seeded successfully');
    } catch (error) {
      this.logger.error('Error seeding driver locations:', error);
      throw error;
    } finally {
      await this.client.quit();
      await this.prisma.$disconnect();
    }
  }

  private async cleanup(): Promise<void> {
    const keys = await this.client.keys(`${this.locationKeyPrefix}*`);
    if (keys.length > 0) {
      await this.client.del(keys);
    }
    await this.client.del('drivers');
  }

  private async saveDriverLocation(driver: DriverLocation): Promise<void> {
    const locationKey = `${this.locationKeyPrefix}${driver.driverId}`;
    
    // Guardar ubicación
    await this.client.set(locationKey, JSON.stringify(driver));
    
    // Agregar a la lista de conductores disponibles
    await this.client.geoadd('drivers', driver.longitude, driver.latitude, driver.driverId);
  }

  private createDriverLocations(drivers: any[]): DriverLocation[] {
    // Crear un escenario con conductores en diferentes ubicaciones
    // Por ejemplo, conductores alrededor de un punto central
    const centerLat = -34.6037; // Buenos Aires
    const centerLng = -58.3816;
    
    return drivers.map((driver, index) => {
      // Distribuir conductores en diferentes ubicaciones alrededor del centro
      const angle = (index * 2 * Math.PI) / drivers.length;
      const radius = 0.01; // Radio de distribución en grados
      
      return {
        driverId: driver.id,
        latitude: centerLat + radius * Math.cos(angle),
        longitude: centerLng + radius * Math.sin(angle),
        isActive: driver.active,
        isFree: true,
        updatedAt: new Date()
      };
    });
  }
} 