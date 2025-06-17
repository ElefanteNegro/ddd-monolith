import { DriverLocationDTO } from '../DriverLocationDTO';
import { DriverDTO } from '@Modules/Drivers/model/DriverDTO';
import { toDriverDTO } from '@Modules/Drivers/model/Mappers/DriverMapper';

export const toDriverLocationDTO = (data: any): DriverLocationDTO => {
  return {
    id: data.id,
    driverId: data.driverId,
    latitude: data.latitude,
    longitude: data.longitude,
    lastUpdate: data.lastUpdate,
    isActive: data.isActive,
    driver: data.driver ? toDriverDTO(data.driver) : undefined
  };
}; 