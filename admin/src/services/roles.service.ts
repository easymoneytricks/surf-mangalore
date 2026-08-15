import { apiRequest } from './http'
import { type AdminRoleMutationInput, type AdminRolePermissionsInput, type AdminRoleRecord, type AdminRolesListParams } from '../types/roles'

export type { AdminRoleMutationInput, AdminRolePermissionsInput, AdminRoleRecord, AdminRolesListParams } from '../types/roles'

type RolesListResponse = {
  items: AdminRoleRecord[]
  pagination: {
    page: number
    pageSize: number
    totalItems: number
    totalPages: number
  }
}

function buildQuery(params: AdminRolesListParams) {
  const searchParams = new URLSearchParams()

  if (params.page) searchParams.set('page', String(params.page))
  if (params.pageSize) searchParams.set('pageSize', String(params.pageSize))
  if (params.search) searchParams.set('search', params.search)
  if (params.status) searchParams.set('status', params.status)

  const query = searchParams.toString()
  return query ? `?${query}` : ''
}

export const rolesService = {
  list(params: AdminRolesListParams) {
    return apiRequest<RolesListResponse>(`/roles${buildQuery(params)}`)
  },

  getById(id: number) {
    return apiRequest<AdminRoleRecord>(`/roles/${id}`)
  },

  create(payload: AdminRoleMutationInput) {
    return apiRequest<AdminRoleRecord>('/roles', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },

  update(id: number, payload: AdminRoleMutationInput) {
    return apiRequest<AdminRoleRecord>(`/roles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    })
  },

  remove(id: number) {
    return apiRequest<null>(`/roles/${id}`, {
      method: 'DELETE',
    })
  },

  updatePermissions(id: number, payload: AdminRolePermissionsInput) {
    return apiRequest<AdminRoleRecord>(`/roles/${id}/permissions`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    })
  },
}