import { api } from '@/shared/api/client'
import type { ApiResponse } from '@/shared/api/types'
import type { IMetricsSummary, IMetricsEvolution, IMetricsInsights, IDebtSummary, IRevenueReal } from '../types'

export type GroupBy = 'day' | 'week' | 'month'

interface MetricsQuery {
  from?: string
  to?: string
  groupBy?: GroupBy
}

function qs(params: MetricsQuery): string {
  const search = new URLSearchParams()
  if (params.from) search.set('from', params.from)
  if (params.to) search.set('to', params.to)
  if (params.groupBy) search.set('groupBy', params.groupBy)
  const s = search.toString()
  return s ? `?${s}` : ''
}

export const metricsService = {
  getSummary(query: MetricsQuery = {}): Promise<ApiResponse<IMetricsSummary>> {
    return api.get<IMetricsSummary>(`/api/metrics/summary${qs(query)}`)
  },

  getEvolution(query: MetricsQuery = {}): Promise<ApiResponse<IMetricsEvolution>> {
    return api.get<IMetricsEvolution>(`/api/metrics/evolution${qs({ ...query, groupBy: query.groupBy ?? 'day' })}`)
  },

  getInsights(query: MetricsQuery = {}): Promise<ApiResponse<IMetricsInsights>> {
    return api.get<IMetricsInsights>(`/api/metrics/insights${qs(query)}`)
  },

  getDebt(query: MetricsQuery = {}): Promise<ApiResponse<IDebtSummary>> {
    return api.get<IDebtSummary>(`/api/metrics/debt${qs(query)}`)
  },

  getRevenueReal(query: MetricsQuery = {}): Promise<ApiResponse<IRevenueReal>> {
    return api.get<IRevenueReal>(`/api/metrics/revenue-real${qs(query)}`)
  },
}
