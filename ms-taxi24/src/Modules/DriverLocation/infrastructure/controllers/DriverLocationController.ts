import { Request, Response } from 'express';
import { HttpResponseCodes } from '@Shared/HttpResponseCodes';
import { ValidationError } from '@Shared/domain/exceptions/AppError';
import { DriverLocationService } from '@Modules/DriverLocation/application/services/DriverLocationService';
import { Logger } from '@Shared/domain/interfaces/Logger';
import { container } from '@Shared/infrastructure/container';

export class DriverLocationController {
  constructor(
    private readonly driverLocationService: DriverLocationService,
    private readonly logger: Logger = container.logger
  ) {}

  async findNearestDrivers(req: Request, res: Response): Promise<void> {
    try {
      const { longitude, latitude, limit, onlyAvailable } = req.query;

      if (!longitude || !latitude) {
        throw new ValidationError('Longitude and latitude are required');
      }

      const response = await this.driverLocationService.getNearestDrivers(
        Number(longitude),
        Number(latitude),
        limit ? Number(limit) : 3,
        onlyAvailable === 'true'
      );

      res.status(HttpResponseCodes.OK).json({
        success: true,
        data: response
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getDriverLocation(req: Request, res: Response): Promise<void> {
    try {
      const { driverId } = req.params;

      if (!driverId) {
        throw new ValidationError('Driver ID is required');
      }

      const location = await this.driverLocationService.getDriverLocation(driverId);
      if (!location) {
        res.status(HttpResponseCodes.NOT_FOUND).json({
          success: false,
          message: 'Driver location not found. The driver may not have updated their location yet.',
          code: 'NOT_FOUND'
        });
        return;
      }

      res.status(HttpResponseCodes.OK).json({
        success: true,
        data: location
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async updateDriverLocation(req: Request, res: Response): Promise<void> {
    try {
      const { driverId } = req.params;
      const { latitude, longitude, isAvailable } = req.body;

      if (!driverId) {
        throw new ValidationError('Driver ID is required');
      }

      if (longitude === undefined || latitude === undefined || typeof isAvailable !== 'boolean') {
        throw new ValidationError('Longitude, latitude and isAvailable are required');
      }

      await this.driverLocationService.updateDriverLocation(
        driverId,
        latitude,
        longitude,
        isAvailable
      );

      res.status(HttpResponseCodes.OK).json({
        success: true,
        message: 'Driver location updated successfully'
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async updateDriverAvailability(req: Request, res: Response): Promise<void> {
    try {
      const { driverId } = req.params;
      const { isAvailable } = req.body;

      if (!driverId) {
        throw new ValidationError('Driver ID is required');
      }

      if (typeof isAvailable !== 'boolean') {
        throw new ValidationError('isAvailable must be a boolean value');
      }

      await this.driverLocationService.updateDriverAvailability(driverId, isAvailable);

      res.status(HttpResponseCodes.OK).json({
        success: true,
        message: 'Driver availability updated successfully'
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async updateDriverStatus(req: Request, res: Response): Promise<void> {
    try {
      const { driverId } = req.params;
      const { isActive, isFree } = req.body;

      if (!driverId) {
        throw new ValidationError('Driver ID is required');
      }

      if (typeof isActive !== 'boolean' || typeof isFree !== 'boolean') {
        throw new ValidationError('isActive and isFree must be boolean values');
      }

      await this.driverLocationService.updateDriverStatus(driverId, isActive, isFree);

      res.json({
        success: true,
        message: 'Driver status updated successfully'
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async removeDriver(req: Request, res: Response): Promise<void> {
    try {
      const { driverId } = req.params;

      if (!driverId) {
        throw new ValidationError('Driver ID is required');
      }

      await this.driverLocationService.removeDriver(driverId);

      res.status(HttpResponseCodes.OK).json({
        success: true,
        message: 'Driver removed successfully'
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
} 