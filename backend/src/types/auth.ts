import { type UserRole } from '../constants/auth'

export type AuthenticatedRequestUser = {
  id: number
  sessionId: string
  role: UserRole
}

export type AuthUserResponse = {
  id: number
  uuid: string
  name: string
  email: string
  role: UserRole
  avatar: string | null
  status: string
  mustChangePassword: boolean
  permissions: string[]
}
