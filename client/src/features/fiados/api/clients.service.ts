import { api } from '@/shared/api/client'
import type { ApiResponse } from '@/shared/api/types'
import type { ClientSummary } from '../types'

export const clientsService = {
  getAll(): Promise<ApiResponse<ClientSummary[]>> {
    return api.get<ClientSummary[]>('/api/clients')
  },
}
