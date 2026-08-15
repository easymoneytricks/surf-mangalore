import { apiRequest } from './http'
import { type AdminPermissionsListParams, type AdminPermissionsListResponse, type AdminPermissionSummary } from '../types/permissions'

export type { AdminPermissionsListParams, AdminPermissionsListResponse, AdminPermissionSummary } from '../types/permissions'

function buildQuery(params: AdminPermissionsListParams) {
  const searchParams = new URLSearchParams()

  if (params.page) searchParams.set('page', String(params.page))
  if (params.pageSize) searchParams.set('pageSize', String(params.pageSize))
  if (params.search) searchParams.set('search', params.search)
  if (params.resource) searchParams.set('resource', params.resource)
  if (params.action) searchParams.set('action', params.action)

  const query = searchParams.toString()
  return query ? `?${query}` : ''
}

export const permissionsService = {
  list(params: AdminPermissionsListParams) {
    return apiRequest<AdminPermissionsListResponse>(`/permissions${buildQuery(params)}`)
  },

  getById(id: number) {
    return apiRequest<AdminPermissionSummary>(`/permissions/${id}`)
  },
}