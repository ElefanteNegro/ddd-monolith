import { CarInterface } from './interfaces/CarInterface';
import { DriverDTO } from '@Modules/Drivers/model/DriverDTO';

export interface CarDTO extends CarInterface {
  id: string;
  driverId: string;
  plate: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  createdAt: Date;
  updatedAt: Date;
  driver?: DriverDTO;
} 