export type User = {
  id: string
  username: string
  name: string
}

export type AuthState = {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export type AuthActions = {
  login: (credentials: { username: string; password: string }) => Promise<void>
  register: (credentials: { name: string; username: string; password: string }) => Promise<void>
  logout: () => void
  clearError: () => void
}
