export function normalizePermissionSlug(permission: string) {
  if (permission === '*') {
    return permission
  }

  if (permission.startsWith('manage_')) {
    return `${permission.replace(/^manage_/, '').replaceAll('_', '-')}.manage`
  }

  return permission.toLowerCase()
}

function splitPermission(permission: string) {
  const normalized = normalizePermissionSlug(permission)
  const [resource, action] = normalized.split('.')
  return { resource, action }
}

export function permissionImplies(granted: string, required: string) {
  const normalizedGranted = normalizePermissionSlug(granted)
  const normalizedRequired = normalizePermissionSlug(required)

  if (normalizedGranted === '*' || normalizedGranted === normalizedRequired) {
    return true
  }

  const grantedParts = splitPermission(normalizedGranted)
  const requiredParts = splitPermission(normalizedRequired)

  return grantedParts.resource === requiredParts.resource && grantedParts.action === 'manage'
}

export function hasPermission(permissions: string[] | undefined, required: string) {
  if (!permissions?.length) {
    return false
  }

  return permissions.some((permission) => permissionImplies(permission, required))
}