import Redis from 'ioredis';
import { DriverLocation, DriverLocationRepository } from '../../domain/interfaces/DriverLocationInterface';
import { Logger } from '@Modules/Shared/domain/interfaces/Logger';

/**
 * Implementación del repositorio de ubicaciones de conductores usando Redis
 * Utiliza Redis GEO para almacenar y consultar ubicaciones de conductores
 */
export class RedisDriverLocationRepository implements DriverLocationRepository {
  private readonly client: Redis;
  private readonly logger: Logger;
  private readonly MAX_RADIUS_KM = 100; // Radio máximo de búsqueda en kilómetros
  private readonly DRIVER_LOCATIONS_KEY = 'driver_locations';

  constructor(logger: Logger) {
    // Configuración de conexión a Redis
    const host = process.env.REDIS_HOST || 'redis';
    const port = process.env.REDIS_PORT || '6379';
    this.client = new Redis(`redis://${host}:${port}`);
    this.logger = logger;
  }

  /**
   * Actualiza la ubicación de un conductor
   * Almacena dos tipos de información:
   * 1. Datos completos del conductor en un hash (location, estado, etc)
   * 2. Coordenadas en el conjunto GEO para búsquedas por proximidad
   */
  async updateLocation(
    driverId: string,
    latitude: number,
    longitude: number,
    isAvailable: boolean
  ): Promise<void> {
    try {
      // Crear objeto con toda la información del conductor
      const location: DriverLocation = {
        driverId,
        latitude,
        longitude,
        isActive: true,
        isFree: isAvailable,
        updatedAt: new Date()
      };

      // Guardar datos completos del conductor en el hash
      await this.client.hset(this.DRIVER_LOCATIONS_KEY, driverId, JSON.stringify(location));
      // Añadir coordenadas al conjunto GEO para búsquedas por proximidad
      await this.client.geoadd('drivers', longitude, latitude, driverId);
    } catch (error) {
      this.logger.error('Error updating driver location:', error);
      throw error;
    }
  }

  /**
   * Encuentra los conductores más cercanos a una ubicación
   * Usa Redis GEO para encontrar conductores dentro de un radio
   * y ordenarlos por distancia
   */
  async getNearestDrivers(
    longitude: number,
    latitude: number,
    limit: number = 3,
    onlyAvailable: boolean = true
  ): Promise<DriverLocation[]> {
    try {
      // Usar GEORADIUS para encontrar conductores cercanos
      // - WITHCOORD: incluir coordenadas en el resultado
      // - COUNT: limitar número de resultados
      // - ASC: ordenar por distancia (más cercanos primero)
      const results = await this.client.georadius(
        'drivers',
        longitude,
        latitude,
        this.MAX_RADIUS_KM,
        'km',
        'WITHCOORD',
        'COUNT',
        limit,
        'ASC'
      ) as Array<[string, [number, number]]>;

      const drivers: DriverLocation[] = [];
      
      // Para cada conductor encontrado, obtener sus datos completos
      for (const [driverId] of results) {
        const location = await this.getDriverLocation(driverId);
        // Filtrar por disponibilidad si es necesario
        if (location && (!onlyAvailable || location.isFree)) {
          drivers.push(location);
        }
      }

      return drivers;
    } catch (error) {
      this.logger.error('Error getting nearest drivers:', error);
      throw error;
    }
  }

  /**
   * Obtiene la ubicación actual de un conductor específico
   * Combina dos fuentes de datos:
   * 1. Datos almacenados en el hash (estado, disponibilidad, etc)
   * 2. Coordenadas actuales del conjunto GEO
   */
  async getDriverLocation(driverId: string): Promise<DriverLocation | null> {
    try {
      // Obtener datos almacenados del conductor del hash
      const location = await this.client.hget(this.DRIVER_LOCATIONS_KEY, driverId);
      if (!location) return null;

      const driverLocation = JSON.parse(location) as DriverLocation;
      
      // Obtener coordenadas actuales del conjunto GEO
      // Esto asegura que tenemos las coordenadas más recientes
      const coords = await this.client.geopos('drivers', driverId);
      if (coords && coords[0]) {
        driverLocation.longitude = parseFloat(coords[0][0]);
        driverLocation.latitude = parseFloat(coords[0][1]);
      }

      return driverLocation;
    } catch (error) {
      this.logger.error(`Error getting location for driver ${driverId}:`, error);
      throw error;
    }
  }

  /**
   * Elimina un conductor del sistema
   * Limpia tanto sus datos como sus coordenadas
   */
  async removeDriver(driverId: string): Promise<void> {
    try {
      // Eliminar datos almacenados del hash
      await this.client.hdel(this.DRIVER_LOCATIONS_KEY, driverId);
      // Eliminar coordenadas del conjunto GEO
      await this.client.zrem('drivers', driverId);
    } catch (error) {
      this.logger.error(`Error removing driver ${driverId}:`, error);
      throw error;
    }
  }

  /**
   * Actualiza solo el estado de disponibilidad de un conductor
   * Mantiene su ubicación actual
   */
  async updateAvailability(driverId: string, isAvailable: boolean): Promise<void> {
    try {
      const location = await this.getDriverLocation(driverId);
      if (location) {
        location.isFree = isAvailable;
        location.updatedAt = new Date();
        await this.client.hset(this.DRIVER_LOCATIONS_KEY, driverId, JSON.stringify(location));
      }
    } catch (error) {
      this.logger.error(`Error updating availability for driver ${driverId}:`, error);
      throw error;
    }
  }

  /**
   * Actualiza el estado completo de un conductor
   * (activo/inactivo y disponible/no disponible)
   */
  async updateDriverStatus(driverId: string, isActive: boolean, isFree: boolean): Promise<void> {
    try {
      const location = await this.getDriverLocation(driverId);
      if (location) {
        location.isActive = isActive;
        location.isFree = isFree;
        location.updatedAt = new Date();
        await this.client.hset(this.DRIVER_LOCATIONS_KEY, driverId, JSON.stringify(location));
      }
    } catch (error) {
      this.logger.error(`Error updating status for driver ${driverId}:`, error);
      throw error;
    }
  }
} 