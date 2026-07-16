import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, ZoomControl, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { X, Eye } from 'lucide-react'
import { AGUACHICA_CENTER, DEFAULT_ZOOM, MIN_ZOOM, MAX_ZOOM, TILE_URL, TILE_ATTRIBUTION } from '../constants'
import { useMapStore } from '../store/mapStore'
import { useSettingsStore } from '@/features/settings/store/settingsStore'
import { MarkerLayer } from './MarkerLayer'
import { RouteLayer } from './RouteLayer'
import { PendingMarkerLayer } from './PendingMarkerLayer'
import { MapControls } from './MapControls'
import { RouteToolbar } from './RouteToolbar'
import { Z } from '@/shared/constants/zIndex'

function MapResizer() {
  const map = useMap()
  const isFullscreen = useMapStore((s) => s.isFullscreen)

  useEffect(() => {
    setTimeout(() => map.invalidateSize(), 200)
  }, [isFullscreen, map])

  return null
}

function MapClickHandler() {
  const map = useMap()
  const setPendingLocation = useMapStore((s) => s.setPendingLocation)

  useEffect(() => {
    const handler = (e: L.LeafletMouseEvent) => {
      const { isPlacing } = useMapStore.getState()
      if (!isPlacing) return
      setPendingLocation(e.latlng.lat, e.latlng.lng)
    }

    map.on('click', handler)
    return () => {
      map.off('click', handler)
    }
  }, [map, setPendingLocation])

  return null
}

function FitBoundsOnVisualize() {
  const map = useMap()
  const visualizedRouteId = useMapStore((s) => s.visualizedRouteId)
  const routes = useMapStore((s) => s.routes)

  useEffect(() => {
    if (!visualizedRouteId) return
    const route = routes.find((r) => r.id === visualizedRouteId)
    if (!route || route.waypoints.length === 0) return

    const bounds = L.latLngBounds(
      route.waypoints.map((wp) => [wp.lat, wp.lng] as [number, number]),
    )
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: MAX_ZOOM })
  }, [visualizedRouteId, routes, map])

  return null
}

function VisualizationBanner() {
  const location = useLocation()
  const navigate = useNavigate()
  const visualizedRouteId = useMapStore((s) => s.visualizedRouteId)
  const routes = useMapStore((s) => s.routes)
  const setVisualizedRoute = useMapStore((s) => s.setVisualizedRoute)

  if (!visualizedRouteId) return null

  const route = routes.find((r) => r.id === visualizedRouteId)
  if (!route) return null

  const from = (location.state as { from?: string } | null)?.from

  const handleClose = () => {
    setVisualizedRoute(null)
    if (from) navigate(from)
  }

  return (
    <div
      className="absolute left-1/2 top-4 -translate-x-1/2 flex items-center gap-3 rounded-lg bg-background px-4 py-2.5 text-sm shadow-lg ring-1 ring-sky-400/30"
      style={{ zIndex: Z.mapFloating }}
    >
      <Eye className="h-4 w-4 text-sky-400" />
      <span className="font-medium text-foreground truncate max-w-[200px]">
        {route.name}
      </span>
      <span className="text-xs text-muted-foreground">Completada</span>
      <button
        onClick={handleClose}
        className="ml-1 flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground/70 transition-colors hover:bg-muted hover:text-foreground"
        title={from ? 'Volver al historial' : 'Volver a vista normal'}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

export function MapView() {
  const showZoomControls = useSettingsStore((s) => s.showZoomControls)

  return (
    <MapContainer
      center={AGUACHICA_CENTER}
      zoom={DEFAULT_ZOOM}
      minZoom={MIN_ZOOM}
      maxZoom={MAX_ZOOM}
      zoomControl={false}
      className="h-full w-full"
    >
      {showZoomControls && <ZoomControl position="bottomright" />}
      <TileLayer url={TILE_URL} attribution={TILE_ATTRIBUTION} />
      <MapClickHandler />
      <MapResizer />
      <FitBoundsOnVisualize />
      <RouteToolbar />

      <VisualizationBanner />

      <MarkerLayer />
      <RouteLayer />
      <PendingMarkerLayer />
      <MapControls />
    </MapContainer>
  )
}
