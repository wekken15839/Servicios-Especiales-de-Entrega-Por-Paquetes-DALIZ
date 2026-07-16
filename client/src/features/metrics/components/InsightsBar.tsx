import { Trophy, BarChart3, Clock, DollarSign, TrendingUp, Target, PiggyBank } from 'lucide-react'
import { Card, CardContent } from '@/shared/components/ui/card'
import type { IMetricsInsights } from '../types'

interface InsightsBarProps {
  data: IMetricsInsights
}

const items = [
  {
    icon: Trophy,
    iconClass: 'text-amber-400',
    label: 'Mejor día',
    value: (d: IMetricsInsights) =>
      d.bestDay
        ? `${new Date(d.bestDay + 'T00:00:00').toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })} — ${d.bestDayPackages} paq.`
        : '—',
  },
  {
    icon: BarChart3,
    iconClass: 'text-blue-400',
    label: 'Promedio',
    value: (d: IMetricsInsights) => `${d.avgPackagesPerDay.toFixed(1)} paq/día`,
  },
  {
    icon: Clock,
    iconClass: 'text-fuchsia-400',
    label: 'Horas activas',
    value: (d: IMetricsInsights) => `${d.totalActiveHours.toFixed(1)} hrs`,
  },
  {
    icon: DollarSign,
    iconClass: 'text-emerald-400',
    label: 'Total ingresos',
    value: (d: IMetricsInsights) => d.totalRevenueFormatted,
  },
  {
    icon: TrendingUp,
    iconClass: 'text-lime-400',
    label: 'Ingreso / hora',
    value: (d: IMetricsInsights) => `$${d.revenuePerHour.toLocaleString('es-CO')} /h`,
  },
  {
    icon: Target,
    iconClass: 'text-cyan-400',
    label: 'Cumplimiento',
    value: (d: IMetricsInsights) => `${d.completionRateAvg.toFixed(0)}%`,
  },
  {
    icon: PiggyBank,
    iconClass: 'text-pink-400',
    label: 'Cobranza',
    value: (d: IMetricsInsights) => d.collectionRate != null ? `${(d.collectionRate * 100).toFixed(0)}%` : '—',
  },
]

export function InsightsBar({ data }: InsightsBarProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
      {items.map((item) => {
        const Icon = item.icon
        return (
          <Card key={item.label}>
            <CardContent className="flex flex-col items-center gap-1 py-4 text-center">
              <Icon className={`h-5 w-5 ${item.iconClass}`} />
              <span className="text-xs text-muted-foreground">{item.label}</span>
              <span className="text-sm font-semibold leading-tight">{item.value(data)}</span>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
