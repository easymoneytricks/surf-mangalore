import { TokenExpiredError } from 'jsonwebtoken'

import { env } from '../config/env'
import { ROLE_DEFAULT_PERMISSIONS, type UserRole } from '../constants/auth'
import { comparePassword, hashPassword } from '../lib/password'
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../lib/jwt'
import { authRepository } from '../repositories/auth.repository'
import { auditLogService } from './audit-log.service'
import { expiredTokenError, inactiveAccountError, invalidCredentialsError, unauthorizedError } from '../utils/auth-errors'
import { type AuthUserResponse } from '../types/auth'

type AuthRequestMeta = {
  ipAddress?: string
  userAgent?: string
}

type LoginInput = {
  email: string
  password: string
}

function getSessionExpiryDate() {
  return new Date(Date.now() + env.REFRESH_TOKEN_COOKIE_MAX_AGE_MS)
}

function getPermissionSlugs(user: Awaited<ReturnType<typeof authRepository.findAdminById>>) {
  if (!user) {
    return []
  }

  const dbPermissions = user.roles.flatMap((userRole) =>
    userRole.role.permissions.map((entry) => entry.permission.slug),
  )

  const roleDefaults = ROLE_DEFAULT_PERMISSIONS[user.userRole as UserRole] ?? []
  return [...new Set([...dbPermissions, ...roleDefaults])]
}

function toAuthUserResponse(user: NonNullable<Awaited<ReturnType<typeof authRepository.findAdminById>>>) {
  return {
    id: user.id,
    uuid: user.uuid,
    name: user.name,
    email: user.email,
    role: user.userRole as UserRole,
    avatar: user.avatar,
    status: user.status,
    mustChangePassword: user.mustChangePassword,
    permissions: getPermissionSlugs(user),
  } satisfies AuthUserResponse
}

export const authService = {
  async login(input: LoginInput, meta: AuthRequestMeta) {
    const user = await authRepository.findAdminByEmail(input.email)

    if (!user) {
      throw invalidCredentialsError()
    }

    const passwordMatches = await comparePassword(input.password, user.passwordHash)
    if (!passwordMatches) {
      throw invalidCredentialsError()
    }

    if (user.status !== 'active' || user.deletedAt) {
      throw inactiveAccountError()
    }

    const placeholderHash = await hashPassword(`${user.id}-${Date.now()}`)
    const session = await authRepository.createSession({
      adminUserId: user.id,
      refreshTokenHash: placeholderHash,
      expiresAt: getSessionExpiryDate(),
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
    })

    const accessToken = signAccessToken(user.id, session.uuid, user.userRole)
    const refreshToken = signRefreshToken(user.id, session.uuid, user.userRole)
    const refreshTokenHash = await hashPassword(refreshToken)

    await authRepository.rotateSession({
      sessionUuid: session.uuid,
      refreshTokenHash,
      expiresAt: getSessionExpiryDate(),
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
    })

    await authRepository.touchLastLogin(user.id)

    await auditLogService.record({
      actorId: user.id,
      action: 'LOGIN',
      resourceType: 'AUTH_SESSION',
      resourceId: session.uuid,
      description: `${user.name} signed in`,
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
    })

    return {
      accessToken,
      refreshToken,
      user: toAuthUserResponse(user),
    }
  },

  async refresh(refreshToken: string, meta: AuthRequestMeta) {
    if (!refreshToken) {
      throw unauthorizedError('Missing refresh token')
    }

    let claims
    try {
      claims = verifyRefreshToken(refreshToken)
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw expiredTokenError()
      }

      throw unauthorizedError('Invalid refresh token')
    }

    if (claims.tokenType !== 'refresh') {
      throw unauthorizedError('Invalid refresh token')
    }

    const session = await authRepository.findSessionByUuid(claims.sid)
    if (!session) {
      throw unauthorizedError('Session not found')
    }

    if (session.revokedAt || session.deletedAt || session.expiresAt < new Date()) {
      throw unauthorizedError('Session expired or revoked')
    }

    const tokenMatches = await comparePassword(refreshToken, session.refreshTokenHash)
    if (!tokenMatches) {
      throw unauthorizedError('Refresh token mismatch')
    }

    const userId = Number(claims.sub)
    const user = await authRepository.findAdminById(userId)
    if (!user) {
      throw unauthorizedError('User not found')
    }

    if (user.status !== 'active' || user.deletedAt) {
      throw inactiveAccountError()
    }

    const nextAccessToken = signAccessToken(user.id, session.uuid, user.userRole)
    const nextRefreshToken = signRefreshToken(user.id, session.uuid, user.userRole)
    const nextRefreshTokenHash = await hashPassword(nextRefreshToken)

    await authRepository.rotateSession({
      sessionUuid: session.uuid,
      refreshTokenHash: nextRefreshTokenHash,
      expiresAt: getSessionExpiryDate(),
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
    })

    return {
      accessToken: nextAccessToken,
      refreshToken: nextRefreshToken,
      user: toAuthUserResponse(user),
    }
  },

  async logout(refreshToken: string | undefined) {
    if (!refreshToken) {
      return
    }

    try {
      const claims = verifyRefreshToken(refreshToken)
      await authRepository.revokeSession(claims.sid)

      await auditLogService.record({
        actorId: Number(claims.sub),
        action: 'LOGOUT',
        resourceType: 'AUTH_SESSION',
        resourceId: claims.sid,
        description: 'Signed out of admin session',
      })
    } catch {
      return
    }
  },

  async me(userId: number) {
    const user = await authRepository.findAdminById(userId)
    if (!user) {
      throw unauthorizedError('User not found')
    }

    if (user.status !== 'active' || user.deletedAt) {
      throw inactiveAccountError()
    }

    return toAuthUserResponse(user)
  },
}
