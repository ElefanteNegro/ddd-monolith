import { DomainEventDispatcher } from '@Shared/DomainEventDispatcher';
import { UserCreatedEvent } from '@Modules/Users/model/events/UserCreatedEvent';
import { handleUserCreated } from '@Modules/Users/application/handlers/UserCreatedHandler';
import { TripCreatedEvent } from '@Modules/Trips/model/events/TripCreatedEvent';
import { TripStatusChangedEvent } from '@Modules/Trips/model/events/TripStatusChangedEvent';
import { handleTripCreated } from '@Modules/Trips/application/handlers/TripCreatedHandler';
import { handleTripStatusChanged } from '@Modules/Trips/application/handlers/TripStatusChangedHandler';
import WinstonLogger from '@Modules/Shared/infrastructure/WinstoneLogger';

export const registerDomainEvents = (): void => {
  console.log('[DomainEvents] Registering domain event handlers...');
  
  const logger = new WinstonLogger();
  
  // User events
  DomainEventDispatcher.register<UserCreatedEvent>('UserCreatedEvent', handleUserCreated);
  
  // Trip events
  DomainEventDispatcher.register<TripCreatedEvent>('TripCreatedEvent', handleTripCreated);
  DomainEventDispatcher.register<TripStatusChangedEvent>('TripStatusChangedEvent', handleTripStatusChanged);
};
