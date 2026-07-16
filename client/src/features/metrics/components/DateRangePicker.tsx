interface DateRangePickerProps {
  from: string
  to: string
  onFromChange: (v: string) => void
  onToChange: (v: string) => void
  onDateRange: (from: string, to: string) => void
}

function today(): string {
  return new Date().toISOString().slice(0, 10)
}

function daysAgo(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString().slice(0, 10)
}

function weekStart(): string {
  const d = new Date()
  const day = d.getDay()
  const diff = day === 0 ? 6 : day - 1
  d.setDate(d.getDate() - diff)
  return d.toISOString().slice(0, 10)
}

function monthStart(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`
}

const quickButtons = [
  { label: 'Hoy', from: today, to: today },
  { label: 'Esta semana', from: weekStart, to: today },
  { label: 'Este mes', from: monthStart, to: today },
  { label: 'Últimos 30 días', from: () => daysAgo(30), to: today },
]

export function DateRangePicker({ from, to, onFromChange, onToChange, onDateRange }: DateRangePickerProps) {
  return (
    <div className="flex flex-wrap items-end gap-3">
      <style>{`
        .date-icon-desde::-webkit-calendar-picker-indicator {
          filter: brightness(0) saturate(100%) invert(56%) sepia(65%) saturate(480%) hue-rotate(168deg) brightness(100%) contrast(98%);
          cursor: pointer;
        }
        .date-icon-hasta::-webkit-calendar-picker-indicator {
          filter: brightness(0) saturate(100%) invert(70%) sepia(96%) saturate(504%) hue-rotate(359deg) brightness(103%) contrast(100%);
          cursor: pointer;
        }
      `}</style>
      <div className="flex flex-col gap-1">
        <label className="text-xs text-muted-foreground">Desde</label>
        <input
          type="date"
          value={from}
          onChange={(e) => onFromChange(e.target.value)}
          className="date-icon-desde h-10 rounded-md border border-border bg-input px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs text-muted-foreground">Hasta</label>
        <input
          type="date"
          value={to}
          onChange={(e) => onToChange(e.target.value)}
          className="date-icon-hasta h-10 rounded-md border border-border bg-input px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        {quickButtons.map((btn) => (
          <button
            key={btn.label}
            onClick={() => onDateRange(btn.from(), btn.to())}
            className="h-9 rounded-md border border-border bg-transparent px-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  )
}
