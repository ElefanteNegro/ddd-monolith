import { Active } from '@Shared/domain/value-object/Driver/Active';
import { Page } from '@Shared/domain/value-object/Page';
import { Email } from '@Shared/domain/value-object/Email';

import { InternalResponse } from '@Shared/dto/InternalResponse';
import { GenericResponse } from '@Shared/dto/GenericResponse';

import { DriverInterface } from '@Modules/Drivers/model/interfaces/DriverInterface';
import { DriverDTO } from '@Modules/Drivers/model/DriverDTO';

import { DriverRepository } from '@Modules/Drivers/infrastructure/repositories/DriverRepository';
import { Logger } from '@Shared/domain/interfaces/Logger';
import { container } from '@Shared/infrastructure/container';

import { Constants } from '@Modules/Drivers/Shared/constants';
import { CaseUseException } from '@Shared/domain/exceptions/CaseUseException';

import { DriverCreatedEvent } from '@Modules/Drivers/model/events/DriverCreatedEvent';
import { DomainEventDispatcher } from '@Shared/DomainEventDispatcher';

export class DriverService {
  constructor(
    private readonly driverRepository: DriverRepository,
    private readonly logger: Logger = container.logger
  ) {}

  async create(
    id: string,
    email: Email,
    active: Active,
    userId: string
  ): Promise<InternalResponse> {
    try {
      this.logger.info('[DriverService] Intentando guardar driver', {
        id,
        email: email.value,
        active: active.value,
        userId
      });

      const driver: DriverInterface = {
        id,
        userId,
        active: active.value
      };

      this.logger.info('[DriverService] Driver creado en memoria', {
        driverId: driver.id,
        userId: driver.userId,
        active: driver.active
      });

      const event = new DriverCreatedEvent(driver.id, email.value);
      DomainEventDispatcher.dispatch(event);
      const result = await this.driverRepository.save(driver);

      this.logger.info('[DriverService] Driver guardado en base de datos', {
        driverId: result.id,
        userId: result.userId,
        active: result.active
      });

      return { success: true, data: result };
    } catch (error) {
      this.logger.error('[DriverService] Error creando driver', {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        id,
        email: email.value,
        active: active.value,
        userId
      });
      throw new CaseUseException('Error creating driver');
    }
  }

  async update(
    driverId: string,
    data: {
      active?: Active;
    }
  ): Promise<GenericResponse<DriverDTO>> {
    try {
      const result = await this.driverRepository.update(driverId, {
        active: data.active?.value
      });
      return { success: true, data: result };
    } catch (error) {
      this.logger.error(error);
      return { success: false, message: 'Error updating driver' };
    }
  }

  async delete(driverId: string): Promise<GenericResponse<void>> {
    try {
      await this.driverRepository.delete(driverId);
      return { success: true };
    } catch (error) {
      this.logger.error(error);
      return { success: false, message: 'Error deleting driver' };
    }
  }

  async assignCar(driverId: string, carId: string): Promise<GenericResponse<DriverDTO>> {
    try {
      const result = await this.driverRepository.assignCar(driverId, carId);
      return { success: true, data: result };
    } catch (error) {
      this.logger.error(error);
      return { success: false, message: 'Error assigning car to driver' };
    }
  }

  async getAll(page: Page): Promise<GenericResponse<DriverDTO[]>> {
    const perPage = Constants.RECORDS_PER_PAGE;
    try {
      const result = await this.driverRepository.getAll(page.getValue(), perPage);
      return {
        success: true,
        data: result.data
      };
    } catch (error) {
      this.logger.error(error);
      return { success: false, message: 'Error fetching drivers' };
    }
  }

  async getAllActive(page: Page): Promise<GenericResponse<DriverDTO[]>> {
    const perPage = Constants.RECORDS_PER_PAGE;
    try {
      const result = await this.driverRepository.getAllActive(page.getValue(), perPage);
      return {
        success: true,
        data: result.data
      };
    } catch (error) {
      this.logger.error(error);
      return { success: false, message: 'Error fetching drivers' };
    }
  }

  async getById(id: string): Promise<GenericResponse<DriverDTO>> {
    try {
      const result = await this.driverRepository.findById(id);
      if (!result) {
        return { success: false, message: 'Driver not found' };
      }
      return { success: true, data: result };
    } catch (error) {
      this.logger.error(error);
      return { success: false, message: 'Error fetching driver by ID' };
    }
  }
}
