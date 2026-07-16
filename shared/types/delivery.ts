// ============================================================
// Delivery types — shared between server and client
// ============================================================

export type DeliveryStatus = 'pending' | 'in_transit' | 'delivered';

export type DeliveryType = 'delivery' | 'warehouse' | 'client';

export interface Delivery {
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
  paymentStatus?: import('./fiados.js').PaymentStatus;
}

// --- Requests ---

export interface CreateDeliveryRequest {
  title: string;
  clientName: string;
  clientPhone?: string;
  clientId?: string;
  address: string;
  lat: number;
  lng: number;
  notes?: string;
}

export interface UpdateDeliveryStatusRequest {
  status: 'in_transit' | 'delivered';
}
