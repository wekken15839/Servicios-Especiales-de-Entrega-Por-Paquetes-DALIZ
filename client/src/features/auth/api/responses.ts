import type { User } from '../types'

export type AuthResponse = {
  token: string
  user: User
}

export type MeResponse = {
  user: User
}
