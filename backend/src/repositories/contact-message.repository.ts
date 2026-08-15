import { type ContactMessage, type Prisma } from '@prisma/client'

import { BaseContentRepository } from '../content-engine'
import { prisma } from '../lib/prisma'

class ContactMessageRepository extends BaseContentRepository<
  ContactMessage,
  Prisma.ContactMessageWhereInput,
  Prisma.ContactMessageOrderByWithRelationInput,
  Prisma.ContactMessageCreateInput,
  Prisma.ContactMessageUpdateInput,
  Prisma.ContactMessageUpdateManyMutationInput
> {
  async findById(id: number) {
    return prisma.contactMessage.findFirst({
      where: { id, deletedAt: null },
    })
  }

  async findBySlug(slug: string, excludeId?: number) {
    if (!slug) {
      return null
    }

    const existing = await prisma.contactMessage.findFirst({
      where: {
        slug,
        deletedAt: null,
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
      select: { id: true, slug: true },
    })

    return existing ? { id: existing.id, slug } : null
  }

  async listRaw(params: {
    where: Prisma.ContactMessageWhereInput
    orderBy: Prisma.ContactMessageOrderByWithRelationInput
    skip: number
    take: number
  }) {
    const [total, items] = await prisma.$transaction([
      prisma.contactMessage.count({ where: params.where }),
      prisma.contactMessage.findMany({
        where: params.where,
        orderBy: params.orderBy,
        skip: params.skip,
        take: params.take,
      }),
    ])

    return { total, items }
  }

  async create(data: Prisma.ContactMessageCreateInput) {
    return prisma.contactMessage.create({
      data,
    })
  }

  async update(id: number, data: Prisma.ContactMessageUpdateInput) {
    return prisma.contactMessage.update({
      where: { id },
      data,
    })
  }

  async updateMany(ids: number[], data: Prisma.ContactMessageUpdateManyMutationInput) {
    return prisma.contactMessage.updateMany({
      where: {
        id: { in: ids },
        deletedAt: null,
      },
      data,
    })
  }

  async softDelete(id: number, _updatedById?: number) {
    return prisma.contactMessage.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    })
  }

  async findRecentDuplicate(params: {
    email: string
    subject?: string | null
    message: string
    source?: string | null
    createdAfter: Date
  }) {
    return prisma.contactMessage.findFirst({
      where: {
        deletedAt: null,
        email: { equals: params.email, mode: 'insensitive' },
        subject: params.subject ?? undefined,
        message: params.message,
        source: params.source ?? undefined,
        createdAt: { gte: params.createdAfter },
      },
      select: { id: true, uuid: true, createdAt: true },
    })
  }
}

export const contactMessageRepository = new ContactMessageRepository()
