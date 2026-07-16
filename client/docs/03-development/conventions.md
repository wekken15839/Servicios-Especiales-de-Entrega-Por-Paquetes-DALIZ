# Conventions

## File & Folder Naming

| Element | Convention | Example |
|---|---|---|
| Component files | PascalCase, `.tsx` | `LoginForm.tsx` |
| Non-component files | camelCase, `.ts` | `authStore.ts`, `utils.ts` |
| Barrel files | `index.ts` | Every folder that exports something |
| Feature folders | kebab-case or single word | `auth/`, `map/` |
| Type folders | `types/` inside feature | `features/auth/types/` |
| Store files | `<name>Store.ts` | `mapStore.ts`, `authStore.ts` |
| API files | `<name>.service.ts` | `auth.service.ts` |

## Exports

- **Always use named exports**: `export function ComponentName()` or `export const`
- **Only default export**: `App.tsx` (`export default App`)
- **No `export default` anywhere else** — this is enforced by oxlint rule `react/only-export-components`

## Component Pattern

```tsx
// Named function declaration (never arrow function for components)
export function ComponentName() {
  // Hooks at top
  const store = useStore()
  
  // Derived state
  const computed = store.items.filter(...)
  
  // Return JSX
  return <div>...</div>
}
```

- `forwardRef` for UI components that need ref forwarding (Button, Input, Select, etc.)
- `displayName` set after `forwardRef` call

## UI Component Pattern (shadcn-style)

```tsx
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/shared/lib/utils'

const componentVariants = cva('base-classes', {
  variants: {
    variant: { default: '...', destructive: '...' },
    size: { default: '...', sm: '...', lg: '...' },
  },
  defaultVariants: { variant: 'default', size: 'default' },
})

// Props extend HTML attributes + variant props
interface ComponentProps extends HTMLAttributes<HTMLElement>, VariantProps<typeof componentVariants> {}

// Use forwardRef
const Component = forwardRef<HTMLElement, ComponentProps>(({ className, variant, size, ...props }, ref) => {
  return <element ref={ref} className={cn(componentVariants({ variant, size }), className)} {...props} />
})
Component.displayName = 'Component'
```

## Import Order (implicit)

No enforced import order, but patterns observed:
1. React/hook imports first
2. Third-party libraries
3. `@/` absolute imports (shared)
4. Relative imports (`../`)

## Path Alias

`@/*` → `./src/*` configured in both `vite.config.ts` and `tsconfig.app.json`.

## Zustand Store Pattern

```ts
import { create } from 'zustand'

type StoreState = { /* state shape */ }
type StoreActions = { /* action signatures */ }
type Store = StoreState & StoreActions

export const useStore = create<Store>((set, get) => ({
  // initial state
  key: initialValue,
  
  // setters
  setKey: (value) => set({ key: value }),
  
  // async actions
  fetchData: async () => {
    set({ isLoading: true })
    const result = await service.call()
    set({ data: result.data, isLoading: false })
  },
}))
```

## API Service Pattern

```ts
// features/<name>/api/
// requests.ts  — input types
// responses.ts — output types
// <name>.service.ts — service object

export const service = {
  getAll(): Promise<ApiResponse<GetResponse>> {
    return api.get<GetResponse>('/endpoint')
  },
  create(input: CreateRequest): Promise<ApiResponse<CreateResponse>> {
    return api.post<CreateResponse>('/endpoint', input)
  },
}
```

## Form Pattern (react-hook-form + zod)

```tsx
const schema = z.object({
  field: z.string().min(3, 'Error message'),
})

type FormData = z.infer<typeof schema>

export function FormComponent() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    await action(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Label htmlFor="field">Field</Label>
      <Input id="field" {...register('field')} />
      {errors.field && <p className="text-sm text-destructive">{errors.field.message}</p>}
    </form>
  )
}
```

## Zod Version Note

`zod@4.4.3` uses subpath imports. Some files import `zod` from `'zod'` and others from `'zod/v4'`. Both work in v4 — this is inconsistent. Prefer `'zod'` for consistency.

## Error Handling

1. **API level**: `api/client.ts` catches network errors and non-OK responses → returns `{ error: string }`
2. **Store level**: Async actions check `result.error`, set store `error`, and call `toast.error()`
3. **Component level**: Form errors displayed inline; store errors shown in `<Alert variant="destructive">`

## Styling

- Tailwind CSS v4 with `@theme {}` in `globals.css`
- No CSS modules, no styled-components
- `cn()` for conditional/merged classes: `cn('base', condition && 'conditional', className)`
- Dark theme tokens map to Tailwind color classes (e.g., `bg-background`, `text-muted-foreground`)
