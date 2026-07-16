import { useState } from 'react'
import { Pencil } from 'lucide-react'
import { useMapStore } from '../store/mapStore'
import { Z } from '@/shared/constants/zIndex'
import { Textarea } from '@/shared/components/ui/textarea'
import { Button } from '@/shared/components/ui/button'

export function RouteToolbar() {
  const routes = useMapStore((s) => s.routes)
  const activeRouteId = useMapStore((s) => s.activeRouteId)
  const visualizedRouteId = useMapStore((s) => s.visualizedRouteId)
  const startRoute = useMapStore((s) => s.startRoute)
  const pauseRoute = useMapStore((s) => s.pauseRoute)
  const resumeRoute = useMapStore((s) => s.resumeRoute)
  const finishRoute = useMapStore((s) => s.finishRoute)
  const updateRouteNotes = useMapStore((s) => s.updateRouteNotes)
  const [showNotes, setShowNotes] = useState(false)
  const [notesDraft, setNotesDraft] = useState('')

  if (visualizedRouteId) return null

  const activeRoute = routes.find((r) => r.id === activeRouteId)

  if (activeRoute && (activeRoute.status === 'in_progress' || activeRoute.status === 'paused')) {
    const total = activeRoute.waypoints.length
    const visited = activeRoute.waypoints.filter((wp) => wp.visited).length
    const pct = total > 0 ? Math.round((visited / total) * 100) : 0
    const isPaused = activeRoute.status === 'paused'
    const hasNotes = !!activeRoute.notes

    const handleOpenNotes = () => {
      setNotesDraft(activeRoute.notes ?? '')
      setShowNotes(true)
    }

    const handleSaveNotes = async () => {
      await updateRouteNotes(activeRoute.id, notesDraft)
      setShowNotes(false)
    }

    return (
      <div
        className="absolute left-[calc(50%-30px)] top-3.5 -translate-x-1/2 flex flex-col items-center gap-2 sm:left-1/2"
        style={{ zIndex: Z.mapFloating }}
      >
        <div className="flex flex-col items-center gap-1 rounded-lg bg-background px-1 py-2 text-xs shadow-lg ring-1 ring-border w-[calc(100vw-3rem-50px)] sm:flex-row sm:gap-3 sm:px-4 sm:py-2 sm:text-sm sm:w-auto md:gap-4 md:px-5 md:py-2.5">
          <div className="flex items-center gap-1.5">
            <span className="font-medium text-primary truncate max-w-[50px] sm:max-w-none">{activeRoute.name}</span>
            <button
              onClick={handleOpenNotes}
              className={`flex h-6 w-6 items-center justify-center rounded-md transition-colors hover:bg-muted ${hasNotes ? 'text-sky-400' : 'text-muted-foreground/50'}`}
              title={hasNotes ? 'Editar nota de la ruta' : 'Agregar nota a la ruta'}
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-muted-foreground whitespace-nowrap">
              {visited}/{total}
            </span>
            <div className="h-2 w-16 rounded-full bg-muted overflow-hidden sm:w-20 md:w-24">
              <div
                className={`h-full rounded-full transition-all duration-300 ${isPaused ? 'bg-amber-500' : 'bg-primary'}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>

          <div className="flex w-full items-center justify-center gap-1 sm:w-auto">
            {isPaused ? (
              <button
                onClick={() => resumeRoute(activeRoute.id)}
                className="rounded-md bg-primary px-2 py-1 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 sm:px-3 sm:py-1.5"
              >
                Reanudar
              </button>
            ) : (
              <button
                onClick={() => pauseRoute(activeRoute.id)}
                className="rounded-md bg-amber-600 px-2 py-1 text-xs font-medium text-white transition-colors hover:bg-amber-700 sm:px-3 sm:py-1.5"
              >
                Pausar
              </button>
            )}

            <button
              onClick={() => finishRoute(activeRoute.id)}
              className="rounded-md bg-emerald-600 px-2 py-1 text-xs font-medium text-white transition-colors hover:bg-emerald-700 sm:px-3 sm:py-1.5"
            >
              Finalizar
            </button>
          </div>
        </div>

        {showNotes && (
          <div className="flex flex-col gap-2 rounded-lg bg-background px-3 py-2.5 shadow-lg ring-1 ring-border w-[340px] sm:w-[400px]">
            <label className="text-xs font-medium text-muted-foreground">
              Nota de la ruta
            </label>
            <Textarea
              value={notesDraft}
              onChange={(e) => setNotesDraft(e.target.value)}
              placeholder="Escribí una nota general para esta ruta..."
              className="min-h-[80px] text-xs resize-none"
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowNotes(false)}
              >
                Cancelar
              </Button>
              <Button
                size="sm"
                onClick={handleSaveNotes}
              >
                Guardar
              </Button>
            </div>
          </div>
        )}
      </div>
    )
  }

  const draftRoute = routes.find((r) => r.status === 'draft')

  if (draftRoute) {
    return (
      <div
        className="absolute left-1/2 top-3.5 -translate-x-1/2 flex items-center justify-center gap-3 rounded-lg bg-background px-3 py-2 text-xs shadow-lg ring-1 ring-border w-[calc(100vw-3rem-80px)] sm:px-4 sm:py-2.5 sm:text-sm sm:justify-start sm:w-auto md:gap-4 md:px-5"
        style={{ zIndex: Z.mapFloating }}
      >
        <span className="text-muted-foreground truncate max-w-[100px] sm:max-w-none">
          Ruta: <span className="font-medium text-foreground">{draftRoute.name}</span>
        </span>

        <button
          onClick={() => startRoute(draftRoute.id)}
          className="rounded-md bg-primary px-2 py-1 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 sm:px-3 sm:py-1.5"
        >
          Iniciar
        </button>
      </div>
    )
  }

  return null
}
