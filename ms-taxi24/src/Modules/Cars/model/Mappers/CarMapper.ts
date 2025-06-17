import { CarDTO } from '../CarDTO';
import { toDriverDTO } from '@Modules/Drivers/model/Mappers/DriverMapper';

export const toCarDTO = (data: any): CarDTO => ({
  id: data.id,
  driverId: data.driverId,
  plate: data.plate,
  brand: data.brand,
  model: data.model,
  year: data.year,
  color: data.color,
  createdAt: data.createdAt,
  updatedAt: data.updatedAt,
  driver: data.driver ? toDriverDTO(data.driver) : undefined
}); 