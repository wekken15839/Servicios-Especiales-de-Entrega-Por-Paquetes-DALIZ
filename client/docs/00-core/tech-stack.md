# Technology Stack

All libraries used in the project with their versions and purpose.

## Core

| Package | Version | Purpose |
|---|---|---|
| `react` | ^19.2.7 | UI framework |
| `react-dom` | ^19.2.7 | DOM rendering |
| `typescript` | ~6.0.2 | Static typing |
| `vite` | ^8.1.0 | Build tool + dev server |

## Routing

| Package | Version | Purpose |
|---|---|---|
| `react-router-dom` | ^7.18.0 | Client-side routing (v7, createBrowserRouter) |

## HTTP

| Package | Version | Purpose |
|---|---|---|
| `axios` | (pending) | HTTP client (replaces native `fetch`, see ADR-008) |

## State Management

| Package | Version | Purpose |
|---|---|---|
| `zustand` | ^5.0.14 | Global state stores (authStore, mapStore, useSidebar) |

## Forms & Validation

| Package | Version | Purpose |
|---|---|---|
| `react-hook-form` | ^7.80.0 | Form state management |
| `zod` | ^4.4.3 | Schema validation |
| `@hookform/resolvers` | ^5.4.0 | Zod ↔ react-hook-form adapter |

## Styling

| Package | Version | Purpose |
|---|---|---|
| `tailwindcss` | ^4.3.1 | Utility-first CSS framework |
| `@tailwindcss/vite` | ^4.3.1 | Tailwind v4 Vite plugin |
| `clsx` | ^2.1.1 | Conditional className construction |
| `tailwind-merge` | ^3.6.0 | Merge Tailwind classes without conflicts |

## UI Components

| Package | Version | Purpose |
|---|---|---|
| `class-variance-authority` | ^0.7.1 | Variant-based component styles |
| `@radix-ui/react-slot` | ^1.3.0 | Polymorphic `asChild` prop |
| `@radix-ui/react-checkbox` | ^1.3.5 | Accessible checkbox primitive |
| `@radix-ui/react-label` | ^2.1.10 | Accessible label primitive |
| `@radix-ui/react-separator` | ^1.1.10 | Accessible separator primitive |
| `lucide-react` | ^1.21.0 | Icon library (all icons) |

## Map

| Package | Version | Purpose |
|---|---|---|
| `leaflet` | ^1.9.4 | Interactive map library |
| `react-leaflet` | ^5.0.0 | React bindings for Leaflet |
| `@types/leaflet` | ^1.9.21 | TypeScript definitions |

## Animation

| Package | Version | Purpose |
|---|---|---|
| `motion` | ^12.42.0 | Animation library (sidebar, sheet, overlay) |

## Notifications

| Package | Version | Purpose |
|---|---|---|
| `sonner` | ^2.0.7 | Toast notifications |

## Quality

| Package | Version | Purpose |
|---|---|---|
| `oxlint` | ^1.69.0 | Linter (replaces ESLint) |
| `@vitejs/plugin-react` | ^6.0.2 | React Fast Refresh in Vite |

## CLI Tools

| Package | Version | Purpose |
|---|---|---|
| `shadcn-ui` | ^0.9.5 | CLI for component scaffolding (installed but components are manually authored, not generated) |

## Not Present

These are **not** installed despite being common in similar projects:

- **Redux / Jotai / Recoil** — Not installed. Zustand only.
- **React Query / SWR** — Not installed. Manual async in Zustand stores.
- **Cypress / Vitest / Jest** — No testing framework.
- **Storybook** — No component documentation tool.
