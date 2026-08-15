import { type UserRole } from '../constants/auth'

export type RoleListQuery = {
  page?: number
  pageSize?: number
  search?: string
  status?: string
}

export type RolePermissionSummary = {
  id: number
  uuid: string
  slug: string
  resource: string
  action: string
  title: string
}

export type RoleResponse = {
  id: number
  uuid: string
  slug: string
  name: string
  title: string
  description: string | null
  status: string
  isSystem: boolean
  userCount: number
  permissionCount: number
  permissions: RolePermissionSummary[]
  createdAt: Date
  updatedAt: Date
}

export type RoleDetailResponse = RoleResponse

export type RoleCreateInput = {
  name: string
  title: string
  description?: string | null
  status?: string
  isSystem?: boolean
  permissionIds?: number[]
}

export type RoleUpdateInput = {
  name?: string
  title?: string
  description?: string | null
  status?: string
  isSystem?: boolean
  permissionIds?: number[]
}

export type RolePermissionUpdateInput = {
  permissionIds: number[]
}

export type SystemRoleName = UserRole