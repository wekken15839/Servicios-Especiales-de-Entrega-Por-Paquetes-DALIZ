# Business Rules

## Route Lifecycle Rules

1. **Single active route**: The system visually prevents creating or starting a new route while one is `in_progress` or `paused`. (UI constraint, not enforced at API level.)

2. **Draft routes are exclusive with active routes**: The "Crear ruta" button is hidden when a draft or active route exists.

3. **Waypoints immutable after start**: Waypoint order cannot be changed after route starts. Waypoint delivery assignments are fixed at route creation.

4. **Completion is terminal**: Once `completed`, a route cannot be modified, resumed, or restarted.

5. **Start resets visits**: All waypoint `visited` flags are reset to `false` and `visitedAt` to `null` when transitioning `draft → in_progress`.

## Delivery Rules

1. **Coordinates required**: Every delivery must have valid `lat` and `lng` (WGS84, min 6 decimals).

2. **Status sync with route**: When a delivery enters a route (`in_transit`), its individual status reflects this. The `in_transit` status is set optimistically in the store when the route is started (batch update).

3. **Deletion constraint**: Deliveries can only be deleted while a route is active (`in_progress` status). See DeliveryDetailPanel UI.

4. **Delivery uniqueness in route**: The same delivery cannot appear twice in the same route's waypoints. (Assumed — enforced at creation UI.)

## Map UI Rules

1. **Placing mode**: Clicking "Agregar pedido" enters placing mode. Map cursor becomes crosshair. Click sets `pendingLocation`. ESC cancels.

2. **Fullscreen toggle**: Map can expand/collapse. Below-map panels (DeliveryDetailPanel, FilterBar, RouteHistoryPanel) are hidden in fullscreen mode.

3. **Layer toggles**: Routes and markers layers can be independently shown/hidden via MapControls buttons.

4. **Selection ↔ Filter**: If the active filter hides the currently selected delivery, selection is automatically cleared.

5. **Mark visited availability**: The "Marcar como visitado" button appears only when:
   - A route is `in_progress` or `paused`
   - A delivery in that route's waypoints is selected
   - That waypoint has `visited === false`

## Authentication Rules

1. **All protected routes require JWT**: `/`, `/mapa`, `/ruta/:routeId` redirect to `/login` if not authenticated.

2. **Public routes redirect authenticated users**: `/login` and `/register` redirect to `/` if already authenticated.

3. **No token refresh**: JWT has no refresh mechanism on the frontend.

4. **Credentials persisted**: Token and user stored in localStorage. Restored on page load.

## Data Integrity

1. **Optimistic updates with rollback risk**: mapStore actions update local state before API returns. If API fails, error is shown but local state is NOT rolled back. The store relies on backend validation — the next `fetchMapData()` call will correct any inconsistency.

2. **No cross-reference validation on frontend**: Waypoint `deliveryId` references are assumed valid. If a delivery referenced by a waypoint doesn't exist in local state, the UI shows "Cliente desconocido" as fallback text.

3. **mockData is dev-only**: `features/map/data/mockData.ts` is not imported in production code paths. The store always calls the API.
