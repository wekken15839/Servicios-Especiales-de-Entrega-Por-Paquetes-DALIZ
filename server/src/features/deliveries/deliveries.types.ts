export type DeliveryStatus = 'pending' | 'in_transit' | 'delivered';
export type DeliveryType = 'delivery' | 'warehouse' | 'client';

export interface IDeliveryResponse {
  id: string;
  title: string;
  clientName: string;
  clientPhone?: string;
  clientId?: string;
  address: string;
  lat: number;
  lng: number;
  status: DeliveryStatus;
  type: DeliveryType;
  notes?: string;
  packagesCount?: number;
  paymentStatus?: 'paid' | 'pending';
}
