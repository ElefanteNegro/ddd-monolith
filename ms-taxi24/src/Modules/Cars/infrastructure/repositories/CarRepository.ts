import { PrismaClientInterface } from '@Modules/Shared/infrastructure/prisma/interfaces/PrismaClientInterface';
import { CarInterface } from '@Modules/Cars/model/interfaces/CarInterface';
import { Logger } from '@Modules/Shared/domain/interfaces/Logger';
import { BaseRepository } from '@Modules/Shared/domain/interfaces/Repository';
import { CarDTO } from '@Modules/Cars/model/CarDTO';
import { toCarDTO } from '@Modules/Cars/model/Mappers/CarMapper';

export class CarRepository extends BaseRepository<CarDTO, string> {
  constructor(
    private readonly prisma: PrismaClientInterface,
    logger: Logger
  ) {
    super(logger);
  }

  async findById(id: string): Promise<CarDTO | null> {
    try {
      const car = await this.prisma.car.findUnique({
        where: { id },
        include: {
          driver: {
            include: {
              user: true
            }
          }
        }
      });
      return car ? toCarDTO(car) : null;
    } catch (error) {
      return this.handleError(error, 'Error finding car by id');
    }
  }

  async create(carData: Omit<CarInterface, 'id'>): Promise<CarDTO> {
    try {
      const car = await this.prisma.car.create({
        data: carData,
        include: {
          driver: {
            include: {
              user: true
            }
          }
        }
      });
      return toCarDTO(car);
    } catch (error) {
      return this.handleError(error, 'Error creating car');
    }
  }

  async update(id: string, carData: Partial<CarInterface>): Promise<CarDTO> {
    try {
      const car = await this.prisma.car.update({
        where: { id },
        data: carData,
        include: {
          driver: {
            include: {
              user: true
            }
          }
        }
      });
      return toCarDTO(car);
    } catch (error) {
      return this.handleError(error, 'Error updating car');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.prisma.car.delete({
        where: { id }
      });
    } catch (error) {
      return this.handleError(error, 'Error deleting car');
    }
  }

  async getAll(page: number = 1, limit: number = 10): Promise<{ data: CarDTO[]; total: number }> {
    try {
      const skip = (page - 1) * limit;
      const [cars, total] = await Promise.all([
        this.prisma.car.findMany({
          skip,
          take: limit,
          include: {
            driver: {
              include: {
                user: true
              }
            }
          }
        }),
        this.prisma.car.count()
      ]);

      return {
        data: cars.map(toCarDTO),
        total
      };
    } catch (error) {
      return this.handleError(error, 'Error getting all cars');
    }
  }

  async findByDriverId(driverId: string): Promise<CarDTO[]> {
    try {
      const cars = await this.prisma.car.findMany({
        where: { driverId },
        include: {
          driver: {
            include: {
              user: true
            }
          }
        }
      });
      return cars.map(toCarDTO);
    } catch (error) {
      return this.handleError(error, 'Error finding cars by driver id');
    }
  }

  async findByPlate(plate: string): Promise<CarDTO | null> {
    try {
      const car = await this.prisma.car.findUnique({
        where: { plate },
        include: {
          driver: {
            include: {
              user: true
            }
          }
        }
      });
      return car ? toCarDTO(car) : null;
    } catch (error) {
      return this.handleError(error, 'Error finding car by plate');
    }
  }

  async save(data: CarDTO): Promise<CarDTO> {
    return this.create(data);
  }
} 