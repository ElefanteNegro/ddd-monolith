import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Email } from '@Shared/domain/value-object/Email';
import { Active } from '@Shared/domain/value-object/Driver/Active';
import { Uuid } from '@Shared/domain/value-object/Uuid';
import { Page } from '@Shared/domain/value-object/Page';
import { HttpResponseCodes } from '@Shared/HttpResponseCodes';
import { DriverService } from '@Modules/Drivers/application/services/DriverService';
import { Logger } from '@Shared/domain/interfaces/Logger';
import { ValidationError, NotFoundError } from '@Shared/domain/exceptions/AppError';
import { container } from '@Shared/infrastructure/container';

export class DriverController {
  constructor(
    private readonly driverService: DriverService,
    private readonly logger: Logger = container.logger
  ) {}

  async createDriver(req: Request, res: Response): Promise<void> {
    try {
      const uuid = new Uuid(uuidv4());
      const email = new Email(req.body.email);
      const active = new Active(req.body.active);
      const userId = req.body.userId;

      const response = await this.driverService.create(
        uuid.valueAsString,
        email,
        active,
        userId
      );

      if (!response.success) {
        throw new ValidationError('Error creating new driver');
      }

      res.status(HttpResponseCodes.CREATED).json(response);
    } catch (error) {
      throw error;
    }
  }

  async getAllDrivers(req: Request, res: Response): Promise<void> {
    try {
      const pageParam = req.query.page;
      const page = new Page(parseInt(pageParam as string) || 1);
      const response = await this.driverService.getAll(page);

      if (!response.success) {
        throw new ValidationError('Error getting all drivers');
      }

      res.status(HttpResponseCodes.OK).json(response);
    } catch (error) {
      throw error;
    }
  }

  async getDriverById(req: Request, res: Response): Promise<void> {
    try {
      const uuidParam = req.params.driverId;
      const response = await this.driverService.getById(uuidParam);

      if (!response.success) {
        throw new NotFoundError('Driver not found');
      }

      res.status(HttpResponseCodes.OK).json(response);
    } catch (error) {
      throw error;
    }
  }

  async deleteDriver(req: Request, res: Response): Promise<void> {
    try {
      const driverId = req.params.driverId;
      const response = await this.driverService.delete(driverId);

      if (!response.success) {
        throw new ValidationError('Error deleting driver');
      }

      res.status(HttpResponseCodes.OK).json(response);
    } catch (error) {
      throw error;
    }
  }

  async assignCar(req: Request, res: Response): Promise<void> {
    try {
      const driverId = req.params.driverId;
      const { carId } = req.body;

      if (!carId) {
        throw new ValidationError('Car ID is required');
      }

      const response = await this.driverService.assignCar(driverId, carId);

      if (!response.success) {
        throw new ValidationError('Error assigning car to driver');
      }

      res.status(HttpResponseCodes.OK).json(response);
    } catch (error) {
      throw error;
    }
  }

  async updateDriver(req: Request, res: Response): Promise<void> {
    try {
      const driverId = req.params.driverId;
      const { active } = req.body;

      const response = await this.driverService.update(driverId, {
        active: active !== undefined ? new Active(active) : undefined
      });

      if (!response.success) {
        throw new ValidationError('Error updating driver');
      }

      res.status(HttpResponseCodes.OK).json(response);
    } catch (error) {
      throw error;
    }
  }

  async getAllDriversActive(req: Request, res: Response): Promise<void> {
    try {
      const pageParam = req.query.page;
      const page = new Page(parseInt(pageParam as string) || 1);
      const response = await this.driverService.getAllActive(page);

      if (!response.success) {
        throw new ValidationError('Error getting active drivers');
      }

      res.status(HttpResponseCodes.OK).json(response);
    } catch (error) {
      throw error;
    }
  }
}
