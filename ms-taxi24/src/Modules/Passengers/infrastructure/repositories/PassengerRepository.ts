import { PrismaClientInterface } from '@Modules/Shared/infrastructure/prisma/interfaces/PrismaClientInterface';
import { PassengerInterface } from '@Modules/Passengers/model/interfaces/PassengerInterface';
import { Logger } from '@Modules/Shared/domain/interfaces/Logger';
import { BaseRepository } from '@Modules/Shared/domain/interfaces/Repository';
import { PassengerDTO } from '@Modules/Passengers/model/PassengerDTO';
import { PassengerMapper } from '@Modules/Passengers/model/Mappers/PassengerMapper';

export class PassengerRepository extends BaseRepository<PassengerDTO, string> {
  constructor(
    private readonly prisma: PrismaClientInterface = prisma,
    logger: Logger
  ) {
    super(logger);
  }

  async findById(id: string): Promise<PassengerDTO | null> {
    try {
      const passenger = await this.prisma.passenger.findUnique({
        where: { id },
        include: {
          user: true
        }
      });
      return passenger ? PassengerMapper.toDTO(passenger) : null;
    } catch (error) {
      return this.handleError(error, 'Error finding passenger by id');
    }
  }

  async save(passengerData: Omit<PassengerInterface, 'id'>): Promise<PassengerDTO> {
    try {
      const passenger = await this.prisma.passenger.create({
        data: passengerData,
        include: {
          user: true
        }
      });
      return PassengerMapper.toDTO(passenger);
    } catch (error) {
      return this.handleError(error, 'Error saving passenger');
    }
  }

  async update(id: string, passengerData: Partial<PassengerInterface>): Promise<PassengerDTO> {
    try {
      const passenger = await this.prisma.passenger.update({
        where: { id },
        data: passengerData,
        include: {
          user: true
        }
      });
      return PassengerMapper.toDTO(passenger);
    } catch (error) {
      return this.handleError(error, 'Error updating passenger');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.prisma.passenger.delete({
        where: { id }
      });
    } catch (error) {
      return this.handleError(error, 'Error deleting passenger');
    }
  }

  async getAll(page: number = 1, limit: number = 10): Promise<{ data: PassengerDTO[]; total: number }> {
    try {
      const skip = (page - 1) * limit;
      const [passengers, total] = await Promise.all([
        this.prisma.passenger.findMany({
          skip,
          take: limit,
          include: {
            user: true
          }
        }),
        this.prisma.passenger.count()
      ]);

      return {
        data: passengers.map(PassengerMapper.toDTO),
        total
      };
    } catch (error) {
      return this.handleError(error, 'Error getting all passengers');
    }
  }

  async findByUserId(userId: string): Promise<PassengerDTO | null> {
    try {
      const passenger = await this.prisma.passenger.findUnique({
        where: { userId },
        include: {
          user: true
        }
      });
      return passenger ? PassengerMapper.toDTO(passenger) : null;
    } catch (error) {
      return this.handleError(error, 'Error finding passenger by user id');
    }
  }
}
