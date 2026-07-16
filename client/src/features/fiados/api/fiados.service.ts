import { api } from '@/shared/api/client'
import type { ApiResponse } from '@/shared/api/types'
import type { BalanceResponse, CreditTransaction } from '@daliz/shared'
import type { RegisterPaymentInput } from './requests'

export const fiadosService = {
  getBalance(clientId: string): Promise<ApiResponse<BalanceResponse>> {
    return api.get<BalanceResponse>(`/api/clients/${clientId}/balance`)
  },

  registerPayment(input: RegisterPaymentInput): Promise<ApiResponse<CreditTransaction>> {
    return api.post<CreditTransaction>('/api/fiados/payment', input)
  },
}
