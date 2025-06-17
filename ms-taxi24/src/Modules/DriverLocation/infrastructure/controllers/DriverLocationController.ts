import { Request, Response } from 'express';
import { DriverLocationService } from '../../application/services/DriverLocationService';
import { Logger } from '@Modules/Shared/domain/interfaces/Logger';

export class DriverLocationController {
  constructor(
    private readonly driverLocationService: DriverLocationService,
    private readonly logger: Logger
  ) {}

  private handleError(error: any, res: Response, message: string): void {
    this.logger.error(message, error);
    res.status(500).json({
      success: false,
      message: message
    });
  }

  /**
   * Encuentra los conductores más cercanos a una ubicación
   * GET /driver-location/nearby?longitude=X&latitude=Y&limit=3&onlyAvailable=true
   */
  async findNearestDrivers(req: Request, res: Response): Promise<void> {
    this.logger.info('Finding nearest drivers');
    try {
      const { longitude, latitude, limit, onlyAvailable } = req.query;

      if (!longitude || !latitude) {
        res.status(400).json({
          success: false,
          message: 'Longitude and latitude are required'
        });
        return;
      }

      const parsedLongitude = Number(longitude);
      const parsedLatitude = Number(latitude);
      const parsedLimit = limit ? Number(limit) : 3; // Por defecto 3 conductores
      const parsedOnlyAvailable = onlyAvailable === 'true';

      if (isNaN(parsedLongitude) || isNaN(parsedLatitude)) {
        res.status(400).json({
          success: false,
          message: 'Invalid longitude or latitude values'
        });
        return;
      }

      const drivers = await this.driverLocationService.getNearestDrivers(
        parsedLongitude,
        parsedLatitude,
        parsedLimit,
        parsedOnlyAvailable
      );

      if (!drivers || drivers.length === 0) {
        res.status(404).json({
          success: false,
          message: 'No drivers found in the area'
        });
        return;
      }

      res.json({
        success: true,
        data: drivers
      });
    } catch (error) {
      this.handleError(error, res, 'Error finding nearest drivers');
    }
  }

  /**
   * Obtiene la ubicación actual de un conductor específico
   * GET /driver-location/:driverId
   */
  async getDriverLocation(req: Request, res: Response): Promise<void> {
    try {
      const { driverId } = req.params;

      if (!driverId) {
        res.status(400).json({
          success: false,
          message: 'Driver ID is required'
        });
        return;
      }

      const location = await this.driverLocationService.getDriverLocation(driverId);
      if (!location) {
        res.status(404).json({
          success: false,
          message: 'Driver location not found'
        });
        return;
      }

      res.json({
        success: true,
        data: location
      });
    } catch (error) {
      this.handleError(error, res, 'Error getting driver location');
    }
  }

  /**
   * Actualiza la ubicación y disponibilidad de un conductor
   * PUT /driver-location/:driverId
   */
  async updateDriverLocation(req: Request, res: Response): Promise<void> {
    try {
      const { driverId } = req.params;
      const { latitude, longitude, isAvailable } = req.body;

      if (!driverId) {
        res.status(400).json({
          success: false,
          message: 'Driver ID is required'
        });
        return;
      }

      if (!latitude || !longitude || typeof isAvailable !== 'boolean') {
        res.status(400).json({
          success: false,
          message: 'Latitude, longitude and isAvailable are required'
        });
        return;
      }

      const parsedLatitude = Number(latitude);
      const parsedLongitude = Number(longitude);

      if (isNaN(parsedLatitude) || isNaN(parsedLongitude)) {
        res.status(400).json({
          success: false,
          message: 'Invalid latitude or longitude values'
        });
        return;
      }

      await this.driverLocationService.updateDriverLocation(
        driverId,
        parsedLatitude,
        parsedLongitude,
        isAvailable
      );

      res.json({
        success: true,
        message: 'Driver location updated successfully'
      });
    } catch (error) {
      this.handleError(error, res, 'Error updating driver location');
    }
  }

  /**
   * Actualiza solo la disponibilidad de un conductor
   * PATCH /driver-location/:driverId/availability
   */
  async updateDriverAvailability(req: Request, res: Response): Promise<void> {
    try {
      const { driverId } = req.params;
      const { isAvailable } = req.body;

      if (!driverId) {
        res.status(400).json({
          success: false,
          message: 'Driver ID is required'
        });
        return;
      }

      if (typeof isAvailable !== 'boolean') {
        res.status(400).json({
          success: false,
          message: 'isAvailable must be a boolean value'
        });
        return;
      }

      await this.driverLocationService.updateDriverAvailability(driverId, isAvailable);

      res.json({
        success: true,
        message: 'Driver availability updated successfully'
      });
    } catch (error) {
      this.handleError(error, res, 'Error updating driver availability');
    }
  }

  /**
   * Actualiza el estado completo de un conductor
   * PATCH /driver-location/:driverId/status
   */
  async updateDriverStatus(req: Request, res: Response): Promise<void> {
    try {
      const { driverId } = req.params;
      const { isActive, isFree } = req.body;

      if (!driverId) {
        res.status(400).json({
          success: false,
          message: 'Driver ID is required'
        });
        return;
      }

      if (typeof isActive !== 'boolean' || typeof isFree !== 'boolean') {
        res.status(400).json({
          success: false,
          message: 'isActive and isFree must be boolean values'
        });
        return;
      }

      await this.driverLocationService.updateDriverStatus(driverId, isActive, isFree);

      res.json({
        success: true,
        message: 'Driver status updated successfully'
      });
    } catch (error) {
      this.handleError(error, res, 'Error updating driver status');
    }
  }

  /**
   * Elimina un conductor del sistema de ubicaciones
   * DELETE /driver-location/:driverId
   */
  async removeDriver(req: Request, res: Response): Promise<void> {
    try {
      const { driverId } = req.params;

      if (!driverId) {
        res.status(400).json({
          success: false,
          message: 'Driver ID is required'
        });
        return;
      }

      await this.driverLocationService.removeDriver(driverId);

      res.json({
        success: true,
        message: 'Driver removed successfully'
      });
    } catch (error) {
      this.handleError(error, res, 'Error removing driver');
    }
  }
} 