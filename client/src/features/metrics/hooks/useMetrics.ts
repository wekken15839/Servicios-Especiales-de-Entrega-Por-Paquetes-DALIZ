import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import { metricsService } from '../api/metrics.service'
import type { GroupBy } from '../api/metrics.service'
import type { IMetricsSummary, IMetricsEvolution, IMetricsInsights, IDebtSummary, IRevenueReal } from '../types'

function defaultFrom(): string {
  const d = new Date()
  d.setDate(d.getDate() - 30)
  return d.toISOString().slice(0, 10)
}

function defaultTo(): string {
  return new Date().toISOString().slice(0, 10)
}

export function useMetrics() {
  const [from, setFrom] = useState(defaultFrom)
  const [to, setTo] = useState(defaultTo)
  const [groupBy, setGroupBy] = useState<GroupBy>('day')

  const [summary, setSummary] = useState<IMetricsSummary | null>(null)
  const [evolution, setEvolution] = useState<IMetricsEvolution | null>(null)
  const [insights, setInsights] = useState<IMetricsInsights | null>(null)
  const [debt, setDebt] = useState<IDebtSummary | null>(null)
  const [revenueReal, setRevenueReal] = useState<IRevenueReal | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchAll = useCallback(async (f: string, t: string, gb: GroupBy) => {
    setIsLoading(true)

    const results = await Promise.all([
      metricsService.getSummary({ from: f, to: t }),
      metricsService.getEvolution({ from: f, to: t, groupBy: gb }),
      metricsService.getInsights({ from: f, to: t }),
      metricsService.getDebt({ from: f, to: t }),
      metricsService.getRevenueReal({ from: f, to: t }),
    ])

    const [summaryRes, evolutionRes, insightsRes, debtRes, revenueRealRes] = results

    if (summaryRes.error) toast.error(summaryRes.error)
    else setSummary(summaryRes.data ?? null)

    if (evolutionRes.error) toast.error(evolutionRes.error)
    else setEvolution(evolutionRes.data ?? null)

    if (insightsRes.error) toast.error(insightsRes.error)
    else setInsights(insightsRes.data ?? null)

    if (debtRes.error) toast.error(debtRes.error)
    else setDebt(debtRes.data ?? null)

    if (revenueRealRes.error) toast.error(revenueRealRes.error)
    else setRevenueReal(revenueRealRes.data ?? null)

    setIsLoading(false)
  }, [])

  useEffect(() => {
    fetchAll(from, to, groupBy)
  }, [from, to, groupBy, fetchAll])

  const setDateRange = (f: string, t: string) => {
    setFrom(f)
    setTo(t)
  }

  return {
    from,
    to,
    groupBy,
    setFrom,
    setTo,
    setDateRange,
    setGroupBy,
    summary,
    evolution,
    insights,
    debt,
    revenueReal,
    isLoading,
  }
}
