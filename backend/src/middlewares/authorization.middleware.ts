import { type NextFunction, type Request, type Response } from 'express'

import { ROLE_DEFAULT_PERMISSIONS, ROLE_HIERARCHY, permissionImplies, type UserRole } from '../constants/auth'
import { authRepository } from '../repositories/auth.repository'
import { forbiddenError, unauthorizedError } from '../utils/auth-errors'

function roleRank(role: UserRole) {
  const index = ROLE_HIERARCHY.indexOf(role)
  return index === -1 ? Number.MAX_SAFE_INTEGER : index
}

export function requireRoles(...requiredRoles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.authUser) {
      return next(unauthorizedError())
    }

    const hasRequiredRole = requiredRoles.some((requiredRole) => roleRank(req.authUser!.role) <= roleRank(requiredRole))
    if (!hasRequiredRole) {
      return next(forbiddenError('Insufficient role privileges'))
    }

    return next()
  }
}

export function requirePermissions(...requiredPermissions: string[]) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    if (!req.authUser) {
      return next(unauthorizedError())
    }

    const user = await authRepository.findAdminById(req.authUser.id)
    if (!user) {
      return next(unauthorizedError())
    }

    const roleDefaults = ROLE_DEFAULT_PERMISSIONS[user.userRole] ?? []
    const dbPermissions = user.roles.flatMap((userRole) =>
      userRole.role.permissions.map((entry) => entry.permission.slug),
    )

    const permissionSet = new Set([...roleDefaults, ...dbPermissions])
    if (permissionSet.has('*')) {
      return next()
    }

    const hasAllPermissions = requiredPermissions.every((requiredPermission) =>
      [...permissionSet].some((grantedPermission) => permissionImplies(grantedPermission, requiredPermission)),
    )
    if (!hasAllPermissions) {
      return next(forbiddenError('Insufficient permissions'))
    }

    return next()
  }
}
