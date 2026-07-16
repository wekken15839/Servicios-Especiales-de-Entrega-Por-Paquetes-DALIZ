export interface IClientInput {
  name: string;
  phone?: string;
  address: string;
  lat: number;
  lng: number;
}

export interface IClientResponse {
  id: string;
  name: string;
  phone?: string;
  address: string;
  lat: number;
  lng: number;
  balance: number;
}

export interface IBalanceResponse {
  balance: number;
  transactions: {
    id: string;
    clientId: string;
    amount: number;
    type: 'credit' | 'payment';
    description?: string;
    deliveryId?: string;
    createdAt: string;
  }[];
}
