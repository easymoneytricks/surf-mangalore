import { Outlet } from 'react-router-dom'

import ForbiddenPage from '../pages/errors/ForbiddenPage'
import { useAuth } from '../contexts/AuthContext'
import { hasPermission } from '../utils/permissions'

type PermissionRouteProps = {
  permission: string
}

export default function PermissionRoute({ permission }: PermissionRouteProps) {
  const { user, loading } = useAuth()

  if (loading) {
    return null
  }

  if (!user || !hasPermission(user.permissions, permission)) {
    return <ForbiddenPage />
  }

  return <Outlet />
}