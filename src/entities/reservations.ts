export interface Reservation {
  id: string;
  productId: string;
  reserverName: string;
  whatsapp: string | null;
  message: string | null;
  cancellationToken: string;
  createdAt?: Date;
  updatedAt?: Date | null;
}
