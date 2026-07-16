import { Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import { useMapStore } from '../store/mapStore'
import { useSettingsStore } from '@/features/settings/store/settingsStore'
import { DELIVERY_STATUS_COLORS, STATUS_LABELS } from '../constants'
import type { DeliveryPoint } from '../types'

function createMarkerIcon(delivery: DeliveryPoint, isSelected: boolean, isVisitedInRoute: boolean, isPendingInRoute: boolean, hasActiveRoute: boolean) {
  const color = !hasActiveRoute ? '#64748b' : (isPendingInRoute ? DELIVERY_STATUS_COLORS.pending : (DELIVERY_STATUS_COLORS[delivery.status] ?? '#6b7280'))
  const size = isSelected ? 14 : isVisitedInRoute ? 12 : 10
  const borderWidth = isSelected ? 4 : 3
  const shadow = isSelected
    ? '0 0 0 3px rgba(0,0,0,0.15), 0 2px 6px rgba(0,0,0,0.3)'
    : '0 2px 4px rgba(0,0,0,0.3)'

  const inner = isVisitedInRoute
    ? `<svg viewBox="0 0 24 24" fill="white" width="12" height="12" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>`
    : ''

  return L.divIcon({
    className: '',
    html: `<div style="
      width: ${size * 2}px;
      height: ${size * 2}px;
      background: ${isVisitedInRoute ? '#16a34a' : color};
      border: ${borderWidth}px solid white;
      border-radius: 50%;
      box-shadow: ${shadow};
      cursor: pointer;
      transition: all 0.2s ease;
      position: relative;
    ">${inner}</div>`,
    iconSize: [size * 2 + 6, size * 2 + 6],
    iconAnchor: [size + 3, size + 3],
    popupAnchor: [0, -(size + 10)],
  })
}

function getWaypointStatus(deliveryId: string, activeRouteId: string | null, visualizedRouteId: string | null, routes: any[]) {
  const routeId = visualizedRouteId ?? activeRouteId
  if (!routeId) return null
  const route = routes.find((r) => r.id === routeId)
  if (!route) return null
  const waypoint = route.waypoints.find((wp: any) => wp.deliveryId === deliveryId)
  if (!waypoint) return null
  return waypoint.visited ? 'visited' : 'pending'
}

export function MarkerLayer() {
  const deliveries = useMapStore((state) => state.deliveries)
  const routes = useMapStore((state) => state.routes)
  const selectedDeliveryId = useMapStore((state) => state.selectedDeliveryId)
  const activeRouteId = useMapStore((state) => state.activeRouteId)
  const visualizedRouteId = useMapStore((state) => state.visualizedRouteId)
  const selectDelivery = useMapStore((state) => state.selectDelivery)
  const showMarkers = useMapStore((state) => state.showMarkers)
  const filters = useMapStore((state) => state.filters)
  const map = useMap()
  const autoCenterOnMobile = useSettingsStore((s) => s.autoCenterOnMobile)

  function panMarkerToPosition(lat: number, lng: number) {
    if (!autoCenterOnMobile) return
    if (window.innerWidth > 640) return
    const container = map.getContainer()
    const targetPoint = L.point(
      container.clientWidth / 2,
      container.clientHeight - 84,
    )
    const markerPoint = map.latLngToContainerPoint([lat, lng])
    const offsetX = targetPoint.x - markerPoint.x
    const offsetY = targetPoint.y - markerPoint.y
    map.panBy([-offsetX, -offsetY], { animate: true, duration: 0.3 })
  }

  if (!showMarkers) return null

  const hasActiveRoute = routes.some((r) => r.status === 'in_progress') || !!visualizedRouteId

  const visualizedRoute = visualizedRouteId
    ? routes.find((r) => r.id === visualizedRouteId)
    : null
  const visualizedWaypointIds = visualizedRoute
    ? new Set(visualizedRoute.waypoints.map((wp) => wp.deliveryId))
    : null

  const filteredDeliveries = (filters.status
    ? deliveries.filter((d) => d.status === filters.status)
    : deliveries
  ).filter((d) => !visualizedWaypointIds || visualizedWaypointIds.has(d.id))

  return filteredDeliveries.map((delivery) => {
    const waypointStatus = getWaypointStatus(delivery.id, activeRouteId, visualizedRouteId, routes)

    return (
      <Marker
        key={delivery.id}
        position={[delivery.lat, delivery.lng]}
        icon={createMarkerIcon(delivery, delivery.id === selectedDeliveryId, waypointStatus === 'visited', waypointStatus === 'pending', hasActiveRoute)}
        eventHandlers={{
          click: () => {
            panMarkerToPosition(delivery.lat, delivery.lng)
            selectDelivery(delivery.id)
          },
        }}
      >
        <Popup className="custom-dark-popup" autoPan={false}>
          <div className="pl-4 pr-3 py-2.5 sm:pl-5 sm:pr-4 sm:py-4 min-w-[260px] sm:min-w-[280px]">
            <div className="flex items-start justify-between gap-2">
              <span className="text-base sm:text-lg font-bold text-popup-foreground truncate min-w-0">{delivery.clientName}</span>
              <span className="text-lg sm:text-xl shrink-0">📍</span>
            </div>

            <span className="mt-1 text-sm sm:mt-1.5 sm:text-base text-popup-muted truncate leading-snug">{delivery.address}</span>

            {delivery.clientPhone && (
              <div className="mt-2 sm:mt-3 flex items-center gap-2 text-xs sm:text-sm text-popup-muted">
                <span>📞</span>
                <span>{delivery.clientPhone}</span>
              </div>
            )}

            {delivery.notes && (
              <div className="mt-2 sm:mt-3 flex items-start gap-2 text-xs sm:text-sm text-popup-muted italic">
                <span>📝</span>
                <span className="leading-snug">{delivery.notes}</span>
              </div>
            )}

            {hasActiveRoute && (
              <div className="mt-2 sm:mt-3 flex items-center gap-2">
                <span
                  className="inline-block h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full"
                  style={{ background: DELIVERY_STATUS_COLORS[delivery.status] }}
                />
                <span className="text-xs sm:text-sm font-medium" style={{ color: DELIVERY_STATUS_COLORS[delivery.status] }}>
                  {STATUS_LABELS[delivery.status]}
                </span>
                {waypointStatus === 'visited' && (
                  <span className="ml-auto text-xs font-semibold text-popup-success bg-popup-success/10 px-2 py-0.5 rounded-full border border-popup-success/20">Visitado</span>
                )}
                {waypointStatus === 'pending' && (
                  <span className="ml-auto text-xs font-semibold text-popup-warning bg-popup-warning/10 px-2 py-0.5 rounded-full border border-popup-warning/20">Pendiente</span>
                )}
              </div>
            )}
          </div>
        </Popup>
      </Marker>
    )
  })
}
