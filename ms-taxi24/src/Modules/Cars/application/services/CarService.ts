import { Car, CarRepository } from '../../domain/interfaces/CarInterface';
import { Logger } from '@Modules/Shared/domain/interfaces/Logger';
import WinstonLogger from '@Modules/Shared/infrastructure/WinstoneLogger';

export class CarService {
  constructor(
    private readonly carRepository: CarRepository,
    private readonly logger: Logger = new WinstonLogger()
  ) {}

  async createCar(carData: Omit<Car, 'id' | 'createdAt' | 'updatedAt'>): Promise<Car> {
    try {
      return await this.carRepository.create(carData);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getCarById(id: string): Promise<Car | null> {
    try {
      return await this.carRepository.findById(id);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getCarsByDriver(driverId: string): Promise<Car[]> {
    try {
      return await this.carRepository.findByDriverId(driverId);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async updateCar(id: string, carData: Partial<Car>): Promise<Car> {
    try {
      return await this.carRepository.update(id, carData);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async deleteCar(id: string): Promise<void> {
    try {
      await this.carRepository.delete(id);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
} 