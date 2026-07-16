# Auth Feature

**Location**: `src/features/auth/`  
**Type**: Full-stack feature  
**Routes**: `/login`, `/register`  
**Dependencies**: `shared/api/client`, `shared/components/ui/*`

## Responsibility

User authentication: login, registration, JWT management, session persistence.

## Files

| File | Role |
|---|---|
| `types/index.ts` | `User`, `AuthState`, `AuthActions` |
| `api/requests.ts` | `LoginRequest`, `RegisterRequest` |
| `api/responses.ts` | `AuthResponse { token, user }`, `MeResponse { user }` |
| `api/auth.service.ts` | `login()`, `register()`, `getMe()` |
| `store/authStore.ts` | Zustand store: auth state + actions |
| `hooks/useAuth.ts` | Selector hook for consuming auth state |
| `components/LoginForm.tsx` | Login form with zod validation |
| `components/RegisterForm.tsx` | Register form with zod validation |
| `pages/LoginPage.tsx` | Login page layout |
| `pages/RegisterPage.tsx` | Register page layout |
| `index.ts` | Barrel exports |

## State

Managed by `useAuthStore` (Zustand). See `docs/01-architecture/auth-flow.md` for detailed flow.

**Key state**:
- `user: User | null` — null if not authenticated
- `isAuthenticated: boolean` — derived from user + token presence
- `isLoading: boolean` — true during login/register API call
- `error: string | null` — latest error message

## Forms

### LoginForm
- Fields: `username` (min 3 chars), `password` (min 6 chars)
- Validated with zod schema
- On submit: calls `authStore.login()`
- Shows server errors in `<Alert variant="destructive">`
- Redirects to `/` if already authenticated

### RegisterForm
- Fields: `name` (min 2 chars), `username` (min 3 chars), `password` (min 6 chars)
- Validated with zod schema
- On submit: calls `authStore.register()`
- Same error/redirect behavior as LoginForm

## Service

```typescript
authService.login({ username, password })   → POST /api/auth/sign-in
authService.register({ name, username, password }) → POST /api/auth/sign-up
authService.getMe()                         → GET /api/auth/me (unused in current code)
```

## Consumed By

- `ProtectedRoute` — reads `isAuthenticated` to guard routes
- `PublicRoute` — reads `isAuthenticated` to redirect authenticated users
- `Header` — reads `user.name` for display + `logout` action
- `Layout` (indirectly, via ProtectedRoute)

## Edge Cases

- `localStorage` token without user JSON → `loadUser()` returns null
- Login redirect triggered in both the form (`useEffect`) and the route guard (`PublicRoute`) — belt-and-suspenders
- `clearError()` called on input focus to dismiss stale errors
