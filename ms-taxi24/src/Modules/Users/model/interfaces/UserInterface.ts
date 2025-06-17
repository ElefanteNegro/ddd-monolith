export enum UserRole {
  PASSENGER = 'PASSENGER',
  DRIVER = 'DRIVER',
  BOTH = 'BOTH'
}

export interface UserInterface {
  id?: string;
  name: string;
  lastName: string;
  email: string;
  user: string;
  password: string;
  phone: string;
  role?: UserRole;
  createdAt?: Date;
}
