import { TripStatus } from '@prisma/client';
import { TripInterface } from './interfaces/TripInterface';
import { DriverDTO } from '@Modules/Drivers/model/DriverDTO';
import { PassengerDTO } from '@Modules/Passengers/model/PassengerDTO';

export interface TripDTO extends TripInterface {
  id: string;
  origin: string;
  destination: string;
  status: TripStatus;
  fare: number;
  driverId: string;
  passengerId: string;
  createdAt: Date;
  completedAt?: Date | null;
  cancelledAt?: Date | null;
  driver?: DriverDTO;
  passenger?: PassengerDTO;
}
