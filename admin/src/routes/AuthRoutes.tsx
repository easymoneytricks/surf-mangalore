import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { LoadingState } from '../components/admin'
import { useAuth } from '../contexts/AuthContext'

export function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl py-16">
        <LoadingState mode="card" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}

export function PublicOnlyRoute() {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl py-16">
        <LoadingState mode="card" />
      </div>
    )
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}
