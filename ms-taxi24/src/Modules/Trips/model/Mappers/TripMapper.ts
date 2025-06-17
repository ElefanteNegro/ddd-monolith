import { TripDTO } from '../TripDTO';
import { DriverDTO } from '@Modules/Drivers/model/DriverDTO';
import { PassengerDTO } from '@Modules/Passengers/model/PassengerDTO';
import { toDriverDTO } from '@Modules/Drivers/model/Mappers/DriverMapper';
import { toPassengerDTO } from '@Modules/Passengers/model/Mappers/PassengerMapper';

export const toTripDTO = (data: any): TripDTO => {
  return {
    id: data.id,
    driverId: data.driverId,
    passengerId: data.passengerId,
    startLocation: {
      latitude: data.startLocation.latitude,
      longitude: data.startLocation.longitude
    },
    endLocation: {
      latitude: data.endLocation.latitude,
      longitude: data.endLocation.longitude
    },
    status: data.status,
    startTime: data.startTime,
    endTime: data.endTime,
    fare: data.fare,
    isActive: data.isActive,
    driver: data.driver ? toDriverDTO(data.driver) : undefined,
    passenger: data.passenger ? toPassengerDTO(data.passenger) : undefined
  };
};
