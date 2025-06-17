import { TripCompletedEvent } from '@Modules/Trips/domain/events/TripCompletedEvent';
import { InvoiceRepository } from '@Modules/Invoices/infrastructure/repositories/InvoiceRepository';
import { InvoiceInterface } from '@Modules/Invoices/model/interfaces/InvoiceInterface';

export class InvoiceService {
  constructor(private readonly invoiceRepo: InvoiceRepository) {}

  async createFromTrip(event: TripCompletedEvent): Promise<void> {
    const existingInvoice = await this.invoiceRepo.findByTripId(event.tripId);
    if (existingInvoice) return;

    const invoice: InvoiceInterface = {
        tripId: event.tripId,
        passengerId: event.passengerId,
        driverId: event.driverId,
        amount: event.fare,
        issuedAt: event.completedAt,
      };
      

    await this.invoiceRepo.create(invoice);
  }
}
