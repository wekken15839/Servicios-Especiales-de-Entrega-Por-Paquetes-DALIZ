# Playbook: New Feature

**Use when**: Creating a new feature module (full-stack or API-only).

## Pre-requisites

Load these docs before starting:
- `docs/01-architecture/architecture-overview.md` — FSD layers and rules
- `docs/03-development/conventions.md` — naming, patterns, exports
- `docs/01-architecture/state-management.md` — if the feature needs a store

## Procedure

### Step 1: Decide Feature Type

| Type | Has Pages? | Has Store? | Has Components? | Example |
|---|---|---|---|---|
| Full-stack | Yes | Optional | Yes | `auth`, `map` |
| API-only | No | No | No | `deliveries`, `routes` |

### Step 2: Create Folder Structure

```
src/features/<name>/
├── index.ts
├── types/index.ts
├── api/                    (skip if no API)
│   ├── <name>.service.ts
│   ├── requests.ts
│   └── responses.ts
├── store/<name>Store.ts    (skip if no state)
├── hooks/                  (optional)
├── components/             (skip if API-only)
└── pages/                  (skip if API-only)
```

### Step 3: Define Types

```typescript
// types/index.ts
export type MyEntity = { id: string; name: string }

// State + Actions (if store exists)
export type MyState = { items: MyEntity[]; isLoading: boolean; error: string | null }
export type MyActions = { fetchItems: () => Promise<void> }
```

If depending on another feature's types, import from its barrel:
```typescript
import type { Delivery } from '@/features/deliveries'
```

### Step 4: Create API Service (if needed)

- `api/requests.ts` — input types
- `api/responses.ts` — output types
- `api/<name>.service.ts` — service object using `api` from `@/shared/api/client`

### Step 5: Create Store (if needed)

Use Zustand `create<State & Actions>()` pattern. See `docs/03-development/conventions.md` for the store pattern.

### Step 6: Create Components (if full-stack)

One named function component per file. Follow the component pattern from `docs/03-development/conventions.md`.

### Step 7: Create Pages (if full-stack)

Page orchestrates the feature's components. Entry point for the route.

### Step 8: Update Barrel Exports

```typescript
// index.ts
export { MyPage } from './pages/MyPage'
export { useMyStore } from './store/myStore'
export type { MyEntity } from './types'
```

### Step 9: Register Route (if full-stack)

In `src/app/router.tsx`, add route under `ProtectedRoute` or `PublicRoute`.

### Step 10: Add Navigation Item (if needed)

Add to `NAV_ITEMS` in `src/shared/components/NavItems.tsx`.

## Post-Implementation

- [ ] Run `npm run lint`
- [ ] Run `npm run build` (type check)
- [ ] Update `docs/04-features/<name>.md` with feature documentation
- [ ] Update `docs/knowledge-index.md` if new doc added
- [ ] Register ADR in `docs/decision-log.md` if architectural decision
- [ ] Follow `maintenance.md` for any docs affected
