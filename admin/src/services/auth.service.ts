import { apiRequest, ApiRequestError } from './http'

export type AuthUserRole = 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR' | 'VIEWER' | 'CONTENT_MANAGER' | 'SUPPORT' | 'OPERATIONS'

export type AuthUser = {
  id: number
  uuid: string
  name: string
  email: string
  role: AuthUserRole
  avatar: string | null
  status: string
  mustChangePassword: boolean
  permissions: string[]
}

type AuthResponse = {
  accessToken: string
  user: AuthUser
}

export const authService = {
  async login(email: string, password: string) {
    try {
      return await apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        password,
      }),
      })
    } catch (error) {
      if (error instanceof ApiRequestError && error.statusCode === 401) {
        throw new ApiRequestError('Invalid email or password.', error.statusCode)
      }

      throw error
    }
  },

  refresh() {
    return apiRequest<AuthResponse>('/auth/refresh', {
      method: 'POST',
    })
  },

  me() {
    return apiRequest<AuthUser>('/auth/me')
  },

  logout() {
    return apiRequest<null>('/auth/logout', {
      method: 'POST',
    })
  },
}