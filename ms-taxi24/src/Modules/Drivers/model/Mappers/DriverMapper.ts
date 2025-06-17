import { DriverDTO } from '../DriverDTO';
import { UserDTO } from '@Modules/Users/model/UserDTO';
import { CarDTO } from '@Modules/Cars/model/CarDTO';
import { UserMapper } from '@Modules/Users/model/Mappers/UserMapper';
import { toCarDTO } from '@Modules/Cars/model/Mappers/CarMapper';

export const toDriverDTO = (data: any): DriverDTO => {
  return {
    id: data.id,
    userId: data.userId,
    licenseNumber: data.licenseNumber,
    active: data.active,
    user: data.user ? UserMapper.toDTO(data.user) : undefined,
    car: data.car ? toCarDTO(data.car) : undefined
  };
};
