import { Router, Request, Response } from 'express';
import { InvoiceController } from '../controllers/InvoiceController';
import { InvoiceService } from '../../application/services/InvoiceService';
import { InvoiceRepository } from '../repositories/InvoiceRepository';
import { prisma } from '@Shared/infrastructure/prisma/client';

const router = Router();

const invoiceRepository = new InvoiceRepository(prisma);
const invoiceService = new InvoiceService(invoiceRepository);
const invoiceController = new InvoiceController(invoiceService);

router.get('/', (req: Request, res: Response) => invoiceController.getByTrip(req, res));

export default router;
