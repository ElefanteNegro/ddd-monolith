import { UserInterface } from './interfaces/UserInterface';

export interface UserDTO {
  id: string;
  name: string;
  lastName: string;
  email: string;
  phone: string;
  user?: string;
  role?: string;
  createdAt?: Date;
}