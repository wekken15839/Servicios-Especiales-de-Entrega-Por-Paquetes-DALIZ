# Playbook: Add Component

**Use when**: Creating a new component (UI kit or feature-specific).

## Pre-requisites

Load these docs before starting:
- `docs/03-development/conventions.md` — naming, export, and component patterns
- `docs/01-architecture/architecture-overview.md` — where to place the component
- Feature doc at `docs/04-features/<feature-name>.md` (if feature component)

## Component Placement Decision

| Component Type | Where to Place |
|---|---|
| UI primitive (button, input, card) | `src/shared/components/ui/<Name>.tsx` |
| Layout/shell (sidebar, header, sheet) | `src/shared/components/<Name>.tsx` |
| Map layer/control | `src/features/map/components/<Name>.tsx` |
| Feature-specific | `src/features/<name>/components/<Name>.tsx` |

## Procedure

### Step 1: Choose Pattern

**UI Kit component** (shadcn-style):
```tsx
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/shared/lib/utils'
import { forwardRef, type HTMLAttributes } from 'react'

// 1. Define variants with CVA
// 2. Props interface extending HTMLAttributes + VariantProps
// 3. forwardRef + cn() + displayName
```

**Feature component**:
```tsx
// Named function declaration (no arrow)
// Hooks at top
// Derived state
// Return JSX
export function ComponentName() { ... }
```

Full patterns in `docs/03-development/conventions.md`.

### Step 2: Create File

Named export only. PascalCase filename matching component name.

### Step 3: Wire Up

- Import in parent component/page
- If replacing existing markup, remove old code
- Test rendering

### Step 4: Update Documentation

| Component Type | Doc to Update |
|---|---|
| UI kit | `docs/01-architecture/architecture-overview.md` — add to UI components table |
| Feature component | `docs/04-features/<feature-name>.md` — add to component list |
| Layout/shell | `docs/01-architecture/architecture-overview.md` |

## Post-Implementation

- [ ] Run `npm run lint`
- [ ] Component renders correctly
- [ ] Follows existing naming and pattern conventions
- [ ] Feature doc updated with new component
