import { Polyline, Tooltip } from 'react-leaflet'
import { useMapStore } from '../store/mapStore'
import { ROUTE_STATUS_COLORS } from '../constants'

type Segment = {
  from: [number, number]
  to: [number, number]
  visited: boolean
  deliveryId: string
}

function buildSegments(waypoints: { lat: number; lng: number; visited: boolean; deliveryId: string }[]): Segment[] {
  const segments: Segment[] = []
  for (let i = 0; i < waypoints.length - 1; i++) {
    segments.push({
      from: [waypoints[i].lat, waypoints[i].lng],
      to: [waypoints[i + 1].lat, waypoints[i + 1].lng],
      visited: waypoints[i + 1].visited,
      deliveryId: waypoints[i + 1].deliveryId,
    })
  }
  return segments
}

export function RouteLayer() {
  const routes = useMapStore((state) => state.routes)
  const deliveries = useMapStore((state) => state.deliveries)
  const showRoutes = useMapStore((state) => state.showRoutes)
  const visualizedRouteId = useMapStore((state) => state.visualizedRouteId)

  if (!showRoutes && !visualizedRouteId) return null

  const visibleRoutes = visualizedRouteId
    ? routes.filter((r) => r.id === visualizedRouteId)
    : routes

  return visibleRoutes.map((route) => {
    const isVisualized = route.id === visualizedRouteId

    if (isVisualized) {
      const segments = buildSegments(route.waypoints)

      return segments.map((segment, i) => {
        const delivery = deliveries.find((d) => d.id === segment.deliveryId)
        return (
          <Polyline
            key={`${route.id}-${i}`}
            positions={[segment.from, segment.to]}
            pathOptions={{
              color: segment.visited ? '#16a34a' : '#dc2626',
              weight: 5,
              opacity: 0.9,
              dashArray: segment.visited ? undefined : '8 6',
            }}
          >
            <Tooltip sticky>
              <div className="font-sans text-sm">
                <span className="font-semibold">
                  {delivery?.clientName ?? 'Cliente desconocido'}
                </span>
                <span className={`ml-2 text-xs ${segment.visited ? 'text-green-400' : 'text-red-400'}`}>
                  {segment.visited ? '✓ Entregado' : '✗ No entregado'}
                </span>
              </div>
            </Tooltip>
          </Polyline>
        )
      })
    }

    const positions: [number, number][] = route.waypoints.map((wp) => [wp.lat, wp.lng])
    const color = ROUTE_STATUS_COLORS[route.status] ?? '#6b7280'

    return (
      <Polyline
        key={route.id}
        positions={positions}
        pathOptions={{
          color,
          weight: 3,
          opacity: 0.7,
        }}
      >
        <Tooltip sticky>
          <div className="font-sans text-sm">
            <span className="font-semibold">{route.name}</span>
            {route.totalDistance && (
              <span className="ml-2 text-muted-foreground text-xs">
                {route.totalDistance} km
              </span>
            )}
          </div>
        </Tooltip>
      </Polyline>
    )
  })
}
