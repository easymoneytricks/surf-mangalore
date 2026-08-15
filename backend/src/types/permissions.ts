export type PermissionListQuery = {
  page?: number
  pageSize?: number
  search?: string
  resource?: string
  action?: string
}

export type PermissionSummary = {
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

export type PermissionGroupResponse = {
  resource: string
  title: string
  permissions: PermissionSummary[]
}

export type PermissionListResponse = {
  items: PermissionSummary[]
  grouped: PermissionGroupResponse[]
  pagination: {
    page: number
    pageSize: number
    totalItems: number
    totalPages: number
  }
}