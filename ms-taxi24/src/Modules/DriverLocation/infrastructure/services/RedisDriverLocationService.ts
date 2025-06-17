import Redis from 'ioredis';
import { DriverLocation, DriverLocationRepository } from '../../domain/interfaces/DriverLocationInterface';
import { Logger } from '@Modules/Shared/domain/interfaces/Logger';

export class RedisDriverLocationService implements DriverLocationRepository {
  private readonly redisClient: Redis;
  private readonly locationKeyPrefix = 'driver:';

  constructor(
    private readonly logger: Logger,
    redisUrl: string = process.env.REDIS_URL || 'redis://redis:6379'
  ) {
    this.redisClient = new Redis(redisUrl);
    this.initializeRedis();
  }

  private async initializeRedis(): Promise<void> {
    try {
      this.redisClient.on('connect', () => {
        this.logger.info('Connected to Redis');
      });

      this.redisClient.on('error', (error) => {
        this.logger.error('Error connecting to Redis:', error);
        throw error;
      });
    } catch (error) {
      this.logger.error('Error initializing Redis:', error);
      throw error;
    }
  }

  async updateLocation(
    driverId: string,
    latitude: number,
    longitude: number,
    isAvailable: boolean
  ): Promise<void> {
    try {
      const location: DriverLocation = {
        driverId,
        latitude,
        longitude,
        isActive: true,
        isFree: isAvailable,
        updatedAt: new Date()
      };
      await this.redisClient.set(`${this.locationKeyPrefix}${driverId}:location`, JSON.stringify(location));
      await this.redisClient.geoadd('drivers', longitude, latitude, driverId);
    } catch (error) {
      this.logger.error(`Error updating location for driver ${driverId}:`, error);
      throw error;
    }
  }

  async getNearestDrivers(
    longitude: number,
    latitude: number,
    limit: number = 3,
    onlyAvailable: boolean = true
  ): Promise<DriverLocation[]> {
    try {
      this.logger.info(`Buscando conductores cercanos en (${longitude}, ${latitude})`);
      const availableDrivers = await this.redisClient.georadius(
        'drivers',
        longitude,
        latitude,
        100,
        'km',
        'WITHCOORD',
        'COUNT',
        limit,
        'ASC'
      );

      this.logger.info(`Encontrados ${availableDrivers.length} conductores en el radio`);
      const locations: DriverLocation[] = [];
      for (const driver of availableDrivers) {
        const driverId = Array.isArray(driver) ? driver[0] : driver;
        const location = await this.getDriverLocation(driverId);
        if (location && (!onlyAvailable || location.isFree)) {
          locations.push(location);
        }
      }

      this.logger.info(`Retornando ${locations.length} conductores disponibles`);
      return locations;
    } catch (error) {
      this.logger.error('Error getting nearest drivers:', error);
      throw error;
    }
  }

  async getDriverLocation(driverId: string): Promise<DriverLocation | null> {
    try {
      const locationKey = `${this.locationKeyPrefix}${driverId}:location`;
      const locationData = await this.redisClient.get(locationKey);
      return locationData ? JSON.parse(locationData) as DriverLocation : null;
    } catch (error) {
      this.logger.error(`Error getting location for driver ${driverId}:`, error);
      throw error;
    }
  }

  async updateAvailability(driverId: string, isAvailable: boolean): Promise<void> {
    try {
      const location = await this.getDriverLocation(driverId);
      if (location) {
        location.isFree = isAvailable;
        location.updatedAt = new Date();
        await this.redisClient.set(`${this.locationKeyPrefix}${driverId}:location`, JSON.stringify(location));
      }
    } catch (error) {
      this.logger.error(`Error updating availability for driver ${driverId}:`, error);
      throw error;
    }
  }

  async updateDriverStatus(driverId: string, isActive: boolean, isFree: boolean): Promise<void> {
    try {
      const location = await this.getDriverLocation(driverId);
      if (location) {
        location.isActive = isActive;
        location.isFree = isFree;
        location.updatedAt = new Date();
        await this.redisClient.set(`${this.locationKeyPrefix}${driverId}:location`, JSON.stringify(location));
      }
    } catch (error) {
      this.logger.error(`Error updating status for driver ${driverId}:`, error);
      throw error;
    }
  }

  async removeDriver(driverId: string): Promise<void> {
    try {
      await this.redisClient.del(`${this.locationKeyPrefix}${driverId}:location`);
      await this.redisClient.zrem('drivers', driverId);
    } catch (error) {
      this.logger.error(`Error removing driver ${driverId}:`, error);
      throw error;
    }
  }
} 