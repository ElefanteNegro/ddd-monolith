import { PassengerInterface } from './interfaces/PassengerInterface';
import { UserDTO } from '@Modules/Users/model/UserDTO';

export interface PassengerDTO extends PassengerInterface {
  user?: UserDTO;
} 