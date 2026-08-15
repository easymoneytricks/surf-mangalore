import { type Prisma } from '@prisma/client'

import { BaseContentRepository, buildSoftDeleteUpdate } from '../content-engine'
import { prisma } from '../lib/prisma'

class MediaRepository extends BaseContentRepository<
  Prisma.MediaGetPayload<{
    include: {
      createdBy: { select: { id: true; uuid: true; name: true } }
      updatedBy: { select: { id: true; uuid: true; name: true } }
      _count: { select: { galleryImages: true } }
    }
  }>,
  Prisma.MediaWhereInput,
  Prisma.MediaOrderByWithRelationInput,
  Prisma.MediaCreateInput,
  Prisma.MediaUpdateInput,
  Prisma.MediaUpdateManyMutationInput
> {
  async findById(id: number) {
    return prisma.media.findFirst({
      where: { id, deletedAt: null },
      include: {
        createdBy: { select: { id: true, uuid: true, name: true } },
        updatedBy: { select: { id: true, uuid: true, name: true } },
        _count: { select: { galleryImages: true } },
      },
    })
  }

  async findBySlug(slug: string, excludeId?: number) {
    return prisma.media.findFirst({
      where: {
        slug,
        deletedAt: null,
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
      select: { id: true, slug: true },
    })
  }

  async listRaw(params: {
    where: Prisma.MediaWhereInput
    orderBy: Prisma.MediaOrderByWithRelationInput
    skip: number
    take: number
  }) {
    const [total, items] = await prisma.$transaction([
      prisma.media.count({ where: params.where }),
      prisma.media.findMany({
        where: params.where,
        orderBy: params.orderBy,
        skip: params.skip,
        take: params.take,
        include: {
          createdBy: { select: { id: true, uuid: true, name: true } },
          updatedBy: { select: { id: true, uuid: true, name: true } },
          _count: { select: { galleryImages: true } },
        },
      }),
    ])

    return { total, items }
  }

  async create(data: Prisma.MediaCreateInput) {
    return prisma.media.create({
      data,
      include: {
        createdBy: { select: { id: true, uuid: true, name: true } },
        updatedBy: { select: { id: true, uuid: true, name: true } },
        _count: { select: { galleryImages: true } },
      },
    })
  }

  async update(id: number, data: Prisma.MediaUpdateInput) {
    return prisma.media.update({
      where: { id },
      data,
      include: {
        createdBy: { select: { id: true, uuid: true, name: true } },
        updatedBy: { select: { id: true, uuid: true, name: true } },
        _count: { select: { galleryImages: true } },
      },
    })
  }

  async updateMany(ids: number[], data: Prisma.MediaUpdateManyMutationInput) {
    return prisma.media.updateMany({
      where: {
        id: { in: ids },
        deletedAt: null,
      },
      data,
    })
  }

  async softDelete(id: number, updatedById?: number) {
    return prisma.media.update({
      where: { id },
      data: buildSoftDeleteUpdate(updatedById),
    })
  }
}

export const mediaRepository = new MediaRepository()
