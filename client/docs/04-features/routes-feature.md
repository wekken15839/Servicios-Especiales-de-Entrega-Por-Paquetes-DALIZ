# Routes Feature

**Location**: `src/features/routes/`  
**Type**: API-only feature  
**Routes**: `/ruta/:routeId` (rendered by map feature's `RouteDetailPage`)  
**Dependencies**: `shared/api/client`

## Responsibility

API service layer for route CRUD and lifecycle operations. Provides types and service consumed by the map feature.

## Files

| File | Role |
|---|---|
| `types/index.ts` | `RouteStatus`, `RouteWaypoint`, `Route`, `RouteAnalysis` |
| `api/requests.ts` | `CreateRouteRequest`, `VisitWaypointRequest` |
| `api/responses.ts` | `GetRoutesResponse`, `StartRouteResponse`, etc. |
| `api/route.service.ts` | `routeService` object with all API calls |
| `index.ts` | Barrel exports |

## Service API

```typescript
routeService.getAll()                                                  → GET  /api/routes
routeService.getById(id)                                               → GET  /api/routes/:id
routeService.create({ name, deliveryIds, optimize })                   → POST /api/routes
routeService.start(id)                                                 → PUT  /api/routes/:id/start
routeService.pause(id)                                                 → PUT  /api/routes/:id/pause
routeService.resume(id)                                                → PUT  /api/routes/:id/resume
routeService.complete(id)                                              → PUT  /api/routes/:id/complete
routeService.visitWaypoint(routeId, deliveryId, { packagesDelivered }) → PUT  /api/routes/:routeId/waypoints/:deliveryId/visit
routeService.getAnalysis(id)                                           → GET  /api/routes/:id/analysis
```

## Request Types

| Type | Fields |
|---|---|
| `CreateRouteRequest` | `name: string`, `deliveryIds: string[]`, `optimize?: boolean` |
| `VisitWaypointRequest` | `packagesDelivered?: number` |

## Response Types

| Type | Value |
|---|---|
| `GetRoutesResponse` | `Route[]` |
| `GetRouteResponse` | `Route` |
| `CreateRouteResponse` | `Route` |
| `StartRouteResponse` | `Route` |
| `PauseRouteResponse` | `Route` |
| `ResumeRouteResponse` | `Route` |
| `CompleteRouteResponse` | `Route & { analysis?: RouteAnalysis }` |
| `VisitWaypointResponse` | `{ waypoints: RouteWaypoint[] }` |
| `GetRouteAnalysisResponse` | `RouteAnalysis` |

## Entities

See:
- `docs/02-domain/entities.md#route`
- `docs/02-domain/entities.md#routewaypoint`
- `docs/02-domain/entities.md#routeanalysis`

## Consumed By

- `features/map/store/mapStore.ts` — `fetchMapData`, `createRoute`, `startRoute`, `markVisited`, `pauseRoute`, `resumeRoute`, `finishRoute`
- `features/map/types/index.ts` — type aliases for `Route`, `RouteWaypoint`, `RouteAnalysis`
- `features/map/pages/RouteDetailPage.tsx` — `routeService.getById()` (fallback fetch)

## Notes

- Has no pages, no store, no components — pure API layer
- The `routeService` is the only integration point
- `RouteDetailPage` lives in `features/map/pages/` (not in `features/routes/pages/`) because it renders a Leaflet map, making it a map feature concern
- `getAnalysis()` is available in the service but not called directly — analysis data is embedded in the `complete` response
