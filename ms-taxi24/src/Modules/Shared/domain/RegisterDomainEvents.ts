import { DomainEventDispatcher } from '@Shared/DomainEventDispatcher';
import { DriverUserCreatedEvent } from '@Modules/Users/model/events/DriverUserCreatedEvent';
import { PassengerUserCreatedEvent } from '@Modules/Users/model/events/PassengerUserCreatedEvent';
import { TripCreatedEvent } from '@Modules/Trips/model/events/TripCreatedEvent';
import { TripStatusChangedEvent } from '@Modules/Trips/model/events/TripStatusChangedEvent';
import { handleDriverUserCreated } from '@Modules/Drivers/application/handlers/UserCreatedHandler';
import { handlePassengerUserCreated } from '@Modules/Passengers/application/handlers/UserCreatedHandler';
import { handleTripCreated } from '@Modules/Trips/application/handlers/TripCreatedHandler';
import { handleTripStatusChanged } from '@Modules/Trips/application/handlers/TripStatusChangedHandler';
import { DriverService } from '@Modules/Drivers/application/services/DriverService';
import { DriverRepository } from '@Modules/Drivers/infrastructure/repositories/DriverRepository';
import { PassengerService } from '@Modules/Passengers/application/services/PassengerService';
import { PassengerRepository } from '@Modules/Passengers/infrastructure/repositories/PassengerRepository';
import { UserService } from '@Modules/Users/application/services/UserService';
import { UserRepository } from '@Modules/Users/infrastructure/repositories/UserRepository';
import { container } from '@Shared/infrastructure/container';
import { handleDriverCreationFailed } from '@Modules/Users/application/handlers/DriverCreationFailedHandler';
import { DriverCreationFailedEvent } from '@Modules/Drivers/model/events/DriverCreationFailedEvent';

export const registerDomainEvents = (): void => {
  const { logger, prisma } = container;
  
  // Initialize repositories
  const driverRepository = new DriverRepository(prisma, logger);
  const passengerRepository = new PassengerRepository(prisma, logger);
  const userRepository = new UserRepository(prisma, logger);
  
  // Initialize services
  const driverService = new DriverService(driverRepository, logger);
  const passengerService = new PassengerService(passengerRepository, logger);
  const userService = new UserService(userRepository, logger);
  
  // Register event handlers
  DomainEventDispatcher.register<DriverUserCreatedEvent>(
    'DriverUserCreatedEvent', 
    handleDriverUserCreated(driverService, logger)
  );
  
  DomainEventDispatcher.register<PassengerUserCreatedEvent>(
    'PassengerUserCreatedEvent', 
    handlePassengerUserCreated(passengerService, logger)
  );
  
  DomainEventDispatcher.register<TripCreatedEvent>(
    'TripCreatedEvent', 
    handleTripCreated
  );
  
  DomainEventDispatcher.register<TripStatusChangedEvent>(
    'TripStatusChangedEvent', 
    handleTripStatusChanged
  );
  
  DomainEventDispatcher.register<DriverCreationFailedEvent>(
    'DriverCreationFailedEvent',
    handleDriverCreationFailed(userService, logger)
  );
  
  logger.info('Domain event handlers registered successfully');
};
