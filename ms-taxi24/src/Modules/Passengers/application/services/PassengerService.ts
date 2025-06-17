import { PassengerRepository } from '@Modules/Passengers/infrastructure/repositories/PassengerRepository';
import { GenericResponse } from '@Shared/dto/GenericResponse';
import { PassengerDTO } from '@Modules/Passengers/model/PassagerDTO';
import { Logger } from '@Modules/Shared/domain/interfaces/Logger';
import WinstonLogger from '@Modules/Shared/infrastructure/WinstoneLogger';
import { CaseUseException } from '@Shared/domain/exceptions/CaseUseException';
import { PassengerInterface } from '@Modules/Passengers/model/interfaces/PassengerInterface';

export class PassengerService {
  constructor(
    private readonly passengerRepository: PassengerRepository,
    private readonly logger: Logger = new WinstonLogger()
  ) {}

  async create(userId: string): Promise<GenericResponse<PassengerDTO>> {
    try {
      const passenger: PassengerInterface = {
        userId
      };

      return await this.passengerRepository.create(passenger);
    } catch (error) {
      this.logger.error(error);
      throw new CaseUseException('Error creating passenger');
    }
  }

  async getAll(): Promise<GenericResponse<PassengerDTO[]>> {
    try {
      return await this.passengerRepository.getAll();
    } catch (error) {
      this.logger.error(error);
      return { success: false, message: 'Error fetching passengers' };
    }
  }

  async getById(id: string): Promise<GenericResponse<PassengerDTO>> {
    try {
      return await this.passengerRepository.getById(id);
    } catch (error) {
      this.logger.error(error);
      throw new CaseUseException('Error fetching passenger by ID');
    }
  }
} 