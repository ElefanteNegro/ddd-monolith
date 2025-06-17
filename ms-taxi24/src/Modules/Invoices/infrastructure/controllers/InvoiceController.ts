import { Request, Response } from 'express';
import { InvoiceService } from '../services/InvoiceService';

export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  async getByTrip(req: Request, res: Response): Promise<Response> {
    const tripId = Number(req.query.tripId);

    if (!tripId || isNaN(tripId)) {
      return res.status(400).json({ message: 'Missing or invalid tripId' });
    }

    const invoices = await this.invoiceService.findByTripId(tripId);
    return res.json(invoices);
  }
}
