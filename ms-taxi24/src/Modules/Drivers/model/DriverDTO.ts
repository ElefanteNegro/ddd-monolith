import { DriverInterface } from './interfaces/DriverInterface';
import { UserDTO } from '@Modules/Users/model/UserDTO';
import { CarDTO } from '@Modules/Cars/model/CarDTO';

export interface DriverDTO extends DriverInterface {
  user?: UserDTO;
  car?: CarDTO;
}
