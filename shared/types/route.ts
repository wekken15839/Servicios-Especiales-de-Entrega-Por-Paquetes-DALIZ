// ============================================================
// Route types — shared between server and client
// ============================================================

export type RouteStatus = 'draft' | 'in_progress' | 'paused' | 'completed';

export interface RouteWaypoint {
  lat: number;
  lng: number;
  order: number;
  deliveryId: string;
  visited: boolean;
  visitedAt: string | null;
  packagesDelivered: number | null;
  notes?: string | null;
}

export interface Route {
  id: string;
  name: string;
  status: RouteStatus;
  waypoints: RouteWaypoint[];
  totalDistance?: number | null;
  estimatedTime?: number | null;
  startedAt: string | null;
  completedAt: string | null;
  activeDuration: number;
  optimized?: boolean;
  analysis?: RouteAnalysis;
  notes?: string | null;
}

export interface RouteAnalysis {
  totalDeliveries: number;
  delivered: number;
  notDelivered: number;
  activeTimeHours: number;
  completionRate: number;
}

// --- Requests ---

export interface CreateRouteRequest {
  name: string;
  deliveryIds: string[];
  optimize?: boolean;
}

export interface VisitWaypointRequest {
  packagesDelivered?: number;
}

export interface UpdateRouteNotesRequest {
  notes: string;
}
