import { InvoiceInterface } from '../../model/interfaces/InvoiceInterface';

export interface InvoiceRepository {
  create(invoice: InvoiceInterface): Promise<void>;
  findByTripId(tripId: string): Promise<InvoiceInterface | null>;
}
