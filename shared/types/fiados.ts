// ============================================================
// Fiados (Credit/IOU) types — shared between server and client
// ============================================================

export type PaymentStatus = 'paid' | 'pending';

export interface CreditTransaction {
  id: string;
  clientId: string;
  amount: number;
  type: 'credit' | 'payment';
  description?: string;
  deliveryId?: string;
  createdAt: string;
}

export interface BalanceResponse {
  balance: number;
  transactions: CreditTransaction[];
}
