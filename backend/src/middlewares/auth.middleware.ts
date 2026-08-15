import { type NextFunction, type Request, type Response } from 'express'

import { verifyAccessToken } from '../lib/jwt'
import { unauthorizedError } from '../utils/auth-errors'

function readBearerToken(req: Request) {
  const header = req.headers.authorization
  if (!header) {
    return null
  }

  const [scheme, token] = header.split(' ')
  if (scheme !== 'Bearer' || !token) {
    return null
  }

  return token
}

export function requireAuthentication(req: Request, _res: Response, next: NextFunction) {
  try {
    const token = readBearerToken(req)
    if (!token) {
      throw unauthorizedError('Missing bearer token')
    }

    const claims = verifyAccessToken(token)
    if (claims.tokenType !== 'access') {
      throw unauthorizedError('Invalid access token')
    }

    const userId = Number(claims.sub)
    if (!Number.isInteger(userId)) {
      throw unauthorizedError('Invalid token subject')
    }

    req.authUser = {
      id: userId,
      sessionId: claims.sid,
      role: claims.role,
    }

    return next()
  } catch {
    return next(unauthorizedError('Invalid or expired access token'))
  }
}
