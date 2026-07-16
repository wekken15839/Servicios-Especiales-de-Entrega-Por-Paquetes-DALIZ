import { Package, Truck, CheckCircle2, DollarSign, CreditCard } from 'lucide-react'
import { Card, CardContent } from '@/shared/components/ui/card'
import type { IMetricsSummary, IDebtSummary } from '../types'

interface SummaryCardsProps {
  data: IMetricsSummary
  debt?: IDebtSummary | null
}

function formatCOP(amount: number): string {
  return '$' + amount.toLocaleString('es-CO') + ' COP'
}

export function SummaryCards({ data, debt }: SummaryCardsProps) {
  const { packages: pkg, routes, deliveries: del, revenue } = data

  const cards = [
    {
      icon: Package,
      iconClass: 'text-blue-400',
      label: 'Paquetes',
      main: pkg.totalDelivered.toLocaleString('es-CO'),
      sub: `${pkg.avgPerRoute.toFixed(1)} x ruta · ${pkg.packagesPerHour.toFixed(1)} /h`,
    },
    {
      icon: Truck,
      iconClass: 'text-fuchsia-400',
      label: 'Rutas',
      main: routes.totalCompleted.toLocaleString('es-CO'),
      sub: `${routes.avgDurationMin.toFixed(0)} min prom · ${routes.avgDistanceKm.toFixed(1)} km`,
    },
    {
      icon: CheckCircle2,
      iconClass: 'text-lime-400',
      label: 'Entregas',
      main: `${routes.completionRate.toFixed(0)}%`,
      sub: `${del.totalDelivered} de ${del.totalScheduled} prog. · ${del.avgTimeToDeliverHours.toFixed(1)} h`,
    },
    {
      icon: DollarSign,
      iconClass: 'text-amber-400',
      label: 'Ingresos',
      main: revenue.formatted,
      sub: revenue.revenueReal != null
        ? `${formatCOP(revenue.revenueReal)} real · ${formatCOP(revenue.revenueProjected ?? revenue.total)} proy.`
        : `${pkg.packagesPerHour.toFixed(0)} paq/h · $${(revenue.total / (pkg.packagesPerHour || 1)).toLocaleString('es-CO')} COP/h`,
    },
    {
      icon: CreditCard,
      iconClass: debt && debt.netDebt > 0 ? 'text-red-400' : 'text-emerald-400',
      label: 'Deuda Pendiente',
      main: debt ? formatCOP(debt.netDebt) : '—',
      sub: debt ? `Cobranza: ${(debt.collectionRate * 100).toFixed(0)}% · ${debt.pendingCount} pend.` : '—',
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <Card key={card.label}>
            <CardContent className="flex flex-col gap-1.5 p-5">
              <div className="flex items-center gap-2">
                <Icon className={`h-5 w-5 ${card.iconClass}`} />
                <span className="text-xs font-medium text-muted-foreground">{card.label}</span>
              </div>
              <span className="text-2xl font-bold tracking-tight">{card.main}</span>
              <p className="text-xs text-muted-foreground">{card.sub}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
