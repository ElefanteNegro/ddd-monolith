import { DriverLocationInterface } from './interfaces/DriverLocationInterface';
import { DriverDTO } from '@Modules/Drivers/model/DriverDTO';

export interface DriverLocationDTO extends DriverLocationInterface {
  driver?: DriverDTO;
} 