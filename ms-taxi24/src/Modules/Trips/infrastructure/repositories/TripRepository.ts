import { PrismaClientInterface } from '@Modules/Shared/infrastructure/prisma/interfaces/PrismaClientInterface';
import { TripInterface } from '@Modules/Trips/model/interfaces/TripInterface';
import { Logger } from '@Modules/Shared/domain/interfaces/Logger';
import { BaseRepository } from '@Modules/Shared/domain/interfaces/Repository';
import { TripDTO } from '@Modules/Trips/model/TripDTO';
import { toTripDTO } from '@Modules/Trips/model/Mappers/TripMapper';
import { DomainEventDispatcher } from '@Modules/Shared/DomainEventDispatcher';
import { TripCreatedEvent } from '../../model/events/TripCreatedEvent';
import { TripStatusChangedEvent } from '../../model/events/TripStatusChangedEvent';

export class TripRepository extends BaseRepository<TripDTO, string> {
  constructor(
    private readonly prisma: PrismaClientInterface = prisma,
    logger: Logger
  ) {
    super(logger);
  }

  async findById(id: string): Promise<TripDTO | null> {
    try {
      const trip = await this.prisma.trip.findUnique({
        where: { id },
        include: {
          driver: {
            include: {
              user: true,
              car: true
            }
          },
          passenger: {
            include: {
              user: true
            }
          }
        }
      });
      return trip ? toTripDTO(trip) : null;
    } catch (error) {
      return this.handleError(error, 'Error finding trip by id');
    }
  }

  async save(tripData: Omit<TripInterface, 'id'>): Promise<TripDTO> {
    try {
      const trip = await this.prisma.trip.create({
        data: tripData,
        include: {
          driver: {
            include: {
              user: true,
              car: true
            }
          },
          passenger: {
            include: {
              user: true
            }
          }
        }
      });
      
      const tripDTO = toTripDTO(trip);
      
      // Dispatch TripCreatedEvent
      await DomainEventDispatcher.dispatch(new TripCreatedEvent(tripDTO));
      
      return tripDTO;
    } catch (error) {
      return this.handleError(error, 'Error saving trip');
    }
  }

  async update(id: string, tripData: Partial<TripInterface>): Promise<TripDTO> {
    try {
      const existingTrip = await this.findById(id);
      if (!existingTrip) {
        throw new Error('Trip not found');
      }

      const trip = await this.prisma.trip.update({
        where: { id },
        data: tripData,
        include: {
          driver: {
            include: {
              user: true,
              car: true
            }
          },
          passenger: {
            include: {
              user: true
            }
          }
        }
      });
      
      const tripDTO = toTripDTO(trip);
      
      // Dispatch TripStatusChangedEvent if status changed
      if (tripData.status && tripData.status !== existingTrip.status) {
        await DomainEventDispatcher.dispatch(
          new TripStatusChangedEvent(tripDTO, existingTrip.status, tripData.status)
        );
      }
      
      return tripDTO;
    } catch (error) {
      return this.handleError(error, 'Error updating trip');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.prisma.trip.delete({
        where: { id }
      });
    } catch (error) {
      return this.handleError(error, 'Error deleting trip');
    }
  }

  async getAll(page: number = 1, limit: number = 10): Promise<{ data: TripDTO[]; total: number }> {
    try {
      const skip = (page - 1) * limit;
      const [trips, total] = await Promise.all([
        this.prisma.trip.findMany({
          skip,
          take: limit,
          include: {
            driver: {
              include: {
                user: true,
                car: true
              }
            },
            passenger: {
              include: {
                user: true
              }
            }
          }
        }),
        this.prisma.trip.count()
      ]);

      return {
        data: trips.map(toTripDTO),
        total
      };
    } catch (error) {
      return this.handleError(error, 'Error getting all trips');
    }
  }

  async findByDriverId(driverId: string, page: number = 1, limit: number = 10): Promise<{ data: TripDTO[]; total: number }> {
    try {
      const skip = (page - 1) * limit;
      const [trips, total] = await Promise.all([
        this.prisma.trip.findMany({
          where: { driverId },
          skip,
          take: limit,
          include: {
            driver: {
              include: {
                user: true,
                car: true
              }
            },
            passenger: {
              include: {
                user: true
              }
            }
          }
        }),
        this.prisma.trip.count({ where: { driverId } })
      ]);

      return {
        data: trips.map(toTripDTO),
        total
      };
    } catch (error) {
      return this.handleError(error, 'Error finding trips by driver id');
    }
  }

  async findByPassengerId(passengerId: string, page: number = 1, limit: number = 10): Promise<{ data: TripDTO[]; total: number }> {
    try {
      const skip = (page - 1) * limit;
      const [trips, total] = await Promise.all([
        this.prisma.trip.findMany({
          where: { passengerId },
          skip,
          take: limit,
          include: {
            driver: {
              include: {
                user: true,
                car: true
              }
            },
            passenger: {
              include: {
                user: true
              }
            }
          }
        }),
        this.prisma.trip.count({ where: { passengerId } })
      ]);

      return {
        data: trips.map(toTripDTO),
        total
      };
    } catch (error) {
      return this.handleError(error, 'Error finding trips by passenger id');
    }
  }
}
