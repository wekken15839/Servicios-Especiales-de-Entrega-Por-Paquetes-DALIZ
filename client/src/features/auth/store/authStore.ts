import { create } from 'zustand'
import { toast } from 'sonner'
import { authService } from '../api/auth.service'
import type { AuthState, AuthActions } from '../types'
import type { User } from '../types'

type AuthStore = AuthState & AuthActions

function loadUser(): User | null {
  const stored = localStorage.getItem('user')
  const token = localStorage.getItem('token')
  if (stored && token) {
    try {
      return JSON.parse(stored)
    } catch {
      return null
    }
  }
  return null
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: loadUser(),
  isAuthenticated: !!loadUser(),
  isLoading: false,
  error: null,

  login: async (credentials) => {
    set({ isLoading: true, error: null })

    const result = await authService.login(credentials)

    if (result.error) {
      set({ error: result.error, isLoading: false })
      toast.error(result.error)
      return
    }

    if (result.data) {
      localStorage.setItem('token', result.data.token)
      localStorage.setItem('user', JSON.stringify(result.data.user))
      set({ user: result.data.user, isAuthenticated: true, isLoading: false })
      toast.success('Inicio de sesión exitoso')
    }
  },

  register: async (credentials) => {
    set({ isLoading: true, error: null })

    const result = await authService.register(credentials)

    if (result.error) {
      set({ error: result.error, isLoading: false })
      toast.error(result.error)
      return
    }

    if (result.data) {
      localStorage.setItem('token', result.data.token)
      localStorage.setItem('user', JSON.stringify(result.data.user))
      set({ user: result.data.user, isAuthenticated: true, isLoading: false })
      toast.success('Cuenta creada exitosamente')
    }
  },

  createUser: async (credentials) => {
    set({ isLoading: true, error: null })

    const result = await authService.register(credentials)

    if (result.error) {
      set({ error: result.error, isLoading: false })
      toast.error(result.error)
      return result.error
    }

    set({ isLoading: false })
    toast.success(`Usuario "${credentials.username}" creado exitosamente`)
    return null
  },

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    set({ user: null, isAuthenticated: false, error: null })
  },

  clearError: () => {
    set({ error: null })
  },
}))
