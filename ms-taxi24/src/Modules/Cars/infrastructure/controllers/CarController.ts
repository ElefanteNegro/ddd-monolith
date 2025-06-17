import { Request, Response } from 'express';
import { CarService } from '../../application/services/CarService';
import { HttpResponseCodes } from '@Shared/HttpResponseCodes';
import { ControllerError } from '@Shared/domain/exceptions/ControllerException';
import Logger from '@Shared/domain/Logger';
import { Uuid } from '@Shared/domain/value-object/Uuid';

export class CarController {
  constructor(
    private readonly carService: CarService,
    private readonly logger: Logger
  ) {}

  private handleError = (error: unknown, res: Response): void => {
    this.logger.error(error);
    const status = error instanceof ControllerError
      ? error.statusCode
      : HttpResponseCodes.INTERNAL_SERVER_ERROR;
    
    const message = error instanceof Error ? error.message : 'An unexpected error occurred';
    res.status(status).json({ 
      success: false,
      message 
    });
  }

  async createCar(req: Request, res: Response): Promise<void> {
    try {
      const { driverId, plate, brand, model, year, color } = req.body;

      if (!driverId || !plate || !brand || !model || !year || !color) {
        throw new ControllerError(
          'All fields are required',
          HttpResponseCodes.BAD_REQUEST
        );
      }

      // Validate UUID format
      try {
        new Uuid(driverId);
      } catch (error) {
        throw new ControllerError(
          'Invalid Driver ID format',
          HttpResponseCodes.BAD_REQUEST
        );
      }

      // Validate year
      if (typeof year !== 'number' || year < 1900 || year > new Date().getFullYear()) {
        throw new ControllerError(
          'Invalid year',
          HttpResponseCodes.BAD_REQUEST
        );
      }

      const car = await this.carService.createCar({
        driverId,
        plate,
        brand,
        model,
        year,
        color
      });

      res.status(HttpResponseCodes.CREATED).json({
        success: true,
        data: car
      });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async getCarById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        throw new ControllerError(
          'Car ID is required',
          HttpResponseCodes.BAD_REQUEST
        );
      }

      // Validate UUID format
      try {
        new Uuid(id);
      } catch (error) {
        throw new ControllerError(
          'Invalid Car ID format',
          HttpResponseCodes.BAD_REQUEST
        );
      }

      const car = await this.carService.getCarById(id);

      if (!car) {
        throw new ControllerError(
          'Car not found',
          HttpResponseCodes.NOT_FOUND
        );
      }

      res.status(HttpResponseCodes.OK).json({
        success: true,
        data: car
      });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async getCarsByDriver(req: Request, res: Response): Promise<void> {
    try {
      const { driverId } = req.params;

      if (!driverId) {
        throw new ControllerError(
          'Driver ID is required',
          HttpResponseCodes.BAD_REQUEST
        );
      }

      // Validate UUID format
      try {
        new Uuid(driverId);
      } catch (error) {
        throw new ControllerError(
          'Invalid Driver ID format',
          HttpResponseCodes.BAD_REQUEST
        );
      }

      const cars = await this.carService.getCarsByDriver(driverId);

      res.status(HttpResponseCodes.OK).json({
        success: true,
        data: cars
      });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async updateCar(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { plate, brand, model, year, color } = req.body;

      if (!id) {
        throw new ControllerError(
          'Car ID is required',
          HttpResponseCodes.BAD_REQUEST
        );
      }

      // Validate UUID format
      try {
        new Uuid(id);
      } catch (error) {
        throw new ControllerError(
          'Invalid Car ID format',
          HttpResponseCodes.BAD_REQUEST
        );
      }

      // Validate year if provided
      if (year !== undefined && (typeof year !== 'number' || year < 1900 || year > new Date().getFullYear())) {
        throw new ControllerError(
          'Invalid year',
          HttpResponseCodes.BAD_REQUEST
        );
      }

      const car = await this.carService.updateCar(id, {
        plate,
        brand,
        model,
        year,
        color
      });

      res.status(HttpResponseCodes.OK).json({
        success: true,
        data: car
      });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async deleteCar(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        throw new ControllerError(
          'Car ID is required',
          HttpResponseCodes.BAD_REQUEST
        );
      }

      // Validate UUID format
      try {
        new Uuid(id);
      } catch (error) {
        throw new ControllerError(
          'Invalid Car ID format',
          HttpResponseCodes.BAD_REQUEST
        );
      }

      await this.carService.deleteCar(id);

      res.status(HttpResponseCodes.OK).json({
        success: true,
        message: 'Car deleted successfully'
      });
    } catch (error) {
      this.handleError(error, res);
    }
  }
} 