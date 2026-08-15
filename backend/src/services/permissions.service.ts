import { type Prisma } from '@prisma/client'

import { buildPaginationMeta } from '../content-engine/helpers/pagination.helper'
import { normalizePagination } from '../content-engine/helpers/pagination.helper'
import { permissionsRepository } from '../repositories/permissions.repository'
import { type PermissionGroupResponse, type PermissionListQuery, type PermissionListResponse, type PermissionSummary } from '../types/permissions'

function toPermissionSummary(permission: Awaited<ReturnType<typeof permissionsRepository.list>>[number], roleCount = 0): PermissionSummary {
  return {
    id: permission.id,
    uuid: permission.uuid,
    slug: permission.slug,
    name: permission.name,
    title: permission.title,
    description: permission.description,
    resource: permission.resource,
    action: permission.action,
    status: permission.status,
    roleCount,
  }
}

function buildWhere(query: PermissionListQuery): Prisma.PermissionWhereInput {
  const where: Prisma.PermissionWhereInput = {
    deletedAt: null,
  }

  if (query.search) {
    where.OR = [
      { name: { contains: query.search, mode: 'insensitive' } },
      { title: { contains: query.search, mode: 'insensitive' } },
      { slug: { contains: query.search, mode: 'insensitive' } },
      { resource: { contains: query.search, mode: 'insensitive' } },
      { action: { contains: query.search, mode: 'insensitive' } },
    ]
  }

  if (query.resource) {
    where.resource = { contains: query.resource, mode: 'insensitive' }
  }

  if (query.action) {
    where.action = { contains: query.action, mode: 'insensitive' }
  }

  return where
}

function groupPermissions(items: PermissionSummary[]): PermissionGroupResponse[] {
  const map = new Map<string, PermissionSummary[]>()

  for (const item of items) {
    const existing = map.get(item.resource) ?? []
    existing.push(item)
    map.set(item.resource, existing)
  }

  return [...map.entries()].map(([resource, permissions]) => ({
    resource,
    title: resource.replaceAll('-', ' ').replace(/\b\w/g, (match) => match.toUpperCase()),
    permissions: permissions.sort((left, right) => left.action.localeCompare(right.action)),
  }))
}

export const permissionsService = {
  async list(query: PermissionListQuery): Promise<PermissionListResponse> {
    const pagination = normalizePagination(query.page, query.pageSize)
    const items = await permissionsRepository.list({
      where: buildWhere(query),
      orderBy: { resource: 'asc' },
    })

    const summaries = await Promise.all(items.map(async (permission) => ({
      ...toPermissionSummary(permission),
      roleCount: await permissionsRepository.countRoles(permission.id),
    })))

    const paginated = summaries.slice((pagination.page - 1) * pagination.take, pagination.page * pagination.take)

    return {
      items: paginated,
      grouped: groupPermissions(summaries),
      pagination: buildPaginationMeta({
        page: pagination.page,
        pageSize: pagination.pageSize,
        totalItems: summaries.length,
      }),
    }
  },

  async getById(id: number) {
    const permission = await permissionsRepository.findById(id)
    if (!permission) {
      return null
    }

    return {
      ...toPermissionSummary(permission),
      roleCount: await permissionsRepository.countRoles(permission.id),
    }
  },
}