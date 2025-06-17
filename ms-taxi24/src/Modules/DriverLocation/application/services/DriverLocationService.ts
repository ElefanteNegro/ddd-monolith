import { DriverLocation } from '../../domain/interfaces/DriverLocationInterface';
import { DriverLocationService as IDriverLocationService } from '../../domain/interfaces/DriverLocationService';
import { DriverLocationRepository } from '../../domain/interfaces/DriverLocationInterface';
import { Logger } from '@Shared/domain/interfaces/Logger';
import { container } from '@Shared/infrastructure/container';

export class DriverLocationService implements IDriverLocationService {
  constructor(
    private readonly driverLocationRepository: DriverLocationRepository,
    private readonly logger: Logger = container.logger
  ) {}

  /**
   * Actualiza la ubicación y disponibilidad de un conductor
   */
  async updateDriverLocation(
    driverId: string,
    latitude: number,
    longitude: number,
    isAvailable: boolean
  ): Promise<void> {
    try {
      await this.driverLocationRepository.updateLocation(driverId, latitude, longitude, isAvailable);
    } catch (error) {
      this.logger.error(`Error updating location for driver ${driverId}:`, error);
      throw error;
    }
  }

  /**
   * Encuentra los conductores más cercanos a una ubicación
   */
  async getNearestDrivers(
    longitude: number,
    latitude: number,
    limit: number = 3,
    onlyAvailable: boolean = true
  ): Promise<DriverLocation[]> {
    try {
      this.logger.info(`Searching for nearest drivers at (${longitude}, ${latitude}) with limit ${limit} and onlyAvailable=${onlyAvailable}`);
      
      const drivers = await this.driverLocationRepository.getNearestDrivers(
        longitude,
        latitude,
        limit,
        onlyAvailable
      );

      this.logger.info(`Found ${drivers?.length || 0} drivers`);
      
      return drivers;
    } catch (error) {
      this.logger.error('Error getting nearest drivers:', error);
      throw error;
    }
  }

  /**
   * Obtiene la ubicación actual de un conductor específico
   */
  async getDriverLocation(driverId: string): Promise<DriverLocation | null> {
    try {
      return await this.driverLocationRepository.getDriverLocation(driverId);
    } catch (error) {
      this.logger.error(`Error getting location for driver ${driverId}:`, error);
      throw error;
    }
  }

  /**
   * Actualiza solo la disponibilidad de un conductor
   */
  async updateDriverAvailability(driverId: string, isAvailable: boolean): Promise<void> {
    try {
      await this.driverLocationRepository.updateAvailability(driverId, isAvailable);
    } catch (error) {
      this.logger.error(`Error updating availability for driver ${driverId}:`, error);
      throw error;
    }
  }

  /**
   * Actualiza el estado completo de un conductor
   */
  async updateDriverStatus(driverId: string, isActive: boolean, isFree: boolean): Promise<void> {
    try {
      await this.driverLocationRepository.updateDriverStatus(driverId, isActive, isFree);
    } catch (error) {
      this.logger.error(`Error updating status for driver ${driverId}:`, error);
      throw error;
    }
  }

  /**
   * Elimina un conductor del sistema de ubicaciones
   */
  async removeDriver(driverId: string): Promise<void> {
    try {
      await this.driverLocationRepository.removeDriver(driverId);
    } catch (error) {
      this.logger.error(`Error removing driver ${driverId}:`, error);
      throw error;
    }
  }
} 