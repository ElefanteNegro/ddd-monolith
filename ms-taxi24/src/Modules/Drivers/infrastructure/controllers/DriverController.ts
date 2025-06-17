import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Name } from '@Shared/domain/value-object/Driver/Name';
import { LastName } from '@Shared/domain/value-object/Driver/LastName';
import { Email } from '@Shared/domain/value-object/Email';
import { Phone } from '@Shared/domain/value-object/Driver/Phone';
import { Active } from '@Shared/domain/value-object/Driver/Active';
import { Uuid } from '@Shared/domain/value-object/Uuid';
import { CreatedAt } from '@Shared/domain/value-object/CreatedAt';
import { Page } from '@Shared/domain/value-object/Page';
import { HttpResponseCodes } from '@Shared/HttpResponseCodes';
import { DriversService } from '@Modules/Drivers/application/services/DriverService';
import Logger from '@Shared/domain/Logger';
import WinstonLogger from '@Shared/infrastructure/WinstoneLogger';
import { GeneralConstants } from '@Shared/constants';
import { ControllerError } from '@Shared/domain/exceptions/ControllerException';

export class DriverController {
  constructor(
    private readonly driverService: DriversService,
    private readonly logger: Logger = new WinstonLogger()
  ) {}

  private handleError = (error: unknown, res: Response): void => {
    this.logger.error(error);
    const status =
      error instanceof ControllerError
        ? HttpResponseCodes.BAD_REQUEST
        : HttpResponseCodes.INTERNAL_SERVER_ERROR;
    res.status(status).json({ success: false });
  }

  async createDriver(req: Request, res: Response): Promise<void> {
    try {
      const uuid = new Uuid(uuidv4());
      const name = new Name(req.body.name);
      const lastName = new LastName(req.body.lastName);
      const email = new Email(req.body.email);
      const phone = new Phone(req.body.phone);
      const active = new Active(req.body.active);
      const createdAt = new CreatedAt(new Date());
      const userId = req.body.userId;

      const response = await this.driverService.create(
        uuid.valueAsString,
        name,
        lastName,
        email,
        phone,
        active,
        createdAt,
        userId
      );

      if (!response.success)
        throw new ControllerError(
          'Error creating new driver',
          HttpResponseCodes.BAD_REQUEST
        );

      res.status(HttpResponseCodes.CREATED).json(response);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async updateDriver(req: Request, res: Response): Promise<void> {
    try {
      const driverId = req.params.driverId;
      const { name, lastName, email, phone, active } = req.body;

      const response = await this.driverService.update(driverId, {
        name: name ? new Name(name) : undefined,
        lastName: lastName ? new LastName(lastName) : undefined,
        email: email ? new Email(email) : undefined,
        phone: phone ? new Phone(phone) : undefined,
        active: active !== undefined ? new Active(active) : undefined
      });

      if (!response.success)
        throw new ControllerError(
          'Error updating driver',
          HttpResponseCodes.BAD_REQUEST
        );

      res.status(HttpResponseCodes.OK).json(response);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async deleteDriver(req: Request, res: Response): Promise<void> {
    try {
      const driverId = req.params.driverId;
      const response = await this.driverService.delete(driverId);

      if (!response.success)
        throw new ControllerError(
          'Error deleting driver',
          HttpResponseCodes.BAD_REQUEST
        );

      res.status(HttpResponseCodes.OK).json(response);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async assignCar(req: Request, res: Response): Promise<void> {
    try {
      const driverId = req.params.driverId;
      const { carId } = req.body;

      if (!carId) {
        throw new ControllerError(
          'Car ID is required',
          HttpResponseCodes.BAD_REQUEST
        );
      }

      const response = await this.driverService.assignCar(driverId, carId);

      if (!response.success)
        throw new ControllerError(
          'Error assigning car to driver',
          HttpResponseCodes.BAD_REQUEST
        );

      res.status(HttpResponseCodes.OK).json(response);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async getAllDrivers(req: Request, res: Response): Promise<void> {
    try {
      const pageParam = req.query.page;
      const page = new Page(parseInt(pageParam as string) || 1);
      const response = await this.driverService.getAll(page);

      if (!response.success)
        throw new ControllerError(
          'Error getting all drivers',
          HttpResponseCodes.BAD_REQUEST
        );

      res.status(HttpResponseCodes.OK).send({
        status: GeneralConstants.STATUS_OK,
        drivers: response.data
      });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async getAllDriversActive(req: Request, res: Response): Promise<void> {
    try {
      const pageParam = req.query.page;
      const page = new Page(parseInt(pageParam as string) || 1);
      const response = await this.driverService.getAllActive(page);

      if (!response.success)
        throw new ControllerError(
          'Error getting all drivers',
          HttpResponseCodes.BAD_REQUEST
        );

      res.status(HttpResponseCodes.OK).json(response);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async getDriverById(req: Request, res: Response): Promise<void> {
    try {
      const uuidParam = req.params.driverId;
      const response = await this.driverService.getById(uuidParam);

      if (!response.success) {
        if (response.message?.includes('not found')) {
          res.status(HttpResponseCodes.NOT_FOUND).json({
            success: false,
            message: 'Driver not found'
          });
          return;
        }
        throw new ControllerError(
          'Error getting driver by uuid',
          HttpResponseCodes.BAD_REQUEST
        );
      }

      res.status(HttpResponseCodes.OK).json(response);
    } catch (error) {
      this.handleError(error, res);
    }
  }
}
