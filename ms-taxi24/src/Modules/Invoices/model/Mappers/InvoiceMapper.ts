import { InvoiceDTO } from '../InvoiceDTO';
import { InvoiceInterface } from '../interfaces/InvoiceInterface';

export class InvoiceMapper {
    static toDTO(invoice: InvoiceInterface): InvoiceDTO {
        return {
            id: invoice.id ?? '',
            tripId: invoice.tripId,
            passengerId: invoice.passengerId,
            driverId: invoice.driverId,
            fare: invoice.amount,
            issuedAt: invoice.issuedAt,
        };
    }

    static toEntity(dto: InvoiceDTO): InvoiceInterface {
        return {
            id: dto.id,
            tripId: dto.tripId,
            passengerId: dto.passengerId,
            driverId: dto.driverId,
            amount: dto.fare,
            issuedAt: dto.issuedAt,
        };
    }
}
