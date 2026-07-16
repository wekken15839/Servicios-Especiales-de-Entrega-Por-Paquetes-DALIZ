import { useMetrics } from '../hooks/useMetrics'
import { DateRangePicker } from '../components/DateRangePicker'
import { SummaryCards } from '../components/SummaryCards'
import { EvolutionChart } from '../components/EvolutionChart'
import { InsightsBar } from '../components/InsightsBar'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { Select } from '@/shared/components/ui/select'
import type { GroupBy } from '../api/metrics.service'

export function MetricsPage() {
  const {
    from, to, groupBy,
    setFrom, setTo, setDateRange, setGroupBy,
    summary, evolution, insights, debt, isLoading,
  } = useMetrics()

  return (
    <div className="space-y-6 p-4 pb-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <DateRangePicker
          from={from}
          to={to}
          onFromChange={setFrom}
          onToChange={setTo}
          onDateRange={setDateRange}
        />
        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground">Agrupar por</label>
          <Select
            value={groupBy}
            onChange={(e) => setGroupBy(e.target.value as GroupBy)}
            className="w-32"
          >
            <option value="day">Día</option>
            <option value="week">Semana</option>
            <option value="month">Mes</option>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-lg" />
            ))}
          </div>
          <Skeleton className="h-[400px] rounded-lg" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
            {Array.from({ length: 7 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-lg" />
            ))}
          </div>
        </div>
      ) : (
        <>
          {summary && <SummaryCards data={summary} debt={debt} />}
          {evolution && <EvolutionChart data={evolution} />}
          {insights && <InsightsBar data={insights} />}
        </>
      )}
    </div>
  )
}
