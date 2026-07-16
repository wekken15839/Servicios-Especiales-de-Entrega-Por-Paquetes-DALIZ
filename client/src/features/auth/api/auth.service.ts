import { api } from '@/shared/api/client'
import type { ApiResponse } from '@/shared/api/types'
import type { LoginRequest, RegisterRequest } from './requests'
import type { AuthResponse, MeResponse } from './responses'

export const authService = {
  login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    return api.post<AuthResponse>('/api/auth/sign-in', credentials)
  },

  register(credentials: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    return api.post<AuthResponse>('/api/auth/sign-up', credentials)
  },

  getMe(): Promise<ApiResponse<MeResponse>> {
    return api.get<MeResponse>('/api/auth/me')
  },
}
