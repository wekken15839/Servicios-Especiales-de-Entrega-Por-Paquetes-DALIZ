import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Clock, MapPin, Package, Route, TrendingUp, ChevronRight, ChevronDown, ExternalLink, Eye, MessageSquareText } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useMapStore } from '../store/mapStore'
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/card'

export function RouteHistoryPanel() {
  const navigate = useNavigate()
  const routes = useMapStore((s) => s.routes)
  const deliveries = useMapStore((s) => s.deliveries)
  const setVisualizedRoute = useMapStore((s) => s.setVisualizedRoute)
  const selectDelivery = useMapStore((s) => s.selectDelivery)
  const [expandedRouteId, setExpandedRouteId] = useState<string | null>(null)

  const completedRoutes = routes
    .filter((r) => r.status === 'completed')
    .sort((a, b) => (b.completedAt ?? '').localeCompare(a.completedAt ?? ''))

  const toggleExpand = (routeId: string) => {
    setExpandedRouteId((prev) => (prev === routeId ? null : routeId))
  }

  if (completedRoutes.length === 0) {
    return (
      <Card className="mx-6 mb-6">
        <CardContent className="flex items-center justify-center py-16 text-sm text-muted-foreground">
          No hay rutas completadas aún
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mx-6 mb-6 shadow-[0_0_24px_rgba(56,189,248,0.08)] ring-1 ring-sky-400/10">
      <CardHeader>
        <CardTitle className="text-lg">Historial de rutas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {completedRoutes.map((r) => {
          const date = r.completedAt
            ? new Date(r.completedAt).toLocaleDateString('es-CO', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
              })
            : ''

          const a = r.analysis
          const isExpanded = expandedRouteId === r.id
          const totalPaquetes = r.waypoints.reduce(
            (sum, wp) => sum + (wp.visited ? (wp.packagesDelivered ?? 1) : 0),
            0,
          )

          return (
            <div key={r.id} className="rounded-md border border-border text-sm transition-colors">
              <div
                className="flex cursor-pointer items-center gap-2 p-3 hover:bg-muted/50"
                onClick={() => toggleExpand(r.id)}
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground/70" />
                ) : (
                  <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/70" />
                )}

                <div className="flex flex-1 flex-wrap items-center gap-x-4 gap-y-1 min-w-0">
                  <div className="flex items-center gap-1.5 font-medium min-w-0">
                    <Route className="h-4 w-4 shrink-0 text-muted-foreground/70" />
                    <span className="truncate">{r.name}</span>
                  </div>

                  {date && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      {date}
                    </div>
                  )}

                  <div className="flex items-center gap-3 ml-auto">
                    <span className="flex items-center gap-1 text-xs">
                      <MapPin className="h-3.5 w-3.5 text-lime-400" />
                      {r.waypoints.filter((wp) => wp.visited).length}/{r.waypoints.length}
                    </span>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setVisualizedRoute(r.id)
                    selectDelivery(null)
                    navigate('/mapa', { state: { from: '/historial' } })
                  }}
                  className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground/70 hover:bg-muted hover:text-foreground"
                  title="Visualizar en el mapa"
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    navigate(`/ruta/${r.id}`)
                  }}
                  className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground/70 hover:bg-muted hover:text-foreground"
                  title="Ver detalle de ruta"
                >
                  <ExternalLink className="h-4 w-4" />
                </button>
              </div>

              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    {a && (
                      <div className="flex flex-wrap gap-3 border-t border-border px-3 py-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Package className="h-3.5 w-3.5" />
                          {a.delivered}/{a.totalDeliveries} entregados
                        </span>
                        <span className="flex items-center gap-1">
                          <TrendingUp className={`h-3.5 w-3.5 ${a.completionRate >= 80 ? 'text-lime-400' : 'text-fuchsia-400'}`} />
                          {a.completionRate}% efectividad
                        </span>
                        <span>
                          {a.activeTimeHours.toFixed(1)}h activo
                        </span>
                        {a.notDelivered > 0 && (
                          <span className="text-destructive">{a.notDelivered} no entregados</span>
                        )}
                      </div>
                    )}

                    {r.notes && (
                      <div className="flex items-start gap-2 border-t border-border px-3 py-2.5 text-xs">
                        <MessageSquareText className="h-3.5 w-3.5 shrink-0 mt-0.5 text-sky-400" />
                        <span className="text-muted-foreground leading-relaxed">{r.notes}</span>
                      </div>
                    )}

                    <div className="border-t border-border">
                      <div className="flex items-center justify-between border-b border-border bg-gradient-to-r from-sky-400/[0.08] to-transparent px-3 py-2.5 text-xs font-semibold">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-1 shrink-0 rounded-full bg-sky-400/60" />
                          <span>Total paquetes entregados</span>
                        </div>
                        <span className="text-sky-400">{totalPaquetes} paq.</span>
                      </div>
                      {r.waypoints.map((wp, i) => {
                        const delivery = deliveries.find((d) => d.id === wp.deliveryId)
                        return (
                          <div key={wp.deliveryId}>
                            <div
                              className={`flex items-center justify-between px-3 py-2 text-xs ${
                                wp.visited ? 'bg-lime-500/10' : ''
                              }`}
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <span className={`inline-block h-2 w-2 shrink-0 rounded-full ${wp.visited ? 'bg-lime-500' : 'bg-destructive/60'}`} />
                                <span className="font-medium truncate">{delivery?.clientName ?? 'Cliente desconocido'}</span>
                              </div>
                              <div className="flex items-center gap-2 shrink-0 ml-2">
                                {wp.visited ? (
                                  <span className="flex items-center gap-1 text-lime-300 font-medium">
                                    <Package className="h-3.5 w-3.5" />
                                    {wp.packagesDelivered ?? 1} paq.
                                  </span>
                                ) : (
                                  <span className="text-destructive">No entregado</span>
                                )}
                              </div>
                            </div>
                            {wp.notes && (
                              <div className={`flex items-start gap-1.5 px-3 pb-2 text-xs ${wp.visited ? 'bg-lime-500/10' : ''}`}>
                                <MessageSquareText className="h-3 w-3 shrink-0 mt-0.5 text-muted-foreground/60" />
                                <span className="text-muted-foreground leading-relaxed">{wp.notes}</span>
                              </div>
                            )}
                            {i < r.waypoints.length - 1 && (
                              <div className="border-b border-border/50" />
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
