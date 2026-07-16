# Configuration

## Vite (`vite.config.ts`)

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
})
```

- **React plugin**: Fast Refresh + JSX transform
- **Tailwind plugin**: Tailwind CSS v4 Vite integration
- **Path alias**: `@/` → `src/` for clean imports

## TypeScript

### `tsconfig.json`
References `tsconfig.app.json` and `tsconfig.node.json` (composite project).

### `tsconfig.app.json`
- **Target**: ES2023
- **Module**: ESNext (bundler resolution)
- **JSX**: react-jsx (automatic import)
- **Paths**: `@/*` → `./src/*`
- **Strict options**: `noUnusedLocals`, `noUnusedParameters`, `erasableSyntaxOnly`, `noFallthroughCasesInSwitch`
- **verbatimModuleSyntax**: true (requires `type` prefix for type-only imports)

### `tsconfig.node.json`
- **Target**: ES2023
- **Module**: nodenext
- For Vite config file only

## Tailwind CSS v4 (`globals.css`)

```css
@import "tailwindcss";

@theme {
  /* Font sizes (slightly larger than default) */
  --font-size-xs: 0.8125rem;
  --font-size-sm: 0.9375rem;
  --font-size-base: 1.125rem;
  --font-size-lg: 1.25rem;
  --font-size-xl: 1.5rem;
  --font-size-2xl: 1.75rem;
  --font-size-3xl: 2rem;
  --font-size-4xl: 2.5rem;

  /* Dark theme tokens (shadcn-inspired) */
  --color-background: #0f172a;
  --color-foreground: #f1f5f9;
  --color-card: #1e293b;
  --color-card-foreground: #f1f5f9;
  --color-primary: #3b82f6;
  --color-primary-foreground: #ffffff;
  --color-secondary: #64748b;
  --color-muted: #1e293b;
  --color-muted-foreground: #94a3b8;
  --color-accent: #1e293b;
  --color-destructive: #ef4444;
  --color-border: #334155;
  --color-input: #1e293b;
  --color-ring: #3b82f6;
  --radius: 0.5rem;
}
```

**Theme class**: Dark only. No light mode. All tokens are dark slate palette values.

## Oxlint (`.oxlintrc.json`)

```json
{
  "plugins": ["react", "typescript", "oxc"],
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

Minimal config. Only 2 rules:
- **rules-of-hooks**: Ensures hooks are called correctly
- **only-export-components**: Warns on non-component exports from JSX files

Run via: `npm run lint` → `oxlint`

## Environment (`.env`)

```
VITE_API_URL=http://localhost:4000/api
```

Single variable. Access via `import.meta.env.VITE_API_URL` in `shared/api/client.ts`.

## HTML (`index.html`)

- Lang: `es`
- Title: "Gestion de Pedidos y Rutas"
- Favicon: `/favicon.svg`
- Entry: `/src/main.tsx`

## Scripts (`package.json`)

| Script | Command | Purpose |
|---|---|---|
| `dev` | `vite` | Dev server with HMR |
| `build` | `tsc -b && vite build` | Type check then production build |
| `lint` | `oxlint` | Run linter |
| `preview` | `vite preview` | Preview production build locally |
