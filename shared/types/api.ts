// ============================================================
// Shared API types for Daliz
// Single source of truth for both server and client
// ============================================================

// --- Envoltoras de respuesta ----------------------------------------------------

/** HTTP client-side API response (used by frontend api wrapper) */
export type ApiResponse<T> = {
  data?: T;
  error?: string;
  raw?: Record<string, unknown>;
};

/** Server-side successful data response */
export interface ApiDataResponse<T> {
  data: T;
}

/** Server-side successful message response */
export interface ApiMessageResponse {
  message: string;
}

/** Server-side error response */
export interface ApiErrorResponse {
  message: string;
  error: string;
}

// --- Endpoint Response Map (for typed HTTP client) ---

export interface EndpointResponseMap {
  // Auth
  'POST /api/auth/sign-in': import('./auth.js').AuthResponse;
  'POST /api/auth/sign-up': import('./auth.js').AuthResponse;
  'POST /api/auth/register': import('./auth.js').AuthResponse;
  'POST /api/auth/logout': ApiMessageResponse;
  'GET  /api/auth/me': import('./auth.js').MeResponse;

  // Deliveries
  'GET    /api/deliveries': ApiDataResponse<import('./delivery.js').Delivery[]>;
  'POST   /api/deliveries': ApiDataResponse<import('./delivery.js').Delivery>;
  'GET    /api/deliveries/:id': ApiDataResponse<import('./delivery.js').Delivery>;
  'PUT    /api/deliveries/:id/status': ApiDataResponse<import('./delivery.js').Delivery>;
  'DELETE /api/deliveries/:id': ApiMessageResponse;

  // Clients
  'GET    /api/clients/:id/balance': ApiDataResponse<import('./fiados.js').BalanceResponse>;

  // Fiados
  'POST   /api/fiados/payment': ApiDataResponse<import('./fiados.js').CreditTransaction>;

  // Routes
  'GET    /api/routes': ApiDataResponse<import('./route.js').Route[]>;
  'POST   /api/routes': ApiDataResponse<import('./route.js').Route>;
  'GET    /api/routes/:id': ApiDataResponse<import('./route.js').Route>;
  'GET    /api/routes/:id/analysis': ApiDataResponse<import('./route.js').RouteAnalysis>;
  'PUT    /api/routes/:id/start': ApiDataResponse<import('./route.js').Route>;
  'PUT    /api/routes/:id/pause': ApiDataResponse<import('./route.js').Route>;
  'PUT    /api/routes/:id/resume': ApiDataResponse<import('./route.js').Route>;
  'PUT    /api/routes/:id/complete': {
    data: import('./route.js').Route;
    analysis: import('./route.js').RouteAnalysis;
  };
  'PUT    /api/routes/:id/waypoints/:deliveryId/visit': ApiDataResponse<import('./route.js').Route>;
}
