import { DriverUserCreatedEvent } from '@Modules/Users/model/events/DriverUserCreatedEvent';
import { Logger } from '@Shared/domain/interfaces/Logger';
import { DriverService } from '../services/DriverService';
import { Email } from '@Shared/domain/value-object/Email';
import { Active } from '@Shared/domain/value-object/Driver/Active';
import { v4 as uuidv4 } from 'uuid';

export const handleDriverUserCreated = (driverService: DriverService, logger: Logger) => 
  async (event: DriverUserCreatedEvent): Promise<void> => {
    try {
      const id = uuidv4();
      const email = new Email(event.user.email);
      const active = new Active(true);
      
      await driverService.create(
        id,
        email,
        active,
        event.user.id!
      );
      logger.info(`Driver created for user: ${event.user.email}`);
    } catch (error) {
      logger.error(`Error creating driver for user ${event.user.email}: ${error}`);
      throw error;
    }
  }; 