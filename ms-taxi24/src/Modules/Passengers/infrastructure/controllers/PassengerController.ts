import { Request, Response } from 'express';
import { HttpResponseCodes } from '@Shared/HttpResponseCodes';
import { ValidationError, NotFoundError } from '@Shared/domain/exceptions/AppError';
import { PassengerService } from '@Modules/Passengers/application/services/PassengerService';
import { Logger } from '@Shared/domain/interfaces/Logger';
import { Uuid } from '@Shared/domain/value-object/Uuid';
import { container } from '@Shared/infrastructure/container';

export class PassengerController {
  constructor(
    private readonly passengerService: PassengerService,
    private readonly logger: Logger = container.logger
  ) {}

  async createPassenger(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.body;

      if (!userId) {
        throw new ValidationError('User ID is required');
      }

      // Validate UUID format
      try {
        new Uuid(userId);
      } catch (error) {
        throw new ValidationError('Invalid User ID format');
      }

      const response = await this.passengerService.create(userId);

      if (!response.success) {
        throw new ValidationError(response.message || 'Error creating new passenger');
      }

      res.status(HttpResponseCodes.CREATED).json(response);
    } catch (error) {
      throw error;
    }
  }

  async getAllPassengers(_req: Request, res: Response): Promise<void> {
    try {
      const response = await this.passengerService.getAll();
      
      if (!response.success) {
        throw new ValidationError(response.message || 'Error fetching passengers');
      }

      res.status(HttpResponseCodes.OK).json(response);
    } catch (error) {
      throw error;
    }
  }

  async getPassengerById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        throw new ValidationError('Passenger ID is required');
      }

      // Validate UUID format
      try {
        new Uuid(id);
      } catch (error) {
        throw new ValidationError('Invalid Passenger ID format');
      }

      const response = await this.passengerService.getById(id);

      if (!response.success) {
        throw new NotFoundError('Passenger not found');
      }

      res.status(HttpResponseCodes.OK).json(response);
    } catch (error) {
      throw error;
    }
  }
} 