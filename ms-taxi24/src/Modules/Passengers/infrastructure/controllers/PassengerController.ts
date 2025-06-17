import { Request, Response } from 'express';
import { HttpResponseCodes } from '@Shared/HttpResponseCodes';
import { ControllerError } from '@Shared/domain/exceptions/ControllerException';
import { PassengerService } from '@Modules/Passengers/application/services/PassengerService';
import Logger from '@Shared/domain/Logger';
import { Uuid } from '@Shared/domain/value-object/Uuid';

export class PassengerController {
  constructor(
    private readonly passengerService: PassengerService,
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

  async createPassenger(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.body;

      if (!userId) {
        throw new ControllerError(
          'User ID is required',
          HttpResponseCodes.BAD_REQUEST
        );
      }

      // Validate UUID format
      try {
        new Uuid(userId);
      } catch (error) {
        throw new ControllerError(
          'Invalid User ID format',
          HttpResponseCodes.BAD_REQUEST
        );
      }

      const response = await this.passengerService.create(userId);

      if (!response.success) {
        throw new ControllerError(
          response.message || 'Error creating new passenger',
          HttpResponseCodes.BAD_REQUEST
        );
      }

      res.status(HttpResponseCodes.CREATED).json(response);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async getAllPassengers(_req: Request, res: Response): Promise<void> {
    try {
      const response = await this.passengerService.getAll();
      
      if (!response.success) {
        throw new ControllerError(
          response.message || 'Error fetching passengers',
          HttpResponseCodes.INTERNAL_SERVER_ERROR
        );
      }

      res.status(HttpResponseCodes.OK).json(response);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async getPassengerById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        throw new ControllerError(
          'Passenger ID is required',
          HttpResponseCodes.BAD_REQUEST
        );
      }

      // Validate UUID format
      try {
        new Uuid(id);
      } catch (error) {
        throw new ControllerError(
          'Invalid Passenger ID format',
          HttpResponseCodes.BAD_REQUEST
        );
      }

      const response = await this.passengerService.getById(id);

      if (!response.success) {
        throw new ControllerError(
          response.message || 'Passenger not found',
          HttpResponseCodes.NOT_FOUND
        );
      }

      res.status(HttpResponseCodes.OK).json(response);
    } catch (error) {
      this.handleError(error, res);
    }
  }
} 