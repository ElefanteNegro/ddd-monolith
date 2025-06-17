import { PassengerUserCreatedEvent } from '@Modules/Users/model/events/PassengerUserCreatedEvent';
import { Logger } from '@Shared/domain/interfaces/Logger';
import { PassengerService } from '../services/PassengerService';

export const handlePassengerUserCreated = (passengerService: PassengerService, logger: Logger) =>
  async (event: PassengerUserCreatedEvent): Promise<void> => {
    try {
      await passengerService.create(event.user.id!);
      logger.info(`Passenger created for user: ${event.user.email}`);
    } catch (error) {
      logger.error(`Error creating passenger for user ${event.user.email}: ${error}`);
      throw error;
    }
  }; 