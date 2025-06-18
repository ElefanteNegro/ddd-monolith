import { DriverUserCreatedEvent } from '@Modules/Users/model/events/DriverUserCreatedEvent';
import { Logger } from '@Shared/domain/interfaces/Logger';
import { DriverService } from '../services/DriverService';
import { Email } from '@Shared/domain/value-object/Email';
import { Active } from '@Shared/domain/value-object/Driver/Active';
import { v4 as uuidv4 } from 'uuid';
import { DomainEventDispatcher } from '@Shared/DomainEventDispatcher';
import { DriverCreationFailedEvent } from '@Modules/Drivers/model/events/DriverCreationFailedEvent';
import { UserMapper } from '@Modules/Users/model/Mappers/UserMapper';
import { kafkaProducer } from '@Shared/infrastructure/kafka/producer';

export const handleDriverUserCreated = (driverService: DriverService, logger: Logger) => 
  async (event: DriverUserCreatedEvent): Promise<void> => {
    try {
      logger.info('UserCreatedHandler.handle - Iniciando manejo de evento DriverUserCreated', {
        userId: event.user.id,
        timestamp: event.occurredOn
      });

      if (!event.user.id) {
        logger.error('UserCreatedHandler.handle - Error: userId no está definido en el evento', {
          eventData: event
        });
        throw new Error('userId is required to create a driver');
      }

      const id = uuidv4();
      const email = new Email(event.user.email);
      const active = new Active(true);

      logger.info('UserCreatedHandler.handle - Iniciando creación de conductor', {
        userId: event.user.id,
        eventId: id
      });

      const result = await driverService.create(id, email, active, event.user.id);
      
      if (!result.success) {
        throw new Error(result.message || 'Error creating driver');
      }

      logger.info('UserCreatedHandler.handle - Conductor creado exitosamente', {
        driverId: id,
        userId: event.user.id,
        eventId: id
      });

      // Intentar publicar en Kafka después de crear el driver exitosamente
      try {
        await kafkaProducer.send({
          topic: 'DriverUserCreatedEvent',
          messages: [
            { value: JSON.stringify(event) }
          ]
        });
        logger.info('UserCreatedHandler.handle - Evento publicado en Kafka', {
          userId: event.user.id,
          topic: 'DriverUserCreatedEvent'
        });
      } catch (kafkaError) {
        logger.error('UserCreatedHandler.handle - Error publicando en Kafka', {
          error: kafkaError instanceof Error ? kafkaError.message : 'Unknown error',
          userId: event.user.id
        });
        // No lanzamos el error para no afectar el flujo principal
      }
    } catch (error) {
      logger.error('UserCreatedHandler.handle - Error al procesar evento DriverUserCreated', {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        userId: event.user.id
      });
      
      // Convertir el usuario a DTO antes de crear el evento
      const userDTO = UserMapper.toDTO(event.user);
      await DomainEventDispatcher.dispatch(new DriverCreationFailedEvent(userDTO));
    }
  }; 