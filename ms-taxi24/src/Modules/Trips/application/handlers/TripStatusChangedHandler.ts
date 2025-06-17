import { TripStatusChangedEvent } from '../../model/events/TripStatusChangedEvent';
import { Logger } from '@Modules/Shared/domain/interfaces/Logger';

export const handleTripStatusChanged = async (event: TripStatusChangedEvent): Promise<void> => {
  try {
    // Aquí implementaríamos la lógica para notificar a los involucrados
    // Por ejemplo, notificar al pasajero cuando el conductor acepta el viaje
    console.log(`Trip ${event.trip.id} status changed from ${event.previousStatus} to ${event.newStatus}`);
    
    // Implementación de ejemplo:
    // if (event.newStatus === 'IN_PROGRESS') {
    //   await notificationService.sendToPassenger(event.trip.passengerId, {
    //     title: 'Trip Started',
    //     body: 'Your trip has started!'
    //   });
    // }
  } catch (error) {
    console.error('Error handling TripStatusChangedEvent:', error);
    throw error;
  }
}; 