import { TripStatus } from '@prisma/client';

export interface TripInterface {
  id: string;
  driverId: string;
  passengerId: string;
  startLocation: {
    latitude: number;
    longitude: number;
  };
  endLocation: {
    latitude: number;
    longitude: number;
  };
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  startTime?: Date;
  endTime?: Date;
  fare?: number;
  isActive: boolean;
}
