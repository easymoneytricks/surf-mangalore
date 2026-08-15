import { type Prisma } from '@prisma/client'

import { buildPaginationMeta } from '../content-engine/helpers/pagination.helper'
import { normalizePagination } from '../content-engine/helpers/pagination.helper'
import { auditLogRepository } from '../repositories/audit-log.repository'
import { type AuditLogListQuery, type AuditLogResponse } from '../types/audit-log'

type AuditLogRecord = Awaited<ReturnType<typeof auditLogRepository.findById>>

function toAuditLogResponse(log: NonNullable<AuditLogRecord>): AuditLogResponse {
  return {
    id: log.id,
    uuid: log.uuid,
    action: log.action,
    resourceType: log.resourceType,
    resourceId: log.resourceId,
    description: log.description,
    metadata: (log.metadata as Record<string, unknown> | null) ?? null,
    ipAddress: log.ipAddress,
    userAgent: log.userAgent,
    createdAt: log.createdAt,
    updatedAt: log.updatedAt,
    actor: log.actor
      ? {
          id: log.actor.id,
          uuid: log.actor.uuid,
          name: log.actor.name,
          email: log.actor.email,
        }
      : null,
  }
}

export type RecordAuditLogInput = {
  actorId?: number
  action: string
  resourceType: string
  resourceId?: string | number | null
  description: string
  metadata?: Prisma.InputJsonValue | null
  ipAddress?: string | null
  userAgent?: string | null
}

export const auditLogService = {
  async record(input: RecordAuditLogInput) {
    await auditLogRepository.create({
      actor: input.actorId ? { connect: { id: input.actorId } } : undefined,
      action: input.action,
      resourceType: input.resourceType,
      resourceId: input.resourceId === undefined || input.resourceId === null ? undefined : String(input.resourceId),
      description: input.description,
      metadata: input.metadata ?? undefined,
      ipAddress: input.ipAddress ?? undefined,
      userAgent: input.userAgent ?? undefined,
    })
  },

  async list(query: AuditLogListQuery) {
    const pagination = normalizePagination(query.page, query.pageSize)

    const where: Prisma.AuditLogWhereInput = {}

    if (query.search) {
      where.OR = [
        { action: { contains: query.search, mode: 'insensitive' } },
        { resourceType: { contains: query.search, mode: 'insensitive' } },
        { resourceId: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
        {
          actor: {
            is: {
              OR: [
                { name: { contains: query.search, mode: 'insensitive' } },
                { email: { contains: query.search, mode: 'insensitive' } },
              ],
            },
          },
        },
      ]
    }

    if (query.action) {
      where.action = { contains: query.action, mode: 'insensitive' }
    }

    if (query.resourceType) {
      where.resourceType = { contains: query.resourceType, mode: 'insensitive' }
    }

    if (query.actorId) {
      where.actorId = query.actorId
    }

    if (query.from || query.to) {
      where.createdAt = {
        ...(query.from ? { gte: new Date(query.from) } : {}),
        ...(query.to ? { lte: new Date(query.to) } : {}),
      }
    }

    const result = await auditLogRepository.list({
      where,
      orderBy: { createdAt: 'desc' },
      skip: pagination.skip,
      take: pagination.take,
    })

    return {
      items: result.items.map((item) => toAuditLogResponse(item)),
      pagination: buildPaginationMeta({
        page: pagination.page,
        pageSize: pagination.pageSize,
        totalItems: result.total,
      }),
    }
  },

  async getById(id: number) {
    const log = await auditLogRepository.findById(id)
    if (!log) {
      return null
    }

    return toAuditLogResponse(log)
  },
}