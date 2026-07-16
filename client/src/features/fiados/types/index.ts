export type { CreditTransaction, BalanceResponse } from '@daliz/shared'

export type ClientSummary = {
  id: string
  name: string
  phone?: string
  address: string
  balance: number
}

export type RegisterPaymentInput = {
  clientId: string
  amount: number
  description?: string
}

export type FiadosState = {
  clients: ClientSummary[]
  selectedClient: ClientSummary | null
  balance: number | null
  transactions: import('@daliz/shared').CreditTransaction[]
  isLoading: boolean
  isSubmitting: boolean
  error: string | null
}

export type FiadosActions = {
  fetchClients: () => Promise<void>
  fetchBalance: (clientId: string) => Promise<void>
  registerPayment: (input: RegisterPaymentInput) => Promise<void>
  clearError: () => void
}
