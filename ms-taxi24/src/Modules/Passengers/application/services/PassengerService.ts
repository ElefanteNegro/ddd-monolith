import { PassengerRepository } from '@Modules/Passengers/infrastructure/repositories/PassengerRepository';
import { GenericResponse } from '@Shared/dto/GenericResponse';
import { PassengerDTO } from '@Modules/Passengers/model/PassengerDTO';
import { Logger } from '@Shared/domain/interfaces/Logger';
import { container } from '@Shared/infrastructure/container';
import { CaseUseException } from '@Shared/domain/exceptions/CaseUseException';
import { PassengerInterface } from '@Modules/Passengers/model/interfaces/PassengerInterface';
import { NotFoundError } from '@Shared/domain/exceptions/AppError';

export class PassengerService {
  constructor(
    private readonly passengerRepository: PassengerRepository,
    private readonly logger: Logger = container.logger
  ) {}

  async create(userId: string): Promise<GenericResponse<PassengerDTO>> {
    try {
      const passenger: Omit<PassengerInterface, 'id'> = {
        userId,
        isActive: true
      };

      const result = await this.passengerRepository.save(passenger);
      return {
        success: true,
        data: result
      };
    } catch (error) {
      this.logger.error(error);
      throw new CaseUseException('Error creating passenger');
    }
  }

  async getAll(): Promise<GenericResponse<PassengerDTO[]>> {
    try {
      const result = await this.passengerRepository.getAll();
      return {
        success: true,
        data: result.data
      };
    } catch (error) {
      this.logger.error(error);
      return { success: false, message: 'Error fetching passengers' };
    }
  }

  async getById(id: string): Promise<GenericResponse<PassengerDTO>> {
    try {
      const result = await this.passengerRepository.findById(id);
      if (!result) {
        throw new NotFoundError('Passenger not found');
      }
      return {
        success: true,
        data: result
      };
    } catch (error) {
      this.logger.error(error);
      throw new CaseUseException('Error fetching passenger by ID');
    }
  }
} 