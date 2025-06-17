import { DriverLocationUpdatedEvent } from '../../domain/events/DriverLocationUpdatedEvent';
import { DriverLocationRepository } from '../../domain/interfaces/DriverLocationInterface';
import { Logger } from '@Modules/Shared/domain/interfaces/Logger';

export const handleDriverLocationUpdated = async (
  event: DriverLocationUpdatedEvent,
  driverLocationRepository: DriverLocationRepository,
  logger: Logger
): Promise<void> => {
  try {
    await driverLocationRepository.updateLocation(
      event.driverId,
      event.latitude,
      event.longitude,
      event.isAvailable
    );
    logger.info(`Driver location updated for driver ${event.driverId}`);
  } catch (error) {
    logger.error(`Error handling driver location update for driver ${event.driverId}:`, error);
    throw error;
  }
}; 