import { type Prisma } from '@prisma/client'

import { BaseContentRepository, buildSoftDeleteUpdate } from '../content-engine'
import { prisma } from '../lib/prisma'

class CoachRepository extends BaseContentRepository<
  Prisma.CoachGetPayload<{
    include: {
      createdBy: { select: { id: true; uuid: true; name: true } }
      updatedBy: { select: { id: true; uuid: true; name: true } }
    }
  }>,
  Prisma.CoachWhereInput,
  Prisma.CoachOrderByWithRelationInput,
  Prisma.CoachCreateInput,
  Prisma.CoachUpdateInput,
  Prisma.CoachUpdateManyMutationInput
> {
  private readonly includeConfig = {
    createdBy: { select: { id: true, uuid: true, name: true } },
    updatedBy: { select: { id: true, uuid: true, name: true } },
  } as const

  async findById(id: number) {
    return prisma.coach.findFirst({
      where: { id, deletedAt: null },
      include: this.includeConfig,
    })
  }

  async findPublicBySlug(slug: string) {
    return prisma.coach.findFirst({
      where: {
        slug,
        deletedAt: null,
        status: 'active',
        publishStatus: 'PUBLISHED',
        visibility: 'PUBLIC',
      },
      include: this.includeConfig,
    })
  }

  async findBySlug(slug: string, excludeId?: number) {
    return prisma.coach.findFirst({
      where: {
        slug,
        deletedAt: null,
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
      select: { id: true, slug: true },
    })
  }

  async listRaw(params: {
    where: Prisma.CoachWhereInput
    orderBy: Prisma.CoachOrderByWithRelationInput
    skip: number
    take: number
  }) {
    const [total, items] = await prisma.$transaction([
      prisma.coach.count({ where: params.where }),
      prisma.coach.findMany({
        where: params.where,
        orderBy: params.orderBy,
        skip: params.skip,
        take: params.take,
        include: this.includeConfig,
      }),
    ])

    return { total, items }
  }

  async create(data: Prisma.CoachCreateInput) {
    return prisma.coach.create({
      data,
      include: this.includeConfig,
    })
  }

  async update(id: number, data: Prisma.CoachUpdateInput) {
    return prisma.coach.update({
      where: { id },
      data,
      include: this.includeConfig,
    })
  }

  async updateMany(ids: number[], data: Prisma.CoachUpdateManyMutationInput) {
    return prisma.coach.updateMany({
      where: {
        id: { in: ids },
        deletedAt: null,
      },
      data,
    })
  }

  async softDelete(id: number, updatedById?: number) {
    return prisma.coach.update({
      where: { id },
      data: buildSoftDeleteUpdate(updatedById),
    })
  }
}

export const coachRepository = new CoachRepository()
