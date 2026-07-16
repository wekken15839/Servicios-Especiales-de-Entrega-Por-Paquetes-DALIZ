import { useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/card'
import type { IMetricsEvolution } from '../types'

interface EvolutionChartProps {
  data: IMetricsEvolution
}

type DatasetKey = 'packagesDelivered' | 'routesCompleted' | 'activeHours' | 'revenue' | 'revenueReal'

const datasets: { key: DatasetKey; label: string; color: string }[] = [
  { key: 'packagesDelivered', label: 'Paquetes', color: '#60a5fa' },
  { key: 'routesCompleted', label: 'Rutas', color: '#e879f9' },
  { key: 'activeHours', label: 'Horas activas', color: '#a3e635' },
  { key: 'revenue', label: 'Ingresos', color: '#fbbf24' },
  { key: 'revenueReal', label: 'Ingreso Real', color: '#34d399' },
]

export function EvolutionChart({ data }: EvolutionChartProps) {
  const [selected, setSelected] = useState<DatasetKey>('packagesDelivered')

  const chartData = data.labels.map((label, i) => ({
    date: label,
    [datasets[0].key]: data.datasets.packagesDelivered[i],
    [datasets[1].key]: data.datasets.routesCompleted[i],
    [datasets[2].key]: data.datasets.activeHours[i],
    [datasets[3].key]: data.datasets.revenue[i],
    [datasets[4].key]: data.datasets.revenueReal?.[i] ?? 0,
  }))

  const formatter = (value: number) => {
    if (selected === 'revenue' || selected === 'revenueReal') return `$${value.toLocaleString('es-CO')}`
    return value.toLocaleString('es-CO')
  }

  const activeDataset = datasets.find((d) => d.key === selected)!

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-lg">Evolución</CardTitle>
        <div className="flex flex-wrap gap-1">
          {datasets.map((ds) => (
            <button
              key={ds.key}
              onClick={() => setSelected(ds.key)}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                selected === ds.key
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              }`}
            >
              {ds.label}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="flex items-center justify-center py-16">
            <p className="text-sm text-muted-foreground">Sin datos en el período seleccionado</p>
          </div>
        ) : (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                  tickFormatter={(v: string) => {
                    const d = new Date(v + 'T00:00:00')
                    return d.toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })
                  }}
                />
                <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} tickFormatter={formatter} />
                <Tooltip
                  contentStyle={{
                    background: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '13px',
                  }}
                  formatter={(value: number) => [formatter(value), activeDataset.label]}
                  labelFormatter={(label: string) => {
                    const d = new Date(label + 'T00:00:00')
                    return d.toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey={selected}
                  stroke={activeDataset.color}
                  strokeWidth={2}
                  dot={{ r: 3, fill: activeDataset.color }}
                  activeDot={{ r: 5 }}
                  name={activeDataset.label}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
