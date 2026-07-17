// ============================================================
// Tipos de respuesta del backend de Daliz
// Para consumo del frontend (React + TypeScript)
// API Base URL: http://localhost:4000/api
// ============================================================

// --- Enums / Union types --------------------------------------------------

export type DeliveryStatus = 'pending' | 'in_transit' | 'delivered';

export type DeliveryType = 'mayor' | 'detal';

export type RouteStatus = 'draft' | 'in_progress' | 'paused' | 'completed';

// --- Envolturas de respuesta y error --------------------------------------

/** Respuesta exitosa con datos (GET, POST, PUT) */
export interface ApiDataResponse<T> {
  data: T;
}

/** Respuesta exitosa con mensaje (DELETE, logout) */
export interface ApiMessageResponse {
  message: string;
}

/** Respuesta de error (todos los endpoints). El frontend lee ambos campos. */
export interface ApiErrorResponse {
  message: string;
  error: string;
}

/** Respuesta exitosa genérica: data o message */
export type ApiSuccessResponse<T = never> = [T] extends [never]
  ? ApiMessageResponse
  : ApiDataResponse<T>;

// ============================================================
// 1. Autenticación  —  /api/auth
// ============================================================

export interface AuthUser {
  id: string;
  username: string;
  name: string;
  role: string;
}

// --- Requests ---

export interface SignInRequest {
  username: string;
  password: string;
}

export interface SignUpRequest {
  username: string;
  password: string;
  name: string;
}

// --- Responses ---

/** POST /api/auth/sign-in  ·  POST /api/auth/sign-up */
export interface AuthResponse {
  message: string;
  user: AuthUser;
  token: string;
}

/** POST /api/auth/logout */
export type LogoutResponse = ApiMessageResponse;

/** GET /api/auth/me */
export interface MeResponse {
  user: AuthUser;
}

// ============================================================
// 2. Entregas  —  /api/deliveries
// ============================================================

export interface Delivery {
  id: string;
  title: string;
  clientName: string;
  clientPhone?: string;
  address: string;
  lat: number;
  lng: number;
  status: DeliveryStatus;
  type: DeliveryType;
  notes?: string;
}

// --- Requests ---

export interface CreateDeliveryRequest {
  title: string;
  clientName: string;
  clientPhone?: string;
  address: string;
  lat: number;
  lng: number;
  notes?: string;
}

export interface UpdateDeliveryStatusRequest {
  status: 'in_transit' | 'delivered';
}

// --- Responses ---

/** GET /api/deliveries */
export type DeliveryListResponse = ApiDataResponse<Delivery[]>;

/** GET /api/deliveries/:id */
export type DeliveryDetailResponse = ApiDataResponse<Delivery>;

/** POST /api/deliveries */
export type DeliveryCreateResponse = ApiDataResponse<Delivery>;

/** PUT /api/deliveries/:id/status */
export type DeliveryUpdateStatusResponse = ApiDataResponse<Delivery>;

/** DELETE /api/deliveries/:id */
export type DeliveryDeleteResponse = ApiMessageResponse;

// ============================================================
// 3. Rutas  —  /api/routes
// ============================================================

export interface RouteWaypoint {
  lat: number;
  lng: number;
  order: number;
  deliveryId: string;
  visited: boolean;
  visitedAt: string | null;
  packagesDelivered: number | null;
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

// --- Responses ---

/** GET /api/routes */
export type RouteListResponse = ApiDataResponse<Route[]>;

/** GET /api/routes/:id */
export type RouteDetailResponse = ApiDataResponse<Route>;

/** POST /api/routes */
export type RouteCreateResponse = ApiDataResponse<Route>;

/** PUT /api/routes/:id/start */
export type RouteStartResponse = ApiDataResponse<Route>;

/** PUT /api/routes/:id/pause */
export type RoutePauseResponse = ApiDataResponse<Route>;

/** PUT /api/routes/:id/resume */
export type RouteResumeResponse = ApiDataResponse<Route>;

/** PUT /api/routes/:id/waypoints/:deliveryId/visit */
export type RouteVisitWaypointResponse = ApiDataResponse<Route>;

/** PUT /api/routes/:id/complete */
export interface RouteCompleteResponse {
  data: Route;
  analysis: RouteAnalysis;
}

/** GET /api/routes/:id/analysis */
export type RouteAnalysisResponse = ApiDataResponse<RouteAnalysis>;

// ============================================================
// 4. Mapa tipado de endpoints (utilidad para el cliente HTTP)
// ============================================================

/**
 * Mapa de endpoints → tipo de respuesta.
 * Usar con el cliente HTTP genérico del frontend:
 *
 *   api.get<EndpointResponseMap['GET /api/deliveries']>('/api/deliveries')
 *   api.post<EndpointResponseMap['POST /api/auth/sign-in']>('/api/auth/sign-in', body)
 */
export interface EndpointResponseMap {
  // Auth
  'POST /api/auth/sign-in': AuthResponse;
  'POST /api/auth/sign-up': AuthResponse;
  'POST /api/auth/register': AuthResponse;
  'POST /api/auth/logout': LogoutResponse;
  'GET  /api/auth/me': MeResponse;

  // Deliveries
  'GET    /api/deliveries': DeliveryListResponse;
  'POST   /api/deliveries': DeliveryCreateResponse;
  'GET    /api/deliveries/:id': DeliveryDetailResponse;
  'PUT    /api/deliveries/:id/status': DeliveryUpdateStatusResponse;
  'DELETE /api/deliveries/:id': DeliveryDeleteResponse;

  // Routes
  'GET    /api/routes': RouteListResponse;
  'POST   /api/routes': RouteCreateResponse;
  'GET    /api/routes/:id': RouteDetailResponse;
  'GET    /api/routes/:id/analysis': RouteAnalysisResponse;
  'PUT    /api/routes/:id/start': RouteStartResponse;
  'PUT    /api/routes/:id/pause': RoutePauseResponse;
  'PUT    /api/routes/:id/resume': RouteResumeResponse;
  'PUT    /api/routes/:id/complete': RouteCompleteResponse;
  'PUT    /api/routes/:id/waypoints/:deliveryId/visit': RouteVisitWaypointResponse;
}
