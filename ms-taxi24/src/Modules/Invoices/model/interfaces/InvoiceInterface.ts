export interface InvoiceInterface {
    id?: string;
    tripId: string;
    passengerId: string;
    driverId: string;
    amount: number;
    issuedAt: Date;
  }
  