import { type Prisma } from '@prisma/client'

import { prisma } from '../lib/prisma'

export const auditLogRepository = {
  create(data: Prisma.AuditLogCreateInput) {
    return prisma.auditLog.create({
      data,
    })
  },

  findById(id: number) {
    return prisma.auditLog.findFirst({
      where: { id },
      include: {
        actor: true,
      },
    })
  },

  list(params: {
    where: Prisma.AuditLogWhereInput
    orderBy: Prisma.AuditLogOrderByWithRelationInput
    skip: number
    take: number
  }) {
    return prisma.$transaction(async (tx) => {
      const [items, total] = await Promise.all([
        tx.auditLog.findMany({
          where: params.where,
          orderBy: params.orderBy,
          skip: params.skip,
          take: params.take,
          include: {
            actor: true,
          },
        }),
        tx.auditLog.count({ where: params.where }),
      ])

      return { items, total }
    })
  },
}