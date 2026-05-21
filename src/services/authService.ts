import type { AuthUser, LoginResponse, RegisterPayload } from '../types/api'
import { request } from './http'

export const authService = {
  register(payload: RegisterPayload) {
    return request<AuthUser | LoginResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },
  login(username: string, password: string) {
    const body = new URLSearchParams()
    body.set('username', username)
    body.set('password', password)

    return request<LoginResponse>('/api/auth/login', {
      method: 'POST',
      body,
    })
  },
  getMe() {
    return request<AuthUser>('/api/auth/me')
  },
}
