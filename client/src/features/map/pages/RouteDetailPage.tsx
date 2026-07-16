import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { ArrowLeft, Clock, MapPin, Maximize2, Minimize2, Phone } from 'lucide-react'
import { useMapStore } from '../store/mapStore'
import { routeService } from '@/features/routes/api/route.service'
import { Z } from '@/shared/constants/zIndex'
import type { Route } from '@/features/routes/types'
import { AGUACHICA_CENTER, DEFAULT_ZOOM, MIN_ZOOM, MAX_ZOOM, TILE_URL, TILE_ATTRIBUTION } from '../constants'
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/card'

function createMarkerIcon(visited: boolean) {
  const color = visited ? '#84cc16' : '#f43f5e'
  const inner = visited
    ? '<svg viewBox="0 0 24 24" fill="white" width="14" height="14" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>'
    : ''
  return L.divIcon({
    className: '',
    html: `<div style="
      width: 24px; height: 24px;
      background: ${color};
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      cursor: pointer;
      position: relative;
    ">${inner}</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -18],
  })
}

export function RouteDetailPage() {
  const { routeId } = useParams<{ routeId: string }>()
  const navigate = useNavigate()
  const storeRoutes = useMapStore((s) => s.routes)
  const storeDeliveries = useMapStore((s) => s.deliveries)

  const [route, setRoute] = useState<Route | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    if (!routeId) {
      setError('ID de ruta no proporcionado')
      setIsLoading(false)
      return
    }

    const found = storeRoutes.find((r) => r.id === routeId)
    if (found) {
      setRoute(found)
      setIsLoading(false)
      return
    }

    routeService.getById(routeId).then((result) => {
      if (result.error) {
        setError(result.error)
      } else if (result.data) {
        setRoute(result.data)
      } else {
        setError('Ruta no encontrada')
      }
      setIsLoading(false)
    })
  }, [routeId, storeRoutes])

  const goBack = () => navigate('/mapa')

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="flex items-center gap-2.5">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span className="text-sm font-medium">Cargando ruta...</span>
        </div>
      </div>
    )
  }

  if (error || !route) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-32">
        <p className="text-sm text-destructive">{error ?? 'Ruta no encontrada'}</p>
        <button onClick={goBack} className="text-sm text-primary hover:underline">
          Volver al mapa
        </button>
      </div>
    )
  }

  const waypointsWithDelivery = route.waypoints
    .slice()
    .sort((a, b) => a.order - b.order)
    .map((wp) => ({
      ...wp,
      delivery: storeDeliveries.find((d) => d.id === wp.deliveryId) ?? null,
    }))

  const total = waypointsWithDelivery.length
  const deliveredCount = waypointsWithDelivery.filter((wp) => wp.visited).length
  const notDeliveredCount = total - deliveredCount

  const avgLat = total > 0
    ? waypointsWithDelivery.reduce((s, wp) => s + wp.lat, 0) / total
    : AGUACHICA_CENTER[0]
  const avgLng = total > 0
    ? waypointsWithDelivery.reduce((s, wp) => s + wp.lng, 0) / total
    : AGUACHICA_CENTER[1]

  const positions: [number, number][] = waypointsWithDelivery.map((wp) => [wp.lat, wp.lng])

  const dateStr = route.completedAt
    ? new Date(route.completedAt).toLocaleDateString('es-CO', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : ''

  const a = route.analysis
  const completionRate = a?.completionRate ?? (total > 0 ? Math.round((deliveredCount / total) * 100) : 0)
  const activeHours = a?.activeTimeHours ?? 0

  return (
    <div className={`flex flex-col ${isFullscreen ? 'h-full' : ''}`}>
      <div
        className={`relative transition-all duration-300 ${
          isFullscreen ? 'h-full' : 'h-[40dvh]'
        }`}
      >
          <MapContainer
            center={[avgLat, avgLng]}
            zoom={DEFAULT_ZOOM}
            minZoom={MIN_ZOOM}
            maxZoom={MAX_ZOOM}
            className="h-full w-full"
          >
            <TileLayer url={TILE_URL} attribution={TILE_ATTRIBUTION} />

            {positions.length > 1 && (
              <Polyline
                positions={positions}
                pathOptions={{ color: '#6b7280', weight: 3, opacity: 0.5 }}
              />
            )}

            {waypointsWithDelivery.map((wp) => (
              <Marker
                key={wp.deliveryId}
                position={[wp.lat, wp.lng]}
                icon={createMarkerIcon(wp.visited)}
              >
                <Popup>
                  <div className="min-w-[200px] font-sans text-sm">
                    <p className="mb-1 font-semibold">
                      {wp.delivery?.clientName ?? 'Entrega #' + (wp.order + 1)}
                    </p>
                    {wp.delivery?.address && (
                      <p className="text-xs text-muted-foreground">{wp.delivery.address}</p>
                    )}
                    {wp.delivery?.clientPhone && (
                      <p className="mt-1 text-xs text-muted-foreground/70">
                        <Phone className="mr-1 inline h-3.5 w-3.5" />
                        {wp.delivery.clientPhone}
                      </p>
                    )}
                    <div className="mt-1.5 flex items-center gap-2">
                      <span
                        className={`inline-block h-2 w-2 rounded-full ${wp.visited ? 'bg-lime-500' : 'bg-destructive'}`}
                      />
                      <span className="text-xs">{wp.visited ? 'Entregado' : 'No entregado'}</span>
                      {wp.visited && wp.packagesDelivered != null && (
                        <span className="text-xs text-muted-foreground">
                          · {wp.packagesDelivered} paq.
                        </span>
                      )}
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          <button
            onClick={goBack}
            className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-md bg-background/90 text-muted-foreground shadow-md transition-colors hover:bg-background hover:text-foreground"
            style={{ zIndex: Z.mapFloating }}
            title="Volver al mapa"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-md bg-background/90 text-muted-foreground shadow-md transition-colors hover:bg-background hover:text-foreground"
            style={{ zIndex: Z.mapFloating }}
            title={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
          >
            {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
          </button>
      </div>

      {!isFullscreen && (
        <div className="mt-4 space-y-4 pb-6 px-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-xl font-semibold">{route.name}</h1>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                {dateStr && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {dateStr}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {total} entregas
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-4">
                <span className="text-2xl font-bold text-lime-400">{deliveredCount}</span>
                <span className="text-xs text-muted-foreground">Entregados</span>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-4">
                <span className={`text-2xl font-bold ${notDeliveredCount > 0 ? 'text-destructive' : 'text-muted-foreground'}`}>
                  {notDeliveredCount}
                </span>
                <span className="text-xs text-muted-foreground">No entregados</span>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-4">
                <span className={`text-2xl font-bold ${completionRate >= 80 ? 'text-lime-400' : 'text-fuchsia-400'}`}>
                  {completionRate}%
                </span>
                <span className="text-xs text-muted-foreground">Efectividad</span>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-4">
                <span className="text-2xl font-bold">{activeHours.toFixed(1)}</span>
                <span className="text-xs text-muted-foreground">Horas activo</span>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Entregas de la ruta</CardTitle>
            </CardHeader>
            <CardContent>
              {waypointsWithDelivery.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  Esta ruta no tiene entregas
                </p>
              ) : (
                <div className="divide-y divide-border">
                  {waypointsWithDelivery.map((wp) => (
                    <div key={wp.deliveryId} className="flex items-start gap-4 py-3 text-sm">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
                        {wp.order + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium">
                          {wp.delivery?.clientName ?? 'Entrega #' + (wp.order + 1)}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {wp.delivery?.address ?? wp.lat.toFixed(4) + ', ' + wp.lng.toFixed(4)}
                        </p>
                        <div className="mt-1 flex flex-wrap items-center gap-2">
                          <span className={`inline-flex items-center gap-1 text-xs ${wp.visited ? 'text-lime-400' : 'text-destructive'}`}>
                            <span className={`inline-block h-1.5 w-1.5 rounded-full ${wp.visited ? 'bg-lime-400' : 'bg-destructive'}`} />
                            {wp.visited ? 'Entregado' : 'No entregado'}
                          </span>
                          {wp.delivery?.clientPhone && (
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Phone className="h-3.5 w-3.5" />
                              {wp.delivery.clientPhone}
                            </span>
                          )}
                          {wp.packagesDelivered != null && (
                            <span className="text-xs text-muted-foreground">
                              {wp.packagesDelivered} paq.
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
