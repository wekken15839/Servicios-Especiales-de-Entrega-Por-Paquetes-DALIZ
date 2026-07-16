# Decision Log

Architectural Decision Records for DaLiz Frontend.

---

## ADR-001: Zustand over Redux/Context

**Date**: 2026-02  
**Status**: Accepted

### Context
Needed global state management for auth and map data.

### Decision
Chose **Zustand** (v5) over Redux Toolkit and React Context.

### Rationale
- Minimal boilerplate compared to Redux
- No providers needed (unlike Context)
- Supports middleware-less async actions
- Tree-shakeable selectors prevent unnecessary re-renders
- Built-in TypeScript support

### Consequences
- Two Zustand stores: `authStore` and `mapStore`
- Future stores should follow the same pattern
- `useSidebar` is a 3rd mini-store for UI state

---

## ADR-002: Feature-Sliced Design (FSD)

**Date**: 2026-02  
**Status**: Accepted

### Context
Needed a scalable folder structure as the app grows.

### Decision
Chose **Feature-Sliced Design** with `shared/` + `features/` layers.

### Rationale
- Each feature is self-contained (types, store, api, hooks, components, pages)
- `shared/` holds cross-cutting code (UI kit, API client, layout)
- Clear dependency rules: features → shared (never shared → features)
- Feature folders serve as explicit bounded contexts

### Consequences
- `features/deliveries/` and `features/routes/` are dependency-only features (no pages)
- `features/map/` depends on both deliveries and routes features
- `features/auth/` is a full-stack feature (components + pages + store)

---

## ADR-003: Fetch over Axios

**Date**: 2026-02  
**Status**: Superseded by [ADR-008](#adr-008-axios-over-fetch)

### Decision
Chose native `fetch` over Axios for HTTP client.

### Rationale
- Zero dependencies
- Native API available in all modern browsers
- Simple wrapper in `shared/api/client.ts` handles JWT injection + error normalization
- Auto-unwraps `{ data: ... }` from backend responses

### Consequences
- No request/response interceptors (manual handling)
- No upload progress tracking (not needed for this app)
- Error responses implement `{ data?: T, error?: string }` pattern

---

## ADR-008: Axios over Fetch

**Date**: 2026-06  
**Status**: Accepted  
**Supersedes**: [ADR-003](#adr-003-fetch-over-axios)

### Decision
Replace native `fetch` with **Axios** for HTTP client.

### Rationale
- Built-in request/response interceptors simplify JWT injection and error handling
- Automatic JSON serialization/deserialization
- Request timeout support
- Better error object structure (avoids manual `response.json()` parsing)
- Interceptors allow centralized 401 handling (future: auto-redirect to login)
- Upload progress tracking available if needed

### Consequences
- New dependency: `axios` in `package.json`
- `shared/api/client.ts` must be rewritten to use `axios.create()` with interceptors
- All service files (`auth.service`, `delivery.service`, `route.service`) are unaffected — they call `api.post/get/put/delete` which will keep the same interface
- No change to `ApiResponse<T>` type (`{ data?: T, error?: string }`) — internal implementation changes, external contract preserved

---

## ADR-004: shadcn/ui Pattern without Dependency

**Date**: 2026-02  
**Status**: Accepted

### Decision
Recreated the shadcn/ui pattern (Radix primitives + CVA variants) with manually authored component code. The `shadcn-ui` CLI (`^0.9.5`) is present in `package.json` but components are not generated via `npx shadcn-ui add`.

### Rationale
- Full control over component code
- No CLI dependency
- Same component API (variants via CVA, primitives via Radix)
- Components live in `shared/components/ui/`

### Consequences
- Components are manually maintained (no `npx shadcn-ui add`)
- Must replicate patterns when adding new components
- Tailwind theme tokens defined in `globals.css` must match CVA variants

---

## ADR-005: Dark Theme Only

**Date**: 2026-02  
**Status**: Accepted

### Decision
Implemented dark theme exclusively — no light mode toggle.

### Rationale
- Reduces complexity (no theme switching logic)
- Consistent visual experience
- shadcn-inspired slate color palette

### Consequences
- All `@theme` tokens in `globals.css` are dark values
- No CSS variables for light/dark switching
- Future theme toggle would require significant refactoring

---

## ADR-006: Leaflet over Google Maps

**Date**: 2026-02  
**Status**: Accepted

### Decision
Chose Leaflet (via react-leaflet) over Google Maps API.

### Rationale
- Open source, no API keys required
- OpenStreetMap tiles are free
- react-leaflet provides declarative React API
- Lightweight (~40KB vs Google Maps SDK)
- Custom markers via `divIcon` (no image dependencies)

### Consequences
- No built-in geocoding (must use external service if needed)
- Custom CSS for dark-themed popups (`custom-dark-popup`)
- Marker rendering uses `divIcon` with inline HTML + CSS

---

## ADR-007: Waypoints Embedded in Route Documents

**Date**: 2026-06  
**Status**: Accepted

### Decision
Waypoint data is embedded within Route objects (not normalized/separate collection).

### Rationale
- Single API call fetches complete route with all waypoints
- Waypoints have no independent lifecycle (exist only within a route)
- Reduces API calls and state synchronization complexity
- Aligns with backend MongoDB embedded schema design

### Consequences
- Update operations on waypoints require replacing the full route object in local state
- Must reconstruct all waypoints when route status changes (e.g., all `visited` reset on `start`)
