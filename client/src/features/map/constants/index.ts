export const AGUACHICA_CENTER: [number, number] = [8.3089, -73.615]

export const DEFAULT_ZOOM = 16

export const MIN_ZOOM = 11

export const MAX_ZOOM = 18

export const TILE_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'

export const TILE_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'

export const STATUS_LABELS: Record<string, string> = {
  pending: 'Pendiente',
  in_transit: 'En tránsito',
  delivered: 'Entregado',
}

export const ROUTE_STATUS_LABELS: Record<string, string> = {
  draft: 'Borrador',
  in_progress: 'En progreso',
  paused: 'Pausada',
  completed: 'Completada',
}

export const ROUTE_STATUS_COLORS: Record<string, string> = {
  draft: '#6b7280',
  in_progress: '#2563eb',
  paused: '#f59e0b',
  completed: '#16a34a',
}

export const DELIVERY_STATUS_COLORS: Record<string, string> = {
  pending: '#f59e0b',
  in_transit: '#2563eb',
  delivered: '#16a34a',
}

export const PENDING_COLOR = '#8b5cf6'
