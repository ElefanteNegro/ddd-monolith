import { KafkaEventRegistry } from '@Shared/infrastructure/kafka/consumer';
import { driverCreationFailedHandler } from './handlers/DriverCreationFailedHandler';

export const DRIVER_TOPICS = [
  'DriverUserCreatedEvent',
  'DriverCreatedEvent',
  'DriverCreationFailedEvent'
] as const;

export const registerDriverKafkaHandlers = (): void => {
  KafkaEventRegistry.registerTopics([...DRIVER_TOPICS]);
  
  KafkaEventRegistry.register('DriverCreationFailedEvent', driverCreationFailedHandler);
}; 