import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import type { AuthUser, RegisterPayload } from '../types/api'
import {
  AUTH_UNAUTHORIZED_EVENT,
  clearStoredAccessToken,
  getStoredAccessToken,
  setStoredAccessToken,
} from '../services/authToken'
import { authService } from '../services/authService'
import { AuthContext, type AuthContextValue } from './authContextCore'

export function AuthProvider({ children }: PropsWithChildren) {
  const [accessToken, setAccessToken] = useState(() => getStoredAccessToken())
  const [isInitializing, setIsInitializing] = useState(true)
  const [user, setUser] = useState<AuthUser | null>(null)
  const navigate = useNavigate()
  const location = useLocation()

  const clearAuth = useCallback(() => {
    clearStoredAccessToken()
    setAccessToken(null)
    setUser(null)
  }, [])

  const logout = useCallback(() => {
    clearAuth()
    navigate('/login', { replace: true })
  }, [clearAuth, navigate])

  useEffect(() => {
    const handleUnauthorized = () => {
      clearAuth()
      navigate('/login', {
        replace: true,
        state: { from: location },
      })
    }

    window.addEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized)
    return () => window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized)
  }, [clearAuth, location, navigate])

  useEffect(() => {
    let isMounted = true

    const loadSession = async () => {
      if (!accessToken) {
        setIsInitializing(false)
        return
      }

      try {
        const currentUser = await authService.getMe()
        if (isMounted) {
          setUser(currentUser)
        }
      } catch {
        if (isMounted) {
          clearAuth()
        }
      } finally {
        if (isMounted) {
          setIsInitializing(false)
        }
      }
    }

    void loadSession()

    return () => {
      isMounted = false
    }
  }, [accessToken, clearAuth])

  const login = useCallback(async (username: string, password: string) => {
    const response = await authService.login(username, password)
    setStoredAccessToken(response.access_token)
    setAccessToken(response.access_token)
    const currentUser = await authService.getMe()
    setUser(currentUser)
  }, [])

  const register = useCallback(
    async (payload: RegisterPayload) => {
      const response = await authService.register(payload)

      if ('access_token' in response && response.access_token) {
        setStoredAccessToken(response.access_token)
        setAccessToken(response.access_token)
        const currentUser = await authService.getMe()
        setUser(currentUser)
        return
      }

      await login(payload.username, payload.password)
    },
    [login],
  )

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated: Boolean(accessToken),
      isInitializing,
      login,
      logout,
      register,
      user,
    }),
    [accessToken, isInitializing, login, logout, register, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
