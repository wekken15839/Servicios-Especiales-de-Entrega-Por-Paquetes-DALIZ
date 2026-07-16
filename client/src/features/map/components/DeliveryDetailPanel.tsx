import { useState } from 'react'
import { X, MapPin, Phone, FileText, Trash2, Pencil } from 'lucide-react'
import { useMapStore } from '../store/mapStore'
import { DELIVERY_STATUS_COLORS, STATUS_LABELS } from '../constants'
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/card'
import { Textarea } from '@/shared/components/ui/textarea'
import { Button } from '@/shared/components/ui/button'

export function DeliveryDetailPanel() {
  const selectedDeliveryId = useMapStore((s) => s.selectedDeliveryId)
  const deliveries = useMapStore((s) => s.deliveries)
  const routes = useMapStore((s) => s.routes)
  const activeRouteId = useMapStore((s) => s.activeRouteId)
  const selectDelivery = useMapStore((s) => s.selectDelivery)
  const deleteDelivery = useMapStore((s) => s.deleteDelivery)
  const updateWaypointNotes = useMapStore((s) => s.updateWaypointNotes)
  const [showWaypointNotes, setShowWaypointNotes] = useState(false)
  const [waypointNotesDraft, setWaypointNotesDraft] = useState('')

  const hasActiveRoute = routes.some((r) => r.status === 'in_progress')
  const activeRoute = routes.find((r) => r.id === activeRouteId)

  const delivery = deliveries.find((d) => d.id === selectedDeliveryId)

  if (!selectedDeliveryId || !delivery) {
    return (
      <Card className="mx-6 mb-6">
        <CardContent className="flex items-center justify-center py-16 text-sm text-muted-foreground">
          Selecciona un pedido en el mapa para ver su detalle
        </CardContent>
      </Card>
    )
  }

  const statusColor = DELIVERY_STATUS_COLORS[delivery.status] ?? '#6b7280'
  const statusLabel = STATUS_LABELS[delivery.status] ?? delivery.status

  const waypoint = activeRoute?.waypoints.find(
    (wp) => wp.deliveryId === selectedDeliveryId,
  )
  const hasWaypointNotes = !!waypoint?.notes

  const handleOpenWaypointNotes = () => {
    setWaypointNotesDraft(waypoint?.notes ?? '')
    setShowWaypointNotes(true)
  }

  const handleSaveWaypointNotes = async () => {
    if (!activeRouteId || !selectedDeliveryId) return
    await updateWaypointNotes(activeRouteId, selectedDeliveryId, waypointNotesDraft)
    setShowWaypointNotes(false)
  }

  return (
    <Card className="mx-6 mb-6">
      <CardHeader className="flex flex-row items-start justify-between pb-3">
        <div>
          <CardTitle className="text-lg">{delivery.clientName}</CardTitle>
        </div>
        <button
          onClick={() => selectDelivery(null)}
          className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          title="Cerrar"
        >
          <X className="h-5 w-5" />
        </button>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-1.5 text-sm">
          <MapPin className="h-5 w-5 text-muted-foreground/70" />
          <span>{delivery.address}</span>
        </div>

        {delivery.clientPhone && (
          <div className="flex items-center gap-1.5 text-sm">
            <Phone className="h-5 w-5 text-muted-foreground/70" />
            <span>{delivery.clientPhone}</span>
          </div>
        )}

        {hasActiveRoute && (
          <div className="flex items-center gap-2 text-sm">
            <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: statusColor }} />
            <span>{statusLabel}</span>
          </div>
        )}

        {delivery.notes && (
          <div className="flex gap-1.5 rounded-md bg-muted/50 p-3 text-sm">
            <FileText className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground/70" />
            <span className="text-muted-foreground">{delivery.notes}</span>
          </div>
        )}

        {hasActiveRoute && (
          <div className="space-y-2">
            {!showWaypointNotes ? (
              <button
                onClick={handleOpenWaypointNotes}
                className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted/50 ${hasWaypointNotes ? 'text-sky-400' : 'text-muted-foreground/50'}`}
              >
                <Pencil className="h-4 w-4 shrink-0" />
                <span className="truncate">
                  {hasWaypointNotes ? waypoint?.notes : 'Nota de esta ruta'}
                </span>
              </button>
            ) : (
              <div className="flex flex-col gap-2 rounded-md bg-muted/30 p-3">
                <label className="text-xs font-medium text-muted-foreground">
                  Nota de esta ruta
                </label>
                <Textarea
                  value={waypointNotesDraft}
                  onChange={(e) => setWaypointNotesDraft(e.target.value)}
                  placeholder="Escribí una nota para este cliente en esta ruta..."
                  className="min-h-[72px] text-xs resize-none"
                  autoFocus
                />
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowWaypointNotes(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSaveWaypointNotes}
                  >
                    Guardar
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {hasActiveRoute && (
          <button
            onClick={() => {
              deleteDelivery(delivery.id)
              selectDelivery(null)
            }}
            className="flex items-center gap-1.5 text-xs text-destructive/70 hover:text-destructive transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            Eliminar entrega
          </button>
        )}
      </CardContent>
    </Card>
  )
}
