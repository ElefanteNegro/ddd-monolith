import { DriverCreationFailedEvent } from '@Modules/Drivers/model/events/DriverCreationFailedEvent';
import { Logger } from '@Shared/domain/interfaces/Logger';
import { UserService } from '../services/UserService';

export const handleDriverCreationFailed = (userService: UserService, logger: Logger) =>
  async (event: DriverCreationFailedEvent): Promise<void> => {
    try {
      // Desactivar el usuario
      await userService.update(event.user.id, { active: false });
      
      logger.info(`User ${event.user.email} deactivated due to driver creation failure`);
      
      // TODO: Implementar notificación al usuario cuando tengamos el servicio
      // await NotificationService.send({
      //   userId: event.user.id,
      //   type: 'ACCOUNT_SETUP_FAILED',
      //   message: 'There was an error setting up your driver account'
      // });
    } catch (error) {
      logger.error(`Error in compensation for user ${event.user.email}:`, error);
    }
  }; 