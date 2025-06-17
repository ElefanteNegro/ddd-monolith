import { DomainEventHandler } from '@Modules/Shared/domain/events/DomainEventBus';
import { TripCreatedEvent } from '../../domain/events/TripCreatedEvent';
import { Logger } from '@Modules/Shared/domain/interfaces/Logger';

export class NotifyDriverTripCreatedHandler implements DomainEventHandler<TripCreatedEvent> {
  constructor(private readonly logger: Logger) {}

  async handle(event: TripCreatedEvent): Promise<void> {
    try {
      // Aquí implementaríamos la lógica para notificar al conductor
      // Por ejemplo, enviar una notificación push, SMS, etc.
      this.logger.info(`Notifying driver ${event.trip.driverId} about new trip ${event.trip.id}`);
      
      // Implementación de ejemplo:
      // await this.notificationService.sendToDriver(event.trip.driverId, {
      //   title: 'New Trip Request',
      //   body: `You have a new trip request from ${event.trip.startLocation} to ${event.trip.endLocation}`
      // });
    } catch (error) {
      this.logger.error('Error notifying driver about new trip:', error);
      throw error;
    }
  }
} 