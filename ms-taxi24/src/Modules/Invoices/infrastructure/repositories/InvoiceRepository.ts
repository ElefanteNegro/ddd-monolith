import { PrismaClientInterface } from '@Shared/infrastructure/prisma/interfaces/PrismaClientInterface';
import { InvoiceRepository as IInvoiceRepository } from '../../domain/interfaces/InvoiceRepository';
import { InvoiceInterface } from '../../model/interfaces/InvoiceInterface';
import { BaseRepository } from '@Shared/domain/interfaces/Repository';
import { Logger } from '@Shared/domain/interfaces/Logger';
import { InvoiceDTO } from '../../model/InvoiceDTO';
import { InvoiceMapper } from '../../model/Mappers/InvoiceMapper';

export class InvoiceRepository
  extends BaseRepository<InvoiceDTO, string>
  implements IInvoiceRepository
{
  constructor(
    private readonly prisma: PrismaClientInterface,
    logger: Logger
  ) {
    super(logger);
  }

  async create(invoice: InvoiceInterface): Promise<void> {
    try {
      await this.prisma.invoice.create({
        data: {
          tripId: invoice.tripId,
          amount: invoice.amount,
          issuedAt: invoice.issuedAt,
        },
      });
    } catch (error) {
      this.handleError(error, 'Error creating invoice');
    }
  }

  async findByTripId(tripId: string): Promise<InvoiceInterface | null> {
    try {
      const result = await this.prisma.invoice.findUnique({ where: { tripId } });
      return result ? InvoiceMapper.toEntity({ ...result, fare: result.amount }) : null;
    } catch (error) {
      this.handleError(error, 'Error finding invoice by tripId');
    }
  }

  async findById(id: string): Promise<InvoiceDTO | null> {
    try {
      const result = await this.prisma.invoice.findUnique({ where: { id } });
      return result ? InvoiceMapper.toDTO({ ...result, passengerId: '', driverId: '', amount: result.amount }) : null;
    } catch (error) {
      this.handleError(error, 'Error finding invoice by id');
    }
  }

  async save(data: Omit<InvoiceDTO, 'id'>): Promise<InvoiceDTO> {
    try {
      const created = await this.prisma.invoice.create({
        data: {
          tripId: data.tripId,
          amount: data.fare,
          issuedAt: data.issuedAt,
        },
      });
      return InvoiceMapper.toDTO({ ...created, passengerId: data.passengerId, driverId: data.driverId });
    } catch (error) {
      this.handleError(error, 'Error saving invoice');
    }
  }

  async update(id: string, data: Partial<InvoiceDTO>): Promise<InvoiceDTO> {
    try {
      const updated = await this.prisma.invoice.update({
        where: { id },
        data: {
          amount: data.fare,
          issuedAt: data.issuedAt,
        },
      });
      return InvoiceMapper.toDTO({ ...updated, passengerId: data.passengerId!, driverId: data.driverId! });
    } catch (error) {
      this.handleError(error, 'Error updating invoice');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.prisma.invoice.delete({ where: { id } });
    } catch (error) {
      this.handleError(error, 'Error deleting invoice');
    }
  }

  async getAll(): Promise<{ data: InvoiceDTO[]; total: number }> {
    try {
      const results = await this.prisma.invoice.findMany();
      const total = await this.prisma.invoice.count();
      const data = results.map((invoice: InvoiceInterface) =>
        InvoiceMapper.toDTO({ ...invoice, passengerId: '', driverId: '' })
      );
      return { data, total };
    } catch (error) {
      this.handleError(error, 'Error fetching all invoices');
    }
  }
}
