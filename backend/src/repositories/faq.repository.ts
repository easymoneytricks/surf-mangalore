import { type Prisma } from '@prisma/client'

import { BaseContentRepository, buildSoftDeleteUpdate } from '../content-engine'
import { prisma } from '../lib/prisma'

class FAQRepository extends BaseContentRepository<
  Prisma.FAQGetPayload<{
    include: {
      createdBy: { select: { id: true; uuid: true; name: true } }
      updatedBy: { select: { id: true; uuid: true; name: true } }
    }
  }>,
  Prisma.FAQWhereInput,
  Prisma.FAQOrderByWithRelationInput,
  Prisma.FAQCreateInput,
  Prisma.FAQUpdateInput,
  Prisma.FAQUpdateManyMutationInput
> {
  private readonly includeConfig = {
    createdBy: { select: { id: true, uuid: true, name: true } },
    updatedBy: { select: { id: true, uuid: true, name: true } },
  } as const

  async findById(id: number) {
    return prisma.fAQ.findFirst({
      where: { id, deletedAt: null },
      include: this.includeConfig,
    })
  }

  async findBySlug(slug: string, excludeId?: number) {
    return prisma.fAQ.findFirst({
      where: {
        slug,
        deletedAt: null,
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
      select: { id: true, slug: true },
    })
  }

  async listRaw(params: {
    where: Prisma.FAQWhereInput
    orderBy: Prisma.FAQOrderByWithRelationInput
    skip: number
    take: number
  }) {
    const [total, items] = await prisma.$transaction([
      prisma.fAQ.count({ where: params.where }),
      prisma.fAQ.findMany({
        where: params.where,
        orderBy: params.orderBy,
        skip: params.skip,
        take: params.take,
        include: this.includeConfig,
      }),
    ])

    return { total, items }
  }

  async create(data: Prisma.FAQCreateInput) {
    return prisma.fAQ.create({
      data,
      include: this.includeConfig,
    })
  }

  async update(id: number, data: Prisma.FAQUpdateInput) {
    return prisma.fAQ.update({
      where: { id },
      data,
      include: this.includeConfig,
    })
  }

  async updateMany(ids: number[], data: Prisma.FAQUpdateManyMutationInput) {
    return prisma.fAQ.updateMany({
      where: {
        id: { in: ids },
        deletedAt: null,
      },
      data,
    })
  }

  async softDelete(id: number, updatedById?: number) {
    return prisma.fAQ.update({
      where: { id },
      data: buildSoftDeleteUpdate(updatedById),
    })
  }
}

export const faqRepository = new FAQRepository()
