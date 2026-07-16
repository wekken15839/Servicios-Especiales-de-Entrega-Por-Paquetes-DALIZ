import type { ClientSummary } from '../types'
import type { BalanceResponse } from '@daliz/shared'

export type ClientListResponse = {
  data: ClientSummary[]
}

export type BalanceDetailResponse = {
  data: BalanceResponse
}
