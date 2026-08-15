import { apiRequest } from './http'
import { type AuthUserRole } from './auth.service'
import { type AdminUserCreateInput, type AdminUserPasswordInput, type AdminUserRecord, type AdminUsersListParams } from '../types/users'

export type AdminUserRole = Extract<AuthUserRole, 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR' | 'VIEWER' | 'CONTENT_MANAGER' | 'SUPPORT' | 'OPERATIONS'>
export type AdminUserStatus = 'active' | 'inactive'
export type { AdminUserRecord, AdminUsersListParams, AdminUserCreateInput, AdminUserPasswordInput } from '../types/users'

type UsersListResponse = {
  items: AdminUserRecord[]
  pagination: {
    page: number
    pageSize: number
    totalItems: number
    totalPages: number
  }
}

function buildQuery(params: AdminUsersListParams) {
  const searchParams = new URLSearchParams()

  if (params.page) {
    searchParams.set('page', String(params.page))
  }
  if (params.pageSize) {
    searchParams.set('pageSize', String(params.pageSize))
  }
  if (params.search) {
    searchParams.set('search', params.search)
  }
  if (params.role) {
    searchParams.set('role', params.role)
  }
  if (params.status) {
    searchParams.set('status', params.status)
  }

  const query = searchParams.toString()
  return query ? `?${query}` : ''
}

export const usersService = {
  list(params: AdminUsersListParams) {
    return apiRequest<UsersListResponse>(`/users${buildQuery(params)}`)
  },

  getById(id: number) {
    return apiRequest<AdminUserRecord>(`/users/${id}`)
  },

  update(id: number, payload: {
    name?: string
    email?: string
    role?: AuthUserRole
    status?: string
    avatar?: string | null
  }) {
    return apiRequest<AdminUserRecord>(`/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    })
  },

  create(payload: AdminUserCreateInput) {
    return apiRequest<AdminUserRecord>('/users', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },

  remove(id: number) {
    return apiRequest<null>(`/users/${id}`, {
      method: 'DELETE',
    })
  },

  resetPassword(id: number, payload: Partial<AdminUserPasswordInput>) {
    return apiRequest<{ temporaryPassword?: string }>(`/users/${id}/reset-password`, {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },

  changePassword(id: number, payload: AdminUserPasswordInput) {
    return apiRequest<AdminUserRecord>(`/users/${id}/password`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    })
  },
}