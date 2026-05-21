import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { LoadingIndicator } from '../components/ui/LoadingIndicator'
import { useAuth } from './authContextCore'

export function ProtectedRoute() {
  const { isAuthenticated, isInitializing } = useAuth()
  const location = useLocation()

  if (isInitializing) {
    return <LoadingIndicator label="Restoring your session..." />
  }

  if (!isAuthenticated) {
    return <Navigate replace state={{ from: location }} to="/login" />
  }

  return <Outlet />
}
