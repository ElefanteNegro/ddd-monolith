import { PrismaClientInterface } from '@Modules/Shared/infrastructure/prisma/interfaces/PrismaClientInterface';
import { DriverInterface } from '@Modules/Drivers/model/interfaces/DriverInterface';
import { Logger } from '@Modules/Shared/domain/interfaces/Logger';
import { BaseRepository } from '@Modules/Shared/domain/interfaces/Repository';
import { DriverDTO } from '@Modules/Drivers/model/DriverDTO';
import { toDriverDTO } from '@Modules/Drivers/model/Mappers/DriverMapper';
import { Prisma } from '@prisma/client';

export class DriverRepository extends BaseRepository<DriverDTO, string> {
  constructor(
    private readonly prisma: PrismaClientInterface,
    logger: Logger
  ) {
    super(logger);
  }

  async findById(id: string): Promise<DriverDTO | null> {
    try {
      const driver = await this.prisma.driver.findUnique({
        where: { id },
        include: { user: true }
      });
      return driver ? toDriverDTO(driver) : null;
    } catch (error) {
      return this.handleError(error, 'Error finding driver by id');
    }
  }

  async save(driver: DriverInterface): Promise<DriverInterface> {
    try {
      this.logger.info('DriverRepository.save - Iniciando guardado de conductor', {
        driverId: driver.id,
        userId: driver.userId,
        active: driver.active
      });

      const result = await this.prisma.driver.create({
        data: {
          id: driver.id,
          userId: driver.userId,
          active: driver.active
        }
      });

      this.logger.info('DriverRepository.save - Conductor guardado exitosamente', {
        driverId: result.id,
        userId: result.userId,
        active: result.active
      });

      return result;
    } catch (error) {
      this.logger.error('DriverRepository.save - Error al guardar conductor', {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        driverId: driver.id,
        userId: driver.userId,
        active: driver.active,
        prismaError: error instanceof Prisma.PrismaClientKnownRequestError ? {
          code: error.code,
          meta: error.meta
        } : undefined
      });
      throw error;
    }
  }

  async update(id: string, driverData: Partial<DriverInterface>): Promise<DriverDTO> {
    try {
      const driver = await this.prisma.driver.update({
        where: { id },
        data: driverData,
        include: { user: true }
      });
      return toDriverDTO(driver);
    } catch (error) {
      return this.handleError(error, 'Error updating driver');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.prisma.driver.delete({
        where: { id }
      });
    } catch (error) {
      return this.handleError(error, 'Error deleting driver');
    }
  }

  async getAll(page: number = 1, limit: number = 10): Promise<{ data: DriverDTO[]; total: number }> {
    try {
      const skip = (page - 1) * limit;
      const [drivers, total] = await Promise.all([
        this.prisma.driver.findMany({
          skip,
          take: limit,
          include: { user: true }
        }),
        this.prisma.driver.count()
      ]);

      return {
        data: drivers.map(toDriverDTO),
        total
      };
    } catch (error) {
      return this.handleError(error, 'Error getting all drivers');
    }
  }

  async findByUserId(userId: string): Promise<DriverDTO | null> {
    try {
      const driver = await this.prisma.driver.findUnique({
        where: { userId },
        include: { user: true }
      });
      return driver ? toDriverDTO(driver) : null;
    } catch (error) {
      return this.handleError(error, 'Error finding driver by user id');
    }
  }

  async getAllActive(page: number = 1, limit: number = 10): Promise<{ data: DriverDTO[]; total: number }> {
    try {
      const skip = (page - 1) * limit;
      const [drivers, total] = await Promise.all([
        this.prisma.driver.findMany({
          where: { active: true },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                lastName: true,
                email: true,
                phone: true
              }
            },
            car: true
          },
          skip,
          take: limit
        }),
        this.prisma.driver.count({ where: { active: true } })
      ]);

      return {
        data: drivers.map(toDriverDTO),
        total
      };
    } catch (error) {
      return this.handleError(error, 'Error getting active drivers');
    }
  }

  async assignCar(driverId: string, carId: string): Promise<DriverDTO> {
    try {
      const driver = await this.prisma.driver.update({
        where: { id: driverId },
        data: {
          car: {
            connect: { id: carId }
          }
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              lastName: true,
              email: true,
              phone: true
            }
          },
          car: true
        }
      });
      return toDriverDTO(driver);
    } catch (error) {
      return this.handleError(error, 'Error assigning car to driver');
    }
  }
}
