import { type Prisma } from '@prisma/client'

import { buildPaginationMeta } from '../content-engine/helpers/pagination.helper'
import { normalizePagination } from '../content-engine/helpers/pagination.helper'
import { generateUniqueSlug } from '../content-engine/helpers/slug-generator.helper'
import { HTTP_STATUS } from '../constants/http'
import { rolesRepository } from '../repositories/roles.repository'
import { permissionsRepository } from '../repositories/permissions.repository'
import { auditLogService } from './audit-log.service'
import { ApiError } from '../utils/api-error'
import { type RoleCreateInput, type RoleListQuery, type RolePermissionUpdateInput, type RoleResponse, type RoleUpdateInput } from '../types/roles'

type RoleRecord = Awaited<ReturnType<typeof rolesRepository.findById>>

function toRoleResponse(role: NonNullable<RoleRecord>, userCount = 0, permissionCount = 0): RoleResponse {
  return {
    id: role.id,
    uuid: role.uuid,
    slug: role.slug,
    name: role.name,
    title: role.title,
    description: role.description,
    status: role.status,
    isSystem: role.isSystem,
    userCount,
    permissionCount,
    permissions: role.permissions.map((entry) => ({
      id: entry.permission.id,
      uuid: entry.permission.uuid,
      slug: entry.permission.slug,
      resource: entry.permission.resource,
      action: entry.permission.action,
      title: entry.permission.title,
    })),
    createdAt: role.createdAt,
    updatedAt: role.updatedAt,
  }
}

function buildWhere(query: RoleListQuery): Prisma.RoleWhereInput {
  const where: Prisma.RoleWhereInput = {
    deletedAt: null,
  }

  if (query.search) {
    where.OR = [
      { name: { contains: query.search, mode: 'insensitive' } },
      { title: { contains: query.search, mode: 'insensitive' } },
      { slug: { contains: query.search, mode: 'insensitive' } },
    ]
  }

  if (query.status) {
    where.status = query.status
  }

  return where
}

async function ensureRole(id: number) {
  const role = await rolesRepository.findById(id)
  if (!role) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Role not found')
  }

  return role
}

async function ensurePermissionIds(permissionIds: number[]) {
  if (!permissionIds.length) {
    return []
  }

  const permissions = await Promise.all(permissionIds.map((id) => permissionsRepository.findById(id)))
  const validIds = permissions.filter(Boolean).map((permission) => permission!.id)

  if (validIds.length !== permissionIds.length) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'One or more permissions are invalid')
  }

  return validIds
}

export const rolesService = {
  async list(query: RoleListQuery) {
    const pagination = normalizePagination(query.page, query.pageSize)
    const result = await rolesRepository.list({
      where: buildWhere(query),
      orderBy: { createdAt: 'desc' },
      skip: pagination.skip,
      take: pagination.take,
    })

    const items = await Promise.all(result.items.map(async (role) => {
      const userCount = await rolesRepository.countUsers(role.id)
      const permissionCount = await rolesRepository.countPermissions(role.id)
      return toRoleResponse(role, userCount, permissionCount)
    }))

    return {
      items,
      pagination: buildPaginationMeta({
        page: pagination.page,
        pageSize: pagination.pageSize,
        totalItems: result.total,
      }),
    }
  },

  async getById(id: number) {
    const role = await ensureRole(id)
    return toRoleResponse(role, await rolesRepository.countUsers(role.id), await rolesRepository.countPermissions(role.id))
  },

  async create(input: RoleCreateInput, actorId?: number) {
    const slug = await generateUniqueSlug(input.name, async (candidate: string) => !(await rolesRepository.findBySlug(candidate)))

    const role = await rolesRepository.create({
      slug,
      name: input.name,
      title: input.title,
      description: input.description ?? null,
      status: input.status ?? 'active',
      isSystem: input.isSystem ?? false,
    })

    const permissionIds = await ensurePermissionIds(input.permissionIds ?? [])
    if (permissionIds.length) {
      await rolesRepository.replacePermissions(role.id, permissionIds)
    }

    await auditLogService.record({
      actorId,
      action: 'CREATE',
      resourceType: 'ROLE',
      resourceId: role.id,
      description: `Created role ${role.title}`,
      metadata: { slug: role.slug, permissionIds },
    })

    return this.getById(role.id)
  },

  async update(id: number, input: RoleUpdateInput, actorId?: number) {
    const existing = await ensureRole(id)

    if (existing.isSystem && existing.slug === 'super-admin' && input.permissionIds) {
      throw new ApiError(HTTP_STATUS.FORBIDDEN, 'The SUPER_ADMIN role permissions are protected')
    }

    if (input.name && input.name !== existing.name) {
      const nextSlug = await generateUniqueSlug(input.name, async (candidate: string) => !(await rolesRepository.findBySlug(candidate)))

      await rolesRepository.update(id, {
        name: input.name,
        slug: nextSlug,
        title: input.title,
        description: input.description,
        status: input.status,
        isSystem: input.isSystem,
      })
    } else {
      await rolesRepository.update(id, {
        title: input.title,
        description: input.description,
        status: input.status,
        isSystem: input.isSystem,
      })
    }

    if (input.permissionIds) {
      const permissionIds = await ensurePermissionIds(input.permissionIds)
      await rolesRepository.replacePermissions(id, permissionIds)
    }

    await auditLogService.record({
      actorId,
      action: 'UPDATE',
      resourceType: 'ROLE',
      resourceId: id,
      description: `Updated role ${existing.title}`,
      metadata: input,
    })

    return this.getById(id)
  },

  async delete(id: number, actorId?: number) {
    const existing = await ensureRole(id)
    const userCount = await rolesRepository.countUsers(id)

    if (existing.isSystem || userCount > 0) {
      throw new ApiError(HTTP_STATUS.CONFLICT, 'Role is protected or still assigned to users')
    }

    await rolesRepository.softDelete(id)

    await auditLogService.record({
      actorId,
      action: 'DELETE',
      resourceType: 'ROLE',
      resourceId: id,
      description: `Deleted role ${existing.title}`,
    })
  },

  async updatePermissions(id: number, input: RolePermissionUpdateInput, actorId?: number) {
    const existing = await ensureRole(id)

    if (existing.isSystem && existing.slug === 'super-admin') {
      throw new ApiError(HTTP_STATUS.FORBIDDEN, 'The SUPER_ADMIN role permissions are protected')
    }

    const permissionIds = await ensurePermissionIds(input.permissionIds)
    await rolesRepository.replacePermissions(id, permissionIds)

    await auditLogService.record({
      actorId,
      action: 'UPDATE',
      resourceType: 'ROLE_PERMISSIONS',
      resourceId: id,
      description: `Updated permissions for role ${existing.title}`,
      metadata: { permissionIds },
    })

    return this.getById(id)
  },
}