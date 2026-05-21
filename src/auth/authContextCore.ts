import { createContext, useContext } from 'react'
import type { AuthUser, RegisterPayload } from '../types/api'

export interface AuthContextValue {
  isAuthenticated: boolean
  isInitializing: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  register: (payload: RegisterPayload) => Promise<void>
  user: AuthUser | null
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider.')
  }

  return context
}
