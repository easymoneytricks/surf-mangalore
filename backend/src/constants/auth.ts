export const USER_ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  EDITOR: 'EDITOR',
  VIEWER: 'VIEWER',
  CONTENT_MANAGER: 'CONTENT_MANAGER',
  SUPPORT: 'SUPPORT',
  OPERATIONS: 'OPERATIONS',
} as const

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES]

export const PERMISSION_ACTIONS = ['view', 'create', 'edit', 'delete', 'publish', 'manage'] as const

export type PermissionAction = (typeof PERMISSION_ACTIONS)[number]

export const PERMISSION_RESOURCES = [
  'dashboard',
  'users',
  'roles',
  'permissions',
  'coaches',
  'lessons',
  'experiences',
  'events',
  'bookings',
  'gallery',
  'testimonials',
  'faqs',
  'contact-messages',
  'seo',
  'site-settings',
  'media',
  'audit-logs',
] as const

export type PermissionResource = (typeof PERMISSION_RESOURCES)[number]

export function permissionSlug(resource: PermissionResource | string, action: PermissionAction) {
  return `${resource}.${action}`
}

export function normalizePermissionSlug(permission: string) {
  if (permission === '*') {
    return permission
  }

  if (permission.startsWith('manage_')) {
    return `${permission.replace(/^manage_/, '').replaceAll('_', '-')}.manage`
  }

  return permission.toLowerCase()
}

export function permissionResource(permission: string) {
  const normalized = normalizePermissionSlug(permission)
  const [resource] = normalized.split('.')
  return resource
}

export function permissionAction(permission: string) {
  const normalized = normalizePermissionSlug(permission)
  const [, action] = normalized.split('.')
  return action as PermissionAction | undefined
}

export function permissionImplies(granted: string, required: string) {
  const normalizedGranted = normalizePermissionSlug(granted)
  const normalizedRequired = normalizePermissionSlug(required)

  if (normalizedGranted === '*' || normalizedGranted === normalizedRequired) {
    return true
  }

  const grantedResource = permissionResource(normalizedGranted)
  const grantedAction = permissionAction(normalizedGranted)
  const requiredResource = permissionResource(normalizedRequired)
  const requiredAction = permissionAction(normalizedRequired)

  if (!grantedResource || !grantedAction || !requiredResource || !requiredAction) {
    return false
  }

  return grantedResource === requiredResource && grantedAction === 'manage'
}

export const AUTH_PERMISSIONS = {
  VIEW_DASHBOARD: permissionSlug('dashboard', 'view'),
  MANAGE_USERS: permissionSlug('users', 'manage'),
  MANAGE_ROLES: permissionSlug('roles', 'manage'),
  MANAGE_PERMISSIONS: permissionSlug('permissions', 'manage'),
  MANAGE_EVENTS: permissionSlug('events', 'manage'),
  MANAGE_EXPERIENCES: permissionSlug('experiences', 'manage'),
  MANAGE_COACHES: permissionSlug('coaches', 'manage'),
  MANAGE_MEDIA: permissionSlug('media', 'manage'),
  MANAGE_LESSONS: permissionSlug('lessons', 'manage'),
  MANAGE_GALLERY: permissionSlug('gallery', 'manage'),
  MANAGE_BOOKINGS: permissionSlug('bookings', 'manage'),
  MANAGE_SEO: permissionSlug('seo', 'manage'),
  MANAGE_SETTINGS: permissionSlug('site-settings', 'manage'),
  MANAGE_FAQS: permissionSlug('faqs', 'manage'),
  MANAGE_TESTIMONIALS: permissionSlug('testimonials', 'manage'),
  MANAGE_CONTACT_MESSAGES: permissionSlug('contact-messages', 'manage'),
  VIEW_AUDIT_LOGS: permissionSlug('audit-logs', 'view'),
} as const

export const ROLE_HIERARCHY: UserRole[] = [
  USER_ROLES.SUPER_ADMIN,
  USER_ROLES.ADMIN,
  USER_ROLES.CONTENT_MANAGER,
  USER_ROLES.EDITOR,
  USER_ROLES.VIEWER,
  USER_ROLES.OPERATIONS,
  USER_ROLES.SUPPORT,
]

const CONTENT_MANAGEMENT_PERMISSIONS = [
  AUTH_PERMISSIONS.MANAGE_EVENTS,
  AUTH_PERMISSIONS.MANAGE_EXPERIENCES,
  AUTH_PERMISSIONS.MANAGE_COACHES,
  AUTH_PERMISSIONS.MANAGE_MEDIA,
  AUTH_PERMISSIONS.MANAGE_LESSONS,
  AUTH_PERMISSIONS.MANAGE_GALLERY,
  AUTH_PERMISSIONS.MANAGE_SEO,
  AUTH_PERMISSIONS.MANAGE_FAQS,
  AUTH_PERMISSIONS.MANAGE_TESTIMONIALS,
  AUTH_PERMISSIONS.MANAGE_CONTACT_MESSAGES,
]

export const ROLE_DEFAULT_PERMISSIONS: Record<UserRole, string[]> = {
  [USER_ROLES.SUPER_ADMIN]: ['*'],
  [USER_ROLES.ADMIN]: [
    AUTH_PERMISSIONS.VIEW_DASHBOARD,
    AUTH_PERMISSIONS.MANAGE_USERS,
    AUTH_PERMISSIONS.MANAGE_ROLES,
    AUTH_PERMISSIONS.MANAGE_PERMISSIONS,
    AUTH_PERMISSIONS.MANAGE_BOOKINGS,
    AUTH_PERMISSIONS.MANAGE_SETTINGS,
    AUTH_PERMISSIONS.VIEW_AUDIT_LOGS,
    ...CONTENT_MANAGEMENT_PERMISSIONS,
  ],
  [USER_ROLES.CONTENT_MANAGER]: [
    AUTH_PERMISSIONS.VIEW_DASHBOARD,
    ...CONTENT_MANAGEMENT_PERMISSIONS,
  ],
  [USER_ROLES.EDITOR]: [
    AUTH_PERMISSIONS.VIEW_DASHBOARD,
    AUTH_PERMISSIONS.MANAGE_EVENTS,
    AUTH_PERMISSIONS.MANAGE_EXPERIENCES,
    AUTH_PERMISSIONS.MANAGE_COACHES,
    AUTH_PERMISSIONS.MANAGE_MEDIA,
    AUTH_PERMISSIONS.MANAGE_GALLERY,
    AUTH_PERMISSIONS.MANAGE_FAQS,
    AUTH_PERMISSIONS.MANAGE_TESTIMONIALS,
  ],
  [USER_ROLES.VIEWER]: [
    AUTH_PERMISSIONS.VIEW_DASHBOARD,
  ],
  [USER_ROLES.OPERATIONS]: [
    AUTH_PERMISSIONS.VIEW_DASHBOARD,
    AUTH_PERMISSIONS.MANAGE_BOOKINGS,
    AUTH_PERMISSIONS.MANAGE_CONTACT_MESSAGES,
  ],
  [USER_ROLES.SUPPORT]: [
    AUTH_PERMISSIONS.VIEW_DASHBOARD,
    AUTH_PERMISSIONS.MANAGE_BOOKINGS,
    AUTH_PERMISSIONS.MANAGE_CONTACT_MESSAGES,
  ],
}