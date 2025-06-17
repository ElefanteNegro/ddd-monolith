import { TripRepository } from '@Modules/Trips/infrastructure/repositories/TripRepository';
import { TripInterface } from '@Modules/Trips/model/interfaces/TripInterface';
import { InternalResponse } from '@Shared/dto/InternalResponse';
import Logger from '@Shared/domain/Logger';
import { CaseUseException } from '@Shared/domain/exceptions/CaseUseException';
import { TripCompletedEvent } from '@Modules/Trips/domain/events/TripCompletedEvent';
import { DomainEventDispatcher } from '@Shared/DomainEventDispatcher';

export class TripService {
  constructor(
    private readonly tripRepository: TripRepository,
    private readonly logger: Logger
  ) {}

  // async create(tripData: TripInterface): Promise<InternalResponse> {
  //   try {
  //     return await this.tripRepository.create(tripData);
  //   } catch (error) {
  //     this.logger.error(error);
  //     throw new CaseUseException('Error creating trip');
  //   }
  // }

  // async getById(id: string): Promise<InternalResponse<TripInterface>> {
  //   try {
  //     return await this.tripRepository.getById(id);
  //   } catch (error) {
  //     this.logger.error(error);
  //     return { success: false, message: 'Error fetching trip by ID' };
  //   }
  // }

  async update(id: string, tripData: Partial<TripInterface>): Promise<InternalResponse> {
    try {
      const existingTrip = await this.tripRepository.findById(id);
      if (!existingTrip) {
        return { success: false, message: 'Trip not found' };
      }
  
      const previousStatus = existingTrip.status;
  
      const updatedTripData: TripInterface = {
        ...existingTrip,
        ...tripData,
        driverId: String(tripData.driverId ?? existingTrip.driverId),
        passengerId: tripData.passengerId ?? existingTrip.passengerId,
      };
  
      const updated = await this.tripRepository.update(id, updatedTripData);
  
      if (
        tripData.status === 'COMPLETED' &&
        previousStatus !== 'COMPLETED'
      ) {
        const event = new TripCompletedEvent(
          updatedTripData.id,
          updatedTripData.passengerId,
          updatedTripData.driverId,
          updatedTripData.fare ?? 0,
          new Date()
        );
  
        DomainEventDispatcher.dispatch(event);
      }
  
      return { success: true, data: updated };
    } catch (error) {
      this.logger.error(error);
      return { success: false, message: 'Error updating trip' };
    }
  }
  
  

  // async delete(id: string): Promise<InternalResponse> {
  //   try {
  //     return await this.tripRepository.delete(id);
  //   } catch (error) {
  //     this.logger.error(error);
  //     return { success: false, message: 'Error deleting trip' };
  //   }
  // }
}
