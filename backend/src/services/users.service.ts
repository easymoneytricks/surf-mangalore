import { randomBytes } from 'node:crypto'

import { type Prisma } from '@prisma/client'

import { buildPaginationMeta } from '../content-engine/helpers/pagination.helper'
import { normalizePagination } from '../content-engine/helpers/pagination.helper'
import { generateUniqueSlug } from '../content-engine/helpers/slug-generator.helper'
import { HTTP_STATUS } from '../constants/http'
import { type UserRole } from '../constants/auth'
import { hashPassword } from '../lib/password'
import { usersRepository } from '../repositories/users.repository'
import { rolesRepository } from '../repositories/roles.repository'
import { auditLogService } from './audit-log.service'
import { ApiError } from '../utils/api-error'
import { prisma } from '../lib/prisma'
import { type UserCreateInput, type UserListQuery, type UserPatchInput, type UserResetPasswordInput, type UserResponse } from '../types/users'

function toUserResponse(user: Awaited<ReturnType<typeof usersRepository.findById>> extends infer T ? NonNullable<T> : never): UserResponse {
  return {
    id: user.id,
    uuid: user.uuid,
    name: user.name,
    email: user.email,
    role: user.userRole as UserRole,
    status: user.status,
    avatar: user.avatar,
    lastLogin: user.lastLoginAt,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    mustChangePassword: user.mustChangePassword,
  }
}

function roleSlugFromEnum(role: UserRole) {
  return role.toLowerCase().replaceAll('_', '-')
}

function generateTemporaryPassword() {
  return randomBytes(6).toString('base64url')
}

function buildWhere(query: UserListQuery): Prisma.AdminUserWhereInput {
  const where: Prisma.AdminUserWhereInput = {
    deletedAt: null,
  }

  if (query.search) {
    where.OR = [
      { name: { contains: query.search, mode: 'insensitive' } },
      { email: { contains: query.search, mode: 'insensitive' } },
    ]
  }

  if (query.role) {
    where.userRole = query.role
  }

  if (query.status) {
    where.status = query.status
  }

  return where
}

async function ensureUser(id: number) {
  const user = await usersRepository.findById(id)
  if (!user) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'User not found')
  }

  return user
}

async function ensureRoleMapping(role: UserRole) {
  const roleEntity = await rolesRepository.findBySlug(roleSlugFromEnum(role))
  return roleEntity?.id ?? null
}

async function countActiveSuperAdmins() {
  return prisma.adminUser.count({
    where: {
      deletedAt: null,
      status: 'active',
      userRole: 'SUPER_ADMIN',
    },
  })
}

export const usersService = {
  async list(query: UserListQuery) {
    const pagination = normalizePagination(query.page, query.pageSize)
    const result = await usersRepository.list({
      where: buildWhere(query),
      orderBy: { createdAt: 'desc' },
      skip: pagination.skip,
      take: pagination.take,
    })

    return {
      items: result.items.map((user) => toUserResponse(user)),
      pagination: buildPaginationMeta({
        page: pagination.page,
        pageSize: pagination.pageSize,
        totalItems: result.total,
      }),
    }
  },

  async getById(id: number) {
    const user = await ensureUser(id)
    return toUserResponse(user)
  },

  async create(input: UserCreateInput, actorId?: number) {
    const emailExists = await usersRepository.findByEmail(input.email)
    if (emailExists) {
      throw new ApiError(HTTP_STATUS.CONFLICT, 'Email is already in use')
    }

    const passwordHash = await hashPassword(input.password)
    const slug = await generateUniqueSlug(`${input.name}-${input.email}`, async (candidate: string) => !(await usersRepository.findBySlug(candidate)))

    const created = await usersRepository.create({
      slug,
      name: input.name,
      email: input.email.toLowerCase(),
      passwordHash,
      status: input.status ?? 'active',
      userRole: input.role,
      mustChangePassword: input.mustChangePassword ?? true,
      avatar: input.avatar ?? null,
    })

    const roleId = await ensureRoleMapping(input.role)
    if (roleId) {
      await usersRepository.replacePrimaryRole(created.id, roleId)
    }

    await auditLogService.record({
      actorId,
      action: 'CREATE',
      resourceType: 'USER',
      resourceId: created.id,
      description: `Created admin user ${created.name}`,
      metadata: { role: input.role, status: input.status ?? 'active' },
    })

    return toUserResponse(created)
  },

  async patch(id: number, input: UserPatchInput, actorId?: number) {
    const existing = await ensureUser(id)

    if (input.email && input.email.toLowerCase() !== existing.email.toLowerCase()) {
      const emailOwner = await usersRepository.findByEmail(input.email)
      if (emailOwner && emailOwner.id !== id) {
        throw new ApiError(HTTP_STATUS.CONFLICT, 'Email is already in use')
      }
    }

    if (input.status === 'inactive' && existing.userRole === 'SUPER_ADMIN') {
      const superAdminCount = await countActiveSuperAdmins()
      if (superAdminCount <= 1) {
        throw new ApiError(HTTP_STATUS.CONFLICT, 'Cannot deactivate the last SUPER_ADMIN account')
      }
    }

    const updated = await usersRepository.update(id, {
      ...(input.name !== undefined ? { name: input.name } : {}),
      ...(input.email !== undefined ? { email: input.email.toLowerCase() } : {}),
      ...(input.role !== undefined ? { userRole: input.role } : {}),
      ...(input.status !== undefined ? { status: input.status } : {}),
      ...(input.avatar !== undefined ? { avatar: input.avatar || null } : {}),
    })

    if (input.role !== undefined) {
      const roleId = await ensureRoleMapping(input.role)
      if (roleId) {
        await usersRepository.replacePrimaryRole(id, roleId)
      }
    }

    await auditLogService.record({
      actorId,
      action: 'UPDATE',
      resourceType: 'USER',
      resourceId: updated.id,
      description: `Updated admin user ${updated.name}`,
      metadata: input,
    })

    return toUserResponse(updated)
  },

  async resetPassword(id: number, input: UserResetPasswordInput, actorId?: number) {
    const existing = await ensureUser(id)
    const nextPassword = input.password || generateTemporaryPassword()
    const passwordHash = await hashPassword(nextPassword)

    await usersRepository.updatePassword(id, passwordHash, input.mustChangePassword ?? true)

    await auditLogService.record({
      actorId,
      action: 'UPDATE',
      resourceType: 'USER_PASSWORD',
      resourceId: existing.id,
      description: `Reset password for ${existing.name}`,
    })

    return {
      temporaryPassword: nextPassword,
    }
  },

  async changePassword(id: number, input: UserResetPasswordInput, actorId?: number) {
    const existing = await ensureUser(id)
    const passwordHash = await hashPassword(input.password)

    const updated = await usersRepository.updatePassword(id, passwordHash, input.mustChangePassword ?? false)

    await auditLogService.record({
      actorId,
      action: 'UPDATE',
      resourceType: 'USER_PASSWORD',
      resourceId: existing.id,
      description: `Changed password for ${existing.name}`,
    })

    return toUserResponse(updated)
  },

  async softDelete(id: number, actorId?: number, currentUserId?: number) {
    const existing = await ensureUser(id)

    if (currentUserId && currentUserId === id) {
      throw new ApiError(HTTP_STATUS.FORBIDDEN, 'You cannot delete the currently authenticated administrator')
    }

    if (existing.userRole === 'SUPER_ADMIN') {
      const superAdminCount = await countActiveSuperAdmins()
      if (superAdminCount <= 1) {
        throw new ApiError(HTTP_STATUS.CONFLICT, 'Cannot delete the last SUPER_ADMIN account')
      }
    }

    await usersRepository.softDelete(id)

    await auditLogService.record({
      actorId,
      action: 'DELETE',
      resourceType: 'USER',
      resourceId: existing.id,
      description: `Deleted admin user ${existing.name}`,
    })
  },
}