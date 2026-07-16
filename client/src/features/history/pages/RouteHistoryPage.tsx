import { RouteHistoryPanel } from '@/features/map/components/RouteHistoryPanel'

export function RouteHistoryPage() {
  return (
    <div className="flex flex-col h-full overflow-hidden p-4 pb-10">
      <h1 className="text-xl font-semibold shrink-0">Historial de Rutas</h1>
      <div className="mt-4 flex-1 min-h-0 overflow-auto">
        <RouteHistoryPanel />
      </div>
    </div>
  )
}
