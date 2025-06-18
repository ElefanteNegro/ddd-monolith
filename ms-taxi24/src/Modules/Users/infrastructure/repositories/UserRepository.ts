import { PrismaClientInterface } from '@Modules/Shared/infrastructure/prisma/interfaces/PrismaClientInterface';
import { Logger } from '@Modules/Shared/domain/interfaces/Logger';
import { UserInterface } from '@Modules/Users/model/interfaces/UserInterface';
import { InternalResponse } from '@Shared/dto/InternalResponse';
import { BaseRepository } from '@Modules/Shared/domain/interfaces/Repository';
import { UserMapper } from '@Modules/Users/model/Mappers/UserMapper';
import WinstonLogger from '@Modules/Shared/infrastructure/WinstoneLogger';
import { UserDTO } from '@Modules/Users/model/UserDTO';
import { User } from '@Modules/Users/model/User';

export class UserRepository extends BaseRepository<UserDTO, string> {
  constructor(
    private readonly prisma: PrismaClientInterface = prisma,
    logger: Logger = WinstonLogger.getInstance()
  ) {
    super(logger);
  }

  async create(userData: UserInterface): Promise<InternalResponse> {
    try {
      const user = new User(userData);
      await user.setPassword(userData.password);
      
      await this.prisma.user.create({
        data: {
          name: user.name,
          lastName: user.lastName,
          email: user.email,
          user: userData.user,
          password: (user as any).password,
          phone: user.phone,
          role: userData.role || 'PASSENGER'
        }
      });
      return { success: true, message: 'User created successfully' };
    } catch (error) {
      this.logger.error(error);
      return { success: false, message: 'Error creating user' };
    }
  }

  async getAll(page: number = 1, limit: number = 10): Promise<{ data: UserDTO[]; total: number }> {
    try {
      const skip = (page - 1) * limit;
      const [users, total] = await Promise.all([
        this.prisma.user.findMany({
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
          include: {
            driver: true,
            passenger: true
          }
        }),
        this.prisma.user.count()
      ]);
      return {
        data: users.map((user: any) => UserMapper.toDTO(user)),
        total
      };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async findById(id: string): Promise<UserDTO | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
        include: {
          driver: true,
          passenger: true
        }
      });
      return user ? UserMapper.toDTO(user) : null;
    } catch (error) {
      this.logger.error(error);
      return null;
    }
  }

  async findByEmail(email: string): Promise<UserDTO | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email },
        include: {
          driver: true,
          passenger: true
        }
      });
      return user ? UserMapper.toDTO(user) : null;
    } catch (error) {
      this.logger.error(error);
      return null;
    }
  }

  async save(userData: Omit<UserInterface, 'id'>): Promise<UserDTO> {
    try {
      const user = await this.prisma.user.create({
        data: {
          name: userData.name,
          lastName: userData.lastName,
          email: userData.email,
          user: userData.user,
          password: userData.password,
          phone: userData.phone,
          role: userData.role || 'PASSENGER',
        }
      });
      return UserMapper.toDTO(user);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async update(id: string, userData: Partial<UserInterface>): Promise<UserDTO> {
    try {
      const user = await this.prisma.user.update({
        where: { id },
        data: {
          name: userData.name,
          lastName: userData.lastName,
          email: userData.email,
          user: userData.user,
          password: userData.password,
          phone: userData.phone,
          role: userData.role,
        }
      });
      return UserMapper.toDTO(user);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.prisma.user.delete({ where: { id } });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
