# Deliveries Feature

**Location**: `src/features/deliveries/`  
**Type**: API-only feature  
**Routes**: None  
**Dependencies**: `shared/api/client`

## Responsibility

API service layer for delivery CRUD operations. Provides types and service consumed by the map feature.

## Files

| File | Role |
|---|---|
| `types/index.ts` | `DeliveryStatus`, `DeliveryType`, `Delivery` |
| `api/requests.ts` | `CreateDeliveryRequest`, `UpdateDeliveryStatusRequest` |
| `api/responses.ts` | `GetDeliveriesResponse`, `GetDeliveryResponse`, etc. |
| `api/delivery.service.ts` | `deliveryService` object with all API calls |
| `index.ts` | Barrel exports |

## Service API

```typescript
deliveryService.getAll()       → GET  /api/deliveries
deliveryService.getById(id)    → GET  /api/deliveries/:id
deliveryService.create(input)  → POST /api/deliveries
deliveryService.updateStatus(id, { status }) → PUT /api/deliveries/:id/status
deliveryService.delete(id)     → DELETE /api/deliveries/:id
```

## Request Types

| Type | Fields |
|---|---|
| `CreateDeliveryRequest` | `title`, `clientName`, `clientPhone?`, `address`, `lat`, `lng`, `notes?` |
| `UpdateDeliveryStatusRequest` | `status`: `'in_transit' \| 'delivered'` |

## Response Types

| Type | Value |
|---|---|
| `GetDeliveriesResponse` | `Delivery[]` |
| `GetDeliveryResponse` | `Delivery` |
| `CreateDeliveryResponse` | `Delivery` |
| `UpdateDeliveryStatusResponse` | `Delivery` |
| `DeleteDeliveryResponse` | `{ message: string }` |

## Entity

See `docs/02-domain/entities.md#delivery` for full entity definition.

## Consumed By

- `features/map/store/mapStore.ts` — `fetchMapData`, `addDelivery`, `deleteDelivery`, `updateDeliveryStatus`
- `features/map/types/index.ts` — type alias `DeliveryPoint = Delivery`

## Notes

- Has no pages, no store, no components — pure API layer
- Acts as a dependency feature for `map`
- The `deliveryService` is the only integration point; the map feature never calls `api.*` directly for deliveries
