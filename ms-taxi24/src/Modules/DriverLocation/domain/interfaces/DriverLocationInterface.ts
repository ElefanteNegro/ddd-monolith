export interface DriverLocation {
  driverId: string;
  latitude: number;
  longitude: number;
  isActive: boolean;
  isFree: boolean;
  updatedAt: Date;
}

export interface DriverLocationRepository {
  /**
   * Actualiza la ubicación y disponibilidad de un conductor
   */
  updateLocation(
    driverId: string,
    latitude: number,
    longitude: number,
    isAvailable: boolean
  ): Promise<void>;

  /**
   * Encuentra los conductores más cercanos a una ubicación
   */
  getNearestDrivers(
    longitude: number,
    latitude: number,
    limit: number,
    onlyAvailable: boolean
  ): Promise<DriverLocation[]>;

  /**
   * Obtiene la ubicación actual de un conductor específico
   */
  getDriverLocation(driverId: string): Promise<DriverLocation | null>;

  /**
   * Actualiza solo la disponibilidad de un conductor
   */
  updateAvailability(driverId: string, isAvailable: boolean): Promise<void>;

  /**
   * Actualiza el estado completo de un conductor
   */
  updateDriverStatus(driverId: string, isActive: boolean, isFree: boolean): Promise<void>;

  /**
   * Elimina un conductor del sistema de ubicaciones
   */
  removeDriver(driverId: string): Promise<void>;
} 