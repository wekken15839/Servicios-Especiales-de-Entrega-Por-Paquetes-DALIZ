import { create } from 'zustand'
import { toast } from 'sonner'
import { deliveryService } from '@/features/deliveries/api/delivery.service'
import { routeService } from '@/features/routes/api/route.service'
import type { MapState, MapActions } from '../types'
import type { RouteAnalysis } from '@/features/routes/types'

type MapStore = MapState & MapActions

export const useMapStore = create<MapStore>((set, get) => ({
  deliveries: [],
  routes: [],
  selectedDeliveryId: null,
  activeRouteId: null,
  visualizedRouteId: null,
  pendingLocation: { lat: null, lng: null },
  isPlacing: false,
  isLoading: false,
  isCreatingRoute: false,
  error: null,
  isFullscreen: false,
  filters: { status: null },
  showRoutes: false,
  showMarkers: true,

  setDeliveries: (deliveries) => set({ deliveries }),

  setRoutes: (routes) => set({ routes }),

  selectDelivery: (id) => set({ selectedDeliveryId: id }),

  setPendingLocation: (lat, lng) =>
    set({ pendingLocation: { lat, lng } }),

  clearPendingLocation: () =>
    set({ pendingLocation: { lat: null, lng: null }, isPlacing: false }),

  setPlacing: (isPlacing) => set({ isPlacing }),

  setLoading: (isLoading) => set({ isLoading }),

  setCreatingRoute: (isCreatingRoute) => set({ isCreatingRoute }),

  setError: (error) => set({ error }),

  toggleFullscreen: () => set((state) => ({ isFullscreen: !state.isFullscreen })),

  setFilter: (key, value) =>
    set((state) => ({ filters: { ...state.filters, [key]: value } })),

  clearFilters: () => set({ filters: { status: null } }),

  setShowRoutes: (show) => set({ showRoutes: show }),

  setShowMarkers: (show) => set({ showMarkers: show }),

  setActiveRoute: (routeId) => set({ activeRouteId: routeId }),

  setVisualizedRoute: (routeId) => set({ visualizedRouteId: routeId }),

  updateRouteNotes: async (routeId, notes) => {
    const result = await routeService.updateNotes(routeId, { notes })

    if (result.error) {
      toast.error(result.error)
      return
    }

    if (result.data) {
      const updatedRoute = result.data
      set((state) => ({
        routes: state.routes.map((r) =>
          r.id === routeId ? { ...r, notes: updatedRoute.notes } : r,
        ),
      }))
    }
  },

  updateWaypointNotes: async (routeId, deliveryId, notes) => {
    const result = await routeService.updateWaypointNotes(routeId, deliveryId, { notes })

    if (result.error) {
      toast.error(result.error)
      return
    }

    if (result.data) {
      const updatedRoute = result.data
      set((state) => ({
        routes: state.routes.map((r) =>
          r.id === routeId ? { ...r, waypoints: updatedRoute.waypoints } : r,
        ),
      }))
    }
  },

  fetchMapData: async () => {
    set({ isLoading: true, error: null })

    const [deliveriesResult, routesResult] = await Promise.all([
      deliveryService.getAll(),
      routeService.getAll(),
    ])

    const errors: string[] = []
    if (deliveriesResult.error) errors.push(`Entregas: ${deliveriesResult.error}`)
    if (routesResult.error) errors.push(`Rutas: ${routesResult.error}`)

    const routes = routesResult.data ?? []
    const activeRoute =
      routes.find((r) => r.status === 'in_progress') ??
      routes.find((r) => r.status === 'paused')
    const currentActiveRouteId = get().activeRouteId
    const currentVisualizedRouteId = get().visualizedRouteId

    const routesMap = new Map(routes.map((r) => [r.id, r]))

    set({
      deliveries: deliveriesResult.data ?? [],
      routes,
      isLoading: false,
      error: errors.length > 0 ? errors.join('. ') : null,
      activeRouteId: currentActiveRouteId ?? activeRoute?.id ?? null,
      visualizedRouteId: routesMap.has(currentVisualizedRouteId ?? '')
        ? currentVisualizedRouteId
        : null,
    })
  },

  addDelivery: async (input) => {
    const result = await deliveryService.create(input)

    if (result.error) {
      set({ pendingLocation: { lat: null, lng: null }, isPlacing: false })
      toast.error(result.error)
      return result.error
    }

    if (result.data) {
      set((state) => ({
        deliveries: [...state.deliveries, result.data!],
        pendingLocation: { lat: null, lng: null },
        isPlacing: false,
      }))
      toast.success('Pedido creado correctamente')
    }

    return null
  },

  deleteDelivery: async (id) => {
    const result = await deliveryService.delete(id)

    if (result.error) {
      toast.error(result.error)
      return result.error
    }

    set((state) => ({
      deliveries: state.deliveries.filter((d) => d.id !== id),
    }))

    toast.success('Entrega eliminada')
    return null
  },

  updateDeliveryStatus: async (id, status) => {
    const result = await deliveryService.updateStatus(id, { status })

    if (result.error) {
      toast.error(result.error)
      return
    }

    set((state) => ({
      deliveries: state.deliveries.map((d) =>
        d.id === id ? { ...d, status } : d,
      ),
    }))
  },

  createRoute: async (input) => {
    const result = await routeService.create(input)

    if (result.error) {
      set({ isCreatingRoute: false })
      toast.error(result.error)
      return result.error
    }

    if (result.data) {
      const route = result.data!
      set((state) => ({
        routes: [...state.routes, route],
        isCreatingRoute: false,
        activeRouteId: route.status === 'in_progress' ? route.id : state.activeRouteId,
      }))
      toast.success('Ruta creada correctamente')
    } else {
      set({ isCreatingRoute: false })
    }

    return null
  },

  startRoute: async (routeId) => {
    const result = await routeService.start(routeId)

    if (result.error) {
      toast.error(result.error)
      return
    }

    const currentRoutes = get().routes
    const route = currentRoutes.find((r) => r.id === routeId)
    if (!route) {
      toast.error('Ruta no encontrada')
      return
    }

    const deliveryIds = route.waypoints.map((wp) => wp.deliveryId)

    set((state) => ({
      activeRouteId: routeId,
      routes: state.routes.map((r) =>
        r.id === routeId
          ? {
              ...r,
              ...(result.data ?? {}),
              status: 'in_progress' as const,
              waypoints: r.waypoints.map((wp) => ({
                ...wp,
                visited: false,
                visitedAt: null,
                packagesDelivered: null,
              })),
            }
          : r,
      ),
      deliveries: state.deliveries.map((d) =>
        deliveryIds.includes(d.id) ? { ...d, status: 'in_transit' as const } : d,
      ),
    }))

    toast.success('Ruta iniciada')
  },

  markVisited: async (routeId, deliveryId, packagesDelivered, paymentStatus, packagesCount, creditAmount, partialPayment, abonoAmount, abonoDescription) => {
    const result = await routeService.visitWaypoint(routeId, deliveryId, {
      packagesDelivered,
      packagesCount,
      paymentStatus,
      creditAmount,
      partialPayment,
      abonoAmount,
      abonoDescription,
    })

    if (result.error) {
      toast.error(result.error)
      return null
    }

    const delivery = get().deliveries.find((d) => d.id === deliveryId) ?? null

    set((state) => ({
      deliveries: state.deliveries.map((d) =>
        d.id === deliveryId ? { ...d, status: 'delivered' as const } : d,
      ),
      routes: state.routes.map((r) =>
        r.id === routeId
          ? {
              ...r,
              waypoints: r.waypoints.map((wp) =>
                wp.deliveryId === deliveryId
                  ? { ...wp, visited: true, visitedAt: new Date().toISOString(), packagesDelivered: packagesDelivered ?? null }
                  : wp,
              ),
            }
          : r,
      ),
    }))

    return delivery
  },

  pauseRoute: async (routeId) => {
    const result = await routeService.pause(routeId)

    if (result.error) {
      toast.error(result.error)
      return
    }

    set((state) => ({
      routes: state.routes.map((r) =>
        r.id === routeId ? { ...r, ...(result.data ?? {}), status: 'paused' as const } : r,
      ),
    }))

    toast.success('Ruta pausada')
  },

  resumeRoute: async (routeId) => {
    const result = await routeService.resume(routeId)

    if (result.error) {
      toast.error(result.error)
      return
    }

    set((state) => ({
      routes: state.routes.map((r) =>
        r.id === routeId ? { ...r, ...(result.data ?? {}), status: 'in_progress' as const } : r,
      ),
    }))

    toast.success('Ruta reanudada')
  },

  finishRoute: async (routeId) => {
    const result = await routeService.complete(routeId)

    if (result.error) {
      toast.error(result.error)
      return
    }

    const analysis =
      (result.raw?.analysis as RouteAnalysis | undefined) ??
      (result.data?.analysis as RouteAnalysis | undefined)

    set((state) => ({
  activeRouteId: null,
  visualizedRouteId: null,
      routes: state.routes.map((r) =>
        r.id === routeId
          ? { ...r, ...(result.data ?? {}), status: 'completed' as const, analysis }
          : r,
      ),
    }))

    if (analysis) {
      toast.success(
        `Ruta completada — ${analysis.delivered}/${analysis.totalDeliveries} entregas · ${analysis.completionRate}% · ${analysis.activeTimeHours.toFixed(1)}h`,
      )
    } else {
      toast.success('Ruta completada')
    }
  },
}))
