# API Endpoints

Complete reference of all backend endpoints consumed by the frontend.

## Base Configuration

- **Base URL**: `http://localhost:4000/api` (from `VITE_API_URL` env var)
- **Auth**: `Authorization: Bearer <jwt>` header
- **Format**: JSON request/response
- **Error format**: `{ message?: string, error?: string }` (client reads both fields)

---

## Auth

### `POST /api/auth/sign-in`

Login with credentials.

| | |
|---|---|
| **Request** | `{ username: string, password: string }` |
| **Response** | `{ token: string, user: { id, username, name } }` |
| **Client** | `authService.login()` |

### `POST /api/auth/sign-up`

Register new account.

| | |
|---|---|
| **Request** | `{ name: string, username: string, password: string }` |
| **Response** | `{ token: string, user: { id, username, name } }` |
| **Client** | `authService.register()` |

### `GET /api/auth/me`

Get current user. Defined in service but **not used** in current code.

---

## Deliveries

### `GET /api/deliveries`

List all deliveries.

| | |
|---|---|
| **Query** | `?status=pending&zona=Centro` (optional) |
| **Response** | `Delivery[]` |
| **Client** | `deliveryService.getAll()` |

### `GET /api/deliveries/:id`

Get single delivery.

| | |
|---|---|
| **Response** | `Delivery` |
| **Client** | `deliveryService.getById()` |

### `POST /api/deliveries`

Create delivery.

| | |
|---|---|
| **Request** | `CreateDeliveryRequest` |
| **Response** | `Delivery` |
| **Client** | `deliveryService.create()` |

### `PUT /api/deliveries/:id/status`

Update delivery status.

| | |
|---|---|
| **Request** | `{ status: 'in_transit' \| 'delivered' }` |
| **Response** | `Delivery` |
| **Client** | `deliveryService.updateStatus()` |

### `DELETE /api/deliveries/:id`

Delete delivery.

| | |
|---|---|
| **Response** | `{ message: string }` |
| **Client** | `deliveryService.delete()` |

---

## Routes

### `GET /api/routes`

List all routes with waypoints.

| | |
|---|---|
| **Response** | `Route[]` |
| **Client** | `routeService.getAll()` |

### `GET /api/routes/:id`

Get single route.

| | |
|---|---|
| **Response** | `Route` |
| **Client** | `routeService.getById()` |

### `POST /api/routes`

Create route.

| | |
|---|---|
| **Request** | `{ name: string, deliveryIds: string[], optimize?: boolean }` |
| **Response** | `Route` |
| **Client** | `routeService.create()` |

### `PUT /api/routes/:id/start`

Start route execution. Transitions `draft → in_progress`.

| | |
|---|---|
| **Response** | `Route` |
| **Client** | `routeService.start()` |

### `PUT /api/routes/:id/pause`

Pause route. Transitions `in_progress → paused`.

| | |
|---|---|
| **Response** | `Route` |
| **Client** | `routeService.pause()` |

### `PUT /api/routes/:id/resume`

Resume paused route. Transitions `paused → in_progress`.

| | |
|---|---|
| **Response** | `Route` |
| **Client** | `routeService.resume()` |

### `PUT /api/routes/:id/complete`

Complete route. Transitions `in_progress → completed`. Response includes `analysis`.

| | |
|---|---|
| **Response** | `Route & { analysis?: RouteAnalysis }` |
| **Client** | `routeService.complete()` |

### `PUT /api/routes/:routeId/waypoints/:deliveryId/visit`

Mark waypoint as visited.

| | |
|---|---|
| **Request** | `{ packagesDelivered?: number }` |
| **Response** | `{ waypoints: RouteWaypoint[] }` |
| **Client** | `routeService.visitWaypoint()` |

### `GET /api/routes/:id/analysis`

Get route analysis. Defined but **not directly called** (embedded in complete response).

| | |
|---|---|
| **Response** | `RouteAnalysis` |
| **Client** | `routeService.getAnalysis()` (available, unused) |

---

## Zones (Future)

### `GET /api/zones`

Get zone polygons for Aguachica.

**Not implemented** on frontend. Defined in API-CONTRATO.md as optional/future.

---

## HTTP Status Codes

| Code | Meaning | Client Handling |
|---|---|---|
| 200 | Success | `data` extracted |
| 201 | Created | `data` extracted |
| 400 | Validation error | `error` from `message` or `error` field |
| 401 | Unauthorized | `error` from `message` or `error` field |
| 404 | Not found | `error` from `message` or `error` field |
| 500 | Server error | `error` from `message` or `error` field |
| Network error | No response | `'Error de conexion con el servidor'` |

All non-OK responses return `{ error: string }` through the API client.

For full backend contract details, see `API-CONTRATO.md`.
