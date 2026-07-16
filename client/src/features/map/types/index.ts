import type { Delivery } from '@/features/deliveries/types'
import type { Route, RouteWaypoint, RouteAnalysis } from '@/features/routes/types'
import type { CreateDeliveryRequest } from '@/features/deliveries/api/requests'
import type { CreateRouteRequest, VisitWaypointRequest } from '@/features/routes/api/requests'

export type DeliveryPoint = Delivery

export type { Route, RouteWaypoint, RouteAnalysis }

export type CreateDeliveryInput = CreateDeliveryRequest

export type CreateRouteInput = CreateRouteRequest

export type MarkVisitedInput = VisitWaypointRequest

export type MapFilters = {
  status: string | null
}

export type MapState = {
  deliveries: DeliveryPoint[]
  routes: Route[]
  selectedDeliveryId: string | null
  activeRouteId: string | null
  visualizedRouteId: string | null
  pendingLocation: { lat: number | null; lng: number | null }
  isPlacing: boolean
  isLoading: boolean
  isCreatingRoute: boolean
  error: string | null
  isFullscreen: boolean
  filters: MapFilters
  showRoutes: boolean
  showMarkers: boolean
}

export type MapActions = {
  setDeliveries: (deliveries: DeliveryPoint[]) => void
  setRoutes: (routes: Route[]) => void
  selectDelivery: (id: string | null) => void
  setPendingLocation: (lat: number, lng: number) => void
  clearPendingLocation: () => void
  setPlacing: (isPlacing: boolean) => void
  setLoading: (isLoading: boolean) => void
  setCreatingRoute: (isCreatingRoute: boolean) => void
  setError: (error: string | null) => void
  fetchMapData: () => Promise<void>
  addDelivery: (input: CreateDeliveryInput) => Promise<string | null>
  deleteDelivery: (id: string) => Promise<string | null>
  updateDeliveryStatus: (id: string, status: 'in_transit' | 'delivered') => Promise<void>
  toggleFullscreen: () => void
  setFilter: (key: keyof MapFilters, value: string | null) => void
  clearFilters: () => void
  setShowRoutes: (show: boolean) => void
  setShowMarkers: (show: boolean) => void
  setActiveRoute: (routeId: string | null) => void
  setVisualizedRoute: (routeId: string | null) => void
  updateRouteNotes: (routeId: string, notes: string) => Promise<void>
  updateWaypointNotes: (routeId: string, deliveryId: string, notes: string) => Promise<void>
  createRoute: (input: CreateRouteInput) => Promise<string | null>
  startRoute: (routeId: string) => Promise<void>
  markVisited: (routeId: string, deliveryId: string, packagesDelivered?: number, paymentStatus?: 'paid' | 'pending', packagesCount?: number, creditAmount?: number, partialPayment?: number, abonoAmount?: number, abonoDescription?: string) => Promise<DeliveryPoint | null>
  pauseRoute: (routeId: string) => Promise<void>
  resumeRoute: (routeId: string) => Promise<void>
  finishRoute: (routeId: string) => Promise<void>
}
