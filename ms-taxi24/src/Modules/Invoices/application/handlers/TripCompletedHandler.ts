import { TripCompletedEvent } from '@Modules/Trips/domain/events/TripCompletedEvent';
import { InvoiceService } from '../services/InvoiceService';

export class TripCompletedHandler {
  constructor(private readonly invoiceService: InvoiceService) {}

  async handle(event: TripCompletedEvent): Promise<void> {
    await this.invoiceService.createFromTrip(event);
  }
}
