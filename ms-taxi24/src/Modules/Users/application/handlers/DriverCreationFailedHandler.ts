import { DriverCreationFailedEvent } from '@Modules/Drivers/model/events/DriverCreationFailedEvent';
import { Logger } from '@Shared/domain/interfaces/Logger';
import { UserService } from '../services/UserService';
import { kafkaProducer } from '@Shared/infrastructure/kafka/producer';

export const handleDriverCreationFailed = (userService: UserService, logger: Logger) =>
  async (event: DriverCreationFailedEvent): Promise<void> => {
    try {
      // Desactivar el usuario
      await userService.update(event.user.id, { active: false });
      
      logger.info(`User ${event.user.email} deactivated due to driver creation failure`);
    } catch (error) {
      logger.error(`Error in compensation for user ${event.user.email}:`, error);

      await kafkaProducer.send({
        topic: 'DriverCreationFailedEvent',
        messages: [{ value: JSON.stringify(event) }]
      });
    }
  }; 