import { type UserRole } from '../constants/auth'

export type UserListQuery = {
  page?: number
  pageSize?: number
  search?: string
  role?: UserRole
  status?: string
}

export type UserPatchInput = {
  name?: string
  email?: string
  role?: UserRole
  status?: string
  avatar?: string | null
}

export type UserCreateInput = {
  name: string
  email: string
  password: string
  role: UserRole
  status?: string
  avatar?: string | null
  mustChangePassword?: boolean
}

export type UserResetPasswordInput = {
  password: string
  mustChangePassword?: boolean
}

export type UserResponse = {
  id: number
  uuid: string
  name: string
  email: string
  role: UserRole
  status: string
  avatar: string | null
  lastLogin: Date | null
  createdAt: Date
  updatedAt: Date
  mustChangePassword: boolean
}