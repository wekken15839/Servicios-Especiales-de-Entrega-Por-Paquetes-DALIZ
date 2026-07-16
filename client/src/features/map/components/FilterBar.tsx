import { RotateCcw } from 'lucide-react'
import { useMapStore } from '../store/mapStore'
import { STATUS_LABELS } from '../constants'
import { Select } from '@/shared/components/ui/select'
import { Button } from '@/shared/components/ui/button'

const STATUS_OPTIONS = [
  { value: '', label: 'Todos los estados' },
  ...Object.entries(STATUS_LABELS).map(([value, label]) => ({ value, label })),
]

export function FilterBar() {
  const filters = useMapStore((s) => s.filters)
  const setFilter = useMapStore((s) => s.setFilter)
  const clearFilters = useMapStore((s) => s.clearFilters)

  const hasActiveFilters = filters.status !== null

  return (
    <div className="mx-6 mb-2 flex flex-wrap items-end gap-3">
      <div className="space-y-1">
        <label className="text-xs font-medium text-muted-foreground">Estado</label>
        <Select
          value={filters.status ?? ''}
          onChange={(e) => setFilter('status', e.target.value || null)}
          className="w-40"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </Select>
      </div>

      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1 text-xs">
          <RotateCcw className="h-3.5 w-3.5" />
          Limpiar filtros
        </Button>
      )}
    </div>
  )
}
