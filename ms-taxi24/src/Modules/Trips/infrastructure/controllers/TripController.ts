import { Request, Response } from 'express';
import { TripService } from '@Modules/Trips/application/services/TripService';
import Logger from '@Shared/domain/Logger';
import { HttpResponseCodes } from '@Shared/HttpResponseCodes';
import { ControllerError } from '@Shared/domain/exceptions/ControllerException';
import { Uuid } from '@Shared/domain/value-object/Uuid';

export class TripController {
  constructor(
    private readonly tripService: TripService,
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

  async createTrip(req: Request, res: Response): Promise<void> {
    try {
      const { origin, destination, status, fare, driverId, passengerId } = req.body;

      // Validate required fields
      if (!origin || !destination || !status || !fare || !driverId || !passengerId) {
        throw new ControllerError(
          'All fields are required: origin, destination, status, fare, driverId, passengerId',
          HttpResponseCodes.BAD_REQUEST
        );
      }

      // Validate UUIDs
      try {
        new Uuid(driverId);
        new Uuid(passengerId);
      } catch (error) {
        throw new ControllerError(
          'Invalid ID format for driver or passenger',
          HttpResponseCodes.BAD_REQUEST
        );
      }

      // Validate fare is a positive number
      if (typeof fare !== 'number' || fare <= 0) {
        throw new ControllerError(
          'Fare must be a positive number',
          HttpResponseCodes.BAD_REQUEST
        );
      }

      const tripData = {
        origin,
        destination,
        status,
        fare,
        driverId,
        passengerId
      };

      const response = await this.tripService.create(tripData);

      if (!response.success) {
        throw new ControllerError(
          response.message || 'Error creating new trip',
          HttpResponseCodes.BAD_REQUEST
        );
      }

      res.status(HttpResponseCodes.CREATED).json(response);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async getAllTrips(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const perPage = parseInt(req.query.perPage as string) || 10;

      // Validate pagination parameters
      if (page < 1 || perPage < 1) {
        throw new ControllerError(
          'Page and perPage must be positive numbers',
          HttpResponseCodes.BAD_REQUEST
        );
      }

      const response = await this.tripService.getAll(page, perPage);

      if (!response.success) {
        throw new ControllerError(
          response.message || 'Error getting all trips',
          HttpResponseCodes.BAD_REQUEST
        );
      }

      res.status(HttpResponseCodes.OK).json(response);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async getTripById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        throw new ControllerError(
          'Trip ID is required',
          HttpResponseCodes.BAD_REQUEST
        );
      }

      // Validate UUID format
      try {
        new Uuid(id);
      } catch (error) {
        throw new ControllerError(
          'Invalid Trip ID format',
          HttpResponseCodes.BAD_REQUEST
        );
      }

      const response = await this.tripService.getById(id);

      if (!response.success) {
        throw new ControllerError(
          response.message || 'Error getting trip by id',
          HttpResponseCodes.BAD_REQUEST
        );
      }

      res.status(HttpResponseCodes.OK).json(response);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async updateTrip(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { origin, destination, fare, status } = req.body;

      if (!id) {
        throw new ControllerError(
          'Trip ID is required',
          HttpResponseCodes.BAD_REQUEST
        );
      }

      // Validate UUID format
      try {
        new Uuid(id);
      } catch (error) {
        throw new ControllerError(
          'Invalid Trip ID format',
          HttpResponseCodes.BAD_REQUEST
        );
      }

      // Validate fare if provided
      if (fare !== undefined && (typeof fare !== 'number' || fare <= 0)) {
        throw new ControllerError(
          'Fare must be a positive number',
          HttpResponseCodes.BAD_REQUEST
        );
      }

      const tripData = {
        origin,
        destination,
        fare,
        status
      };

      const response = await this.tripService.update(id, tripData);

      if (!response.success) {
        throw new ControllerError(
          response.message || 'Error updating trip',
          HttpResponseCodes.BAD_REQUEST
        );
      }

      res.status(HttpResponseCodes.OK).json(response);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async deleteTrip(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        throw new ControllerError(
          'Trip ID is required',
          HttpResponseCodes.BAD_REQUEST
        );
      }

      // Validate UUID format
      try {
        new Uuid(id);
      } catch (error) {
        throw new ControllerError(
          'Invalid Trip ID format',
          HttpResponseCodes.BAD_REQUEST
        );
      }

      const response = await this.tripService.delete(id);

      if (!response.success) {
        throw new ControllerError(
          response.message || 'Error deleting trip',
          HttpResponseCodes.BAD_REQUEST
        );
      }

      res.status(HttpResponseCodes.OK).json(response);
    } catch (error) {
      this.handleError(error, res);
    }
  }
} 