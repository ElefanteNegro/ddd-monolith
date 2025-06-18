import { InternalResponse } from '@Shared/dto/InternalResponse';
import { GenericResponse } from '@Shared/dto/GenericResponse';

import { UserRepository } from '@Modules/Users/infrastructure/repositories/UserRepository';
import { UserDTO } from '@Modules/Users/model/UserDTO';
import { UserInterface } from '@Modules/Users/model/interfaces/UserInterface';
import { User } from '@Modules/Users/model/User';
import { Page } from '@Shared/domain/value-object/Page';
import { Logger } from '@Shared/domain/interfaces/Logger';
import { container } from '@Shared/infrastructure/container';
import { DomainEventDispatcher } from '@Shared/DomainEventDispatcher';
import { UserCreatedEvent } from '@Modules/Users/model/events/UserCreatedEvent';
import { DriverUserCreatedEvent } from '@Modules/Users/model/events/DriverUserCreatedEvent';
import { PassengerUserCreatedEvent } from '@Modules/Users/model/events/PassengerUserCreatedEvent';

export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly logger: Logger = container.logger
  ) {}

  async findById(id: string): Promise<GenericResponse<UserDTO>> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      return {
        success: false,
        message: 'User not found'
      };
    }
    return {
      success: true,
      data: user
    };
  }

  async findByEmail(email: string): Promise<GenericResponse<UserDTO>> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      return {
        success: false,
        message: 'User not found'
      };
    }
    return {
      success: true,
      data: user
    };
  }

  async create(userData: UserInterface): Promise<InternalResponse> {
    try {
      this.logger.info('[UserService] Iniciando creación de usuario', { 
        userData: { ...userData, password: '[REDACTED]' } 
      });

      const user = new User(userData);
      await user.setPassword(userData.password);
      
      this.logger.info('[UserService] Usuario creado en memoria', { 
        userId: user.id,
        role: userData.role 
      });

      // Guardar usuario y obtener el usuario creado con id real
      const savedUser = await this.userRepository.save({ ...userData, password: (user as any).password });
      
      this.logger.info('[UserService] Usuario guardado en base de datos', { 
        userId: savedUser.id,
        role: savedUser.role,
        email: savedUser.email 
      });

      // Publicar el evento específico según el rol
      if (savedUser.role === 'DRIVER') {
        this.logger.info('[UserService] Preparando DriverUserCreatedEvent', { 
          userId: savedUser.id 
        });

        // Mapear a UserInterface para el evento
        const eventUser: UserInterface = {
          id: savedUser.id,
          name: savedUser.name,
          lastName: savedUser.lastName,
          email: savedUser.email,
          user: savedUser.user || '',
          password: '', // No es necesario para el evento
          phone: savedUser.phone,
          role: savedUser.role as any,
          active: true,
          createdAt: savedUser.createdAt
        };

        this.logger.info('[UserService] Disparando DriverUserCreatedEvent', { 
          userId: savedUser.id,
          eventData: { ...eventUser, password: '[REDACTED]' }
        });

        await DomainEventDispatcher.dispatch(new DriverUserCreatedEvent(eventUser));
        
        this.logger.info('[UserService] DriverUserCreatedEvent disparado exitosamente', { 
          userId: savedUser.id 
        });
      } else if (savedUser.role === 'PASSENGER') {
        this.logger.info('[UserService] Disparando PassengerUserCreatedEvent', { savedUser });
        const eventUser: UserInterface = {
          id: savedUser.id,
          name: savedUser.name,
          lastName: savedUser.lastName,
          email: savedUser.email,
          user: savedUser.user || '',
          password: '',
          phone: savedUser.phone,
          role: savedUser.role as any,
          active: true,
          createdAt: savedUser.createdAt
        };
        await DomainEventDispatcher.dispatch(new PassengerUserCreatedEvent(eventUser));
      }
      return { success: true, message: 'User created successfully' };
    } catch (error) {
      this.logger.error('[UserService] Error creando usuario', {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        userData: { ...userData, password: '[REDACTED]' }
      });
      return { success: false, message: 'Error creating user' };
    }
  }

  async update(id: string, userData: Partial<UserInterface>): Promise<InternalResponse> {
    try {
      const user = await this.userRepository.findById(id);
      if (!user) {
        return { success: false, message: 'User not found' };
      }
      await this.userRepository.update(id, userData);
      return { success: true, message: 'User updated successfully' };
    } catch (error) {
      this.logger.error(error);
      return { success: false, message: 'Error updating user' };
    }
  }

  async delete(id: string): Promise<InternalResponse> {
    try {
      await this.userRepository.delete(id);
      return { success: true, message: 'User deleted successfully' };
    } catch (error) {
      this.logger.error(error);
      return { success: false, message: 'Error deleting user' };
    }
  }

  async getAll(page: Page, limit: number = 10): Promise<GenericResponse<UserDTO[]>> {
    try {
      const result = await this.userRepository.getAll(page.getValue(), limit);
      return {
        success: true,
        data: result.data
      };
    } catch (error) {
      this.logger.error(error);
      return {
        success: false,
        message: 'Error getting users'
      };
    }
  }

  async authenticate(email: string, password: string): Promise<GenericResponse<UserDTO>> {
    try {
      const user = await this.userRepository.findByEmail(email);
      if (!user) {
        return {
          success: false,
          message: 'Invalid credentials'
        };
      }

      const userEntity = new User(user);
      const isValid = await userEntity.comparePassword(password);
      if (!isValid) {
        return {
          success: false,
          message: 'Invalid credentials'
        };
      }

      return {
        success: true,
        data: user
      };
    } catch (error) {
      this.logger.error(error);
      return {
        success: false,
        message: 'Error authenticating user'
      };
    }
  }
} 