export type RouteStatus = 'draft' | 'in_progress' | 'paused' | 'completed';

export interface IRouteWaypoint {
  deliveryId: string;
  lat: number;
  lng: number;
  order: number;
  visited: boolean;
  visitedAt?: string;
  packagesDelivered?: number;
  revenue?: number;
  notes?: string;
}

export interface IRouteResponse {
  id: string;
  name: string;
  status: RouteStatus;
  waypoints: IRouteWaypoint[];
  totalDistance?: number;
  estimatedTime?: number;
  startedAt?: string;
  completedAt?: string;
  activeDuration?: number;
  notes?: string;
}

export interface IRouteAnalysis {
  totalDeliveries: number;
  delivered: number;
  notDelivered: number;
  activeTimeHours: number;
  completionRate: number;
}
