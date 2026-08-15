import { type AuthenticatedRequestUser } from './auth'

declare global {
  namespace Express {
    interface Request {
      authUser?: AuthenticatedRequestUser
    }
  }
}

export {}
