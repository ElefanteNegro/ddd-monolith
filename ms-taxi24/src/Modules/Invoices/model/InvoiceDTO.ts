export interface InvoiceDTO {
    id: string;
    tripId: string;
    passengerId: string;
    driverId: string;
    fare: number;
    issuedAt: Date;
}