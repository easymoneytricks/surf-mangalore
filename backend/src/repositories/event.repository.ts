import { type Prisma } from '@prisma/client'

import { BaseContentRepository, buildSoftDeleteUpdate } from '../content-engine'
import { prisma } from '../lib/prisma'

class EventRepository extends BaseContentRepository<
  Prisma.EventGetPayload<{
    include: {
      createdBy: { select: { id: true; uuid: true; name: true } }
      updatedBy: { select: { id: true; uuid: true; name: true } }
    }
  }>,
  Prisma.EventWhereInput,
  Prisma.EventOrderByWithRelationInput,
  Prisma.EventCreateInput,
  Prisma.EventUpdateInput,
  Prisma.EventUpdateManyMutationInput
> {
  async findById(id: number) {
    return prisma.event.findFirst({
      where: { id, deletedAt: null },
      include: {
        createdBy: { select: { id: true, uuid: true, name: true } },
        updatedBy: { select: { id: true, uuid: true, name: true } },
      },
    })
  }

  async findBySlug(slug: string, excludeId?: number) {
    return prisma.event.findFirst({
      where: {
        slug,
        deletedAt: null,
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
      select: { id: true, slug: true },
    })
  }

  async findPublicBySlug(slug: string) {
    return prisma.event.findFirst({
      where: {
        slug,
        deletedAt: null,
        status: 'active',
        publishStatus: 'PUBLISHED',
        visibility: 'PUBLIC',
      },
      include: {
        createdBy: { select: { id: true, uuid: true, name: true } },
        updatedBy: { select: { id: true, uuid: true, name: true } },
      },
    })
  }

  async listRaw(params: {
    where: Prisma.EventWhereInput
    orderBy: Prisma.EventOrderByWithRelationInput
    skip: number
    take: number
  }) {
    const [total, items] = await prisma.$transaction([
      prisma.event.count({ where: params.where }),
      prisma.event.findMany({
        where: params.where,
        orderBy: params.orderBy,
        skip: params.skip,
        take: params.take,
        include: {
          createdBy: { select: { id: true, uuid: true, name: true } },
          updatedBy: { select: { id: true, uuid: true, name: true } },
        },
      }),
    ])

    return { total, items }
  }

  async create(data: Prisma.EventCreateInput) {
    return prisma.event.create({
      data,
      include: {
        createdBy: { select: { id: true, uuid: true, name: true } },
        updatedBy: { select: { id: true, uuid: true, name: true } },
      },
    })
  }

  async update(id: number, data: Prisma.EventUpdateInput) {
    return prisma.event.update({
      where: { id },
      data,
      include: {
        createdBy: { select: { id: true, uuid: true, name: true } },
        updatedBy: { select: { id: true, uuid: true, name: true } },
      },
    })
  }

  async updateMany(ids: number[], data: Prisma.EventUpdateManyMutationInput) {
    return prisma.event.updateMany({
      where: {
        id: { in: ids },
        deletedAt: null,
      },
      data,
    })
  }

  async softDelete(id: number, updatedById?: number) {
    return prisma.event.update({
      where: { id },
      data: buildSoftDeleteUpdate(updatedById),
    })
  }
}

export const eventRepository = new EventRepository()
