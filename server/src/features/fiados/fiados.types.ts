export interface ICreditTransactionResponse {
  id: string;
  clientId: string;
  amount: number;
  type: 'credit' | 'payment';
  description?: string;
  deliveryId?: string;
  createdAt: string;
}

export interface IBalanceResponse {
  balance: number;
  transactions: ICreditTransactionResponse[];
}

export interface IPaymentInput {
  clientId: string;
  amount: number;
  description?: string;
}
