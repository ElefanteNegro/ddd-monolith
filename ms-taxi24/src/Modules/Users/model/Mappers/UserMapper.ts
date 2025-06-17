import { User } from '../User';
import { UserDTO } from '../UserDTO';

export class UserMapper {
  static toDTO(data: any): UserDTO {
    return {
      id: data.id,
      name: data.name,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      user: data.user,
      role: data.role,
      createdAt: data.createdAt
    };
  }

  static toDomain(dto: UserDTO): User {
    return new User({
      id: dto.id,
      name: dto.name,
      lastName: dto.lastName,
      email: dto.email,
      phone: dto.phone
    });
  }
}
