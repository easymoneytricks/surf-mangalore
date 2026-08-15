export type AdminRolePermissionSummary = {
  id: number
  uuid: string
  slug: string
  resource: string
  action: string
  title: string
}

export type AdminRoleRecord = {
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
  permissions: AdminRolePermissionSummary[]
  createdAt: string
  updatedAt: string
}

export type AdminRolesListParams = {
  page?: number
  pageSize?: number
  search?: string
  status?: string
}

export type AdminRoleMutationInput = {
  name: string
  title: string
  description?: string | null
  status?: string
  isSystem?: boolean
  permissionIds?: number[]
}

export type AdminRolePermissionsInput = {
  permissionIds: number[]
}
