import { requireAuthentication } from '../../middlewares/auth.middleware'
import { requirePermissions } from '../../middlewares/authorization.middleware'

export function buildContentPermissionMiddlewares(permission: string) {
  return [
    requireAuthentication,
    requirePermissions(permission),
  ]
}
