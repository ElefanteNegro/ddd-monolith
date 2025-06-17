import { TripService } from '../application/services/TripService';
import { TripRepository } from '../infrastructure/repositories/TripRepository';
import { PrismaClient } from '@prisma/client';
import WinstonLogger from '@Shared/infrastructure/WinstoneLogger';
import { TripStatus } from '@prisma/client';

jest.mock('@prisma/client');
jest.mock('@Shared/infrastructure/WinstoneLogger');

describe('TripService', () => {
  let tripService: TripService;
  let mockTripRepository: jest.Mocked<TripRepository>;

  beforeEach(() => {
    mockTripRepository = {
      create: jest.fn(),
      getAll: jest.fn(),
      getById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    } as any;

    tripService = new TripService(mockTripRepository);
  });

  describe('create', () => {
    it('should create a new trip', async () => {
      const tripData = {
        origin: 'Origin',
        destination: 'Destination',
        status: TripStatus.REQUESTED,
        fare: 100,
        driverId: 'driver-123',
        passengerId: 'passenger-123'
      };

      mockTripRepository.create.mockResolvedValue({ success: true, message: 'Trip created successfully' });

      const result = await tripService.create(tripData);

      expect(result.success).toBe(true);
      expect(mockTripRepository.create).toHaveBeenCalledWith(tripData);
    });
  });

  describe('getById', () => {
    it('should return a trip by id', async () => {
      const mockTrip = {
        id: 'trip-123',
        origin: 'Origin',
        destination: 'Destination',
        status: TripStatus.REQUESTED,
        fare: 100,
        driverId: 'driver-123',
        passengerId: 'passenger-123',
        createdAt: new Date(),
        completedAt: null,
        cancelledAt: null
      };

      mockTripRepository.getById.mockResolvedValue({ success: true, data: mockTrip });

      const result = await tripService.getById('trip-123');

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockTrip);
      expect(mockTripRepository.getById).toHaveBeenCalledWith('trip-123');
    });
  });
}); 