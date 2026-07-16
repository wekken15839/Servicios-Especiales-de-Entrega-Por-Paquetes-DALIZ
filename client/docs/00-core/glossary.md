# Glossary

## Business Terms

| Term | Definition |
|---|---|
| **Delivery** | A single delivery point. Has a client, address, coordinates, and status. Synonymous with "Pedido", "Entrega", "DeliveryPoint". |
| **DeliveryPoint** | Alias for Delivery (used in map feature type system). |
| **Route** | An ordered sequence of waypoints (deliveries) assigned to be completed in one trip. Has a lifecycle status. |
| **Waypoint** | A stop in a route. References a specific Delivery by ID. Contains lat/lng, order, visited flag, and packages count. |
| **Route execution** | The process of a worker following a route: start → visit each waypoint → complete. |
| **Packages delivered** | Number of packages left at a waypoint when marking it as visited. Replaces the older `packages` field. |
| **Aguachica** | Municipality in Cesar, Colombia. The geographical scope of the application. Center coordinates: `[8.3089, -73.615]`. |
| **WGS84 / EPSG:4326** | Coordinate reference system. Standard lat/lng with minimum 6 decimal places. |

## Technical Terms

| Term | Definition |
|---|---|
| **Feature (FSD)** | A self-contained module under `src/features/<name>/` with its own types, store, api, hooks, components, and pages. |
| **Barrel export** | `index.ts` file that re-exports public API of a folder. Used at every feature root. |
| **UI Kit** | Components in `src/shared/components/ui/`. Button, Card, Input, Select, etc. Pattern: Radix primitives + CVA variants. |
| **Sheet** | A drawer/panel component (`shared/components/Sheet.tsx`). Supports bottom (mobile) and right (desktop) positions. Used as base for CreateRoutePanel, AddDeliveryPanel, MarkVisitedBanner. |
| **Auto-unwrap** | The API client pattern where `{ data: [...] }` responses are unwrapped before reaching the consumer. Request types map directly to response types. |
| **mockData** | Static test data in `features/map/data/mockData.ts`. Not used in production (fetched from API). |
| **Z-indices** | Centralized in `shared/constants/zIndex.ts`. Layers: map (0) → mapControls (100) → mapBanners (200) → mapOverlays (300) → mapFloating (400) → sidebar (1100) → sheet (1200). |

## Status Values

### Delivery Status

| Value | Spanish | Meaning |
|---|---|---|
| `pending` | Pendiente | Not yet assigned or in transit |
| `in_transit` | En transito | Currently part of an active route |
| `delivered` | Entregado | Successfully delivered |

### Route Status

| Value | Spanish | Meaning |
|---|---|---|
| `draft` | Borrador | Created but not started |
| `in_progress` | En progreso | Currently being executed |
| `paused` | Pausada | Temporarily suspended |
| `completed` | Completada | Finished (all or some waypoints visited) |
