import { randomUUID } from 'node:crypto'

import jwt from 'jsonwebtoken'
import { type UserRole } from '@prisma/client'

import { env } from '../config/env'

type TokenType = 'access' | 'refresh'

export type AccessTokenClaims = {
  sub: string
  sid: string
  role: UserRole
  tokenType: 'access'
}

export type RefreshTokenClaims = {
  sub: string
  sid: string
  role: UserRole
  tokenType: 'refresh'
}

function getSecret(type: TokenType) {
  return type === 'access' ? env.JWT_ACCESS_SECRET : env.JWT_REFRESH_SECRET
}

function getExpiry(type: TokenType) {
  return type === 'access' ? env.JWT_ACCESS_EXPIRES_IN : env.JWT_REFRESH_EXPIRES_IN
}

function signToken(payload: object, type: TokenType, subject: string) {
  const expiresIn = getExpiry(type) as jwt.SignOptions['expiresIn']

  return jwt.sign(payload, getSecret(type), {
    expiresIn,
    issuer: env.JWT_ISSUER,
    audience: env.JWT_AUDIENCE,
    subject,
    jwtid: randomUUID(),
  })
}

function verifyToken<T>(token: string, type: TokenType) {
  return jwt.verify(token, getSecret(type)) as T
}

export function signAccessToken(userId: number, sessionId: string, role: UserRole) {
  return signToken(
    {
      sid: sessionId,
      role,
      tokenType: 'access',
    },
    'access',
    String(userId),
  )
}

export function signRefreshToken(userId: number, sessionId: string, role: UserRole) {
  return signToken(
    {
      sid: sessionId,
      role,
      tokenType: 'refresh',
    },
    'refresh',
    String(userId),
  )
}

export function verifyAccessToken(token: string) {
  return verifyToken<AccessTokenClaims>(token, 'access')
}

export function verifyRefreshToken(token: string) {
  return verifyToken<RefreshTokenClaims>(token, 'refresh')
}
