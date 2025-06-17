import { PassengerDTO } from '../PassengerDTO';
import { Passenger, User } from '@prisma/client';
import { UserMapper } from '@Modules/Users/model/Mappers/UserMapper';

export class PassengerMapper {
  static toDTO(data: Passenger & { user?: User }): PassengerDTO {
    return {
      id: data.id,
      userId: data.userId,
      isActive: data.isActive,
      user: data.user ? UserMapper.toDTO(data.user) : undefined,
    };
  }

}
