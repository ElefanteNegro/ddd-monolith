import { DriverCreationFailedEvent } from '@Modules/Drivers/model/events/DriverCreationFailedEvent';
import { DomainEventDispatcher } from '@Shared/DomainEventDispatcher';
import { container } from '@Shared/infrastructure/container';
import { KafkaEventHandler } from '@Shared/infrastructure/kafka/types';
import { UserDTO } from '@Modules/Users/model/UserDTO';

const logger = container.logger;

interface DriverCreationFailedMessage {
  user: UserDTO;
}

export const driverCreationFailedHandler: KafkaEventHandler<DriverCreationFailedMessage> = {
  handle: async (message: DriverCreationFailedMessage): Promise<void> => {
    try {
      logger.info('[Kafka] Deserializando DriverCreationFailedEvent', { 
        userId: message.user?.id 
      });

      const event = new DriverCreationFailedEvent(message.user);
      await DomainEventDispatcher.dispatch(event);

      logger.info('[Kafka] DriverCreationFailedEvent delegado al DomainEventDispatcher', { 
        userId: message.user?.id 
      });
    } catch (error) {
      logger.error('[Kafka] Error deserializando DriverCreationFailedEvent', {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        message
      });
      throw error;
    }
  }
}; 