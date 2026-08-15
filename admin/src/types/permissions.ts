export type AdminPermissionSummary = {
  id: number
  uuid: string
  slug: string
  name: string
  title: string
  description: string | null
  resource: string
  action: string
  status: string
  roleCount: number
}

export type AdminPermissionGroup = {
  resource: string
  title: string
  permissions: AdminPermissionSummary[]
}

export type AdminPermissionsListResponse = {
  items: AdminPermissionSummary[]
  grouped: AdminPermissionGroup[]
  pagination: {
    page: number
    pageSize: number
    totalItems: number
    totalPages: number
  }
}

export type AdminPermissionsListParams = {
  page?: number
  pageSize?: number
  search?: string
  resource?: string
  action?: string
}
