export type User = {
  id: string
  username: string
  name: string
  role: string
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
  createUser: (credentials: { name: string; username: string; password: string; role?: string }) => Promise<string | null>
  logout: () => void
  clearError: () => void
}
