import { type AuthUserRole } from '../services/auth.service'

export type AdminUserRole = Extract<AuthUserRole, 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR' | 'VIEWER' | 'CONTENT_MANAGER' | 'SUPPORT' | 'OPERATIONS'>
export type AdminUserStatus = 'active' | 'inactive'

export type AdminUserRecord = {
  id: number
  uuid: string
  name: string
  email: string
  role: AuthUserRole
  status: string
  avatar: string | null
  lastLogin: string | null
  createdAt: string
  updatedAt: string
  mustChangePassword: boolean
}

export type AdminUsersListParams = {
  page?: number
  pageSize?: number
  search?: string
  role?: AuthUserRole
  status?: string
}

export type AdminUserCreateInput = {
  name: string
  email: string
  password: string
  role: AuthUserRole
  status: AdminUserStatus
  avatar?: string | null
  mustChangePassword?: boolean
}

export type AdminUserUpdateInput = Partial<Pick<AdminUserCreateInput, 'name' | 'email' | 'role' | 'status' | 'avatar'>>

export type AdminUserPasswordInput = {
  password: string
  mustChangePassword?: boolean
}
