import { type Prisma } from '@prisma/client'

import { BaseContentRepository, buildSoftDeleteUpdate } from '../content-engine'
import { prisma } from '../lib/prisma'

class LessonRepository extends BaseContentRepository<
  Prisma.LessonGetPayload<{
    include: {
      createdBy: { select: { id: true; uuid: true; name: true } }
      updatedBy: { select: { id: true; uuid: true; name: true } }
    }
  }>,
  Prisma.LessonWhereInput,
  Prisma.LessonOrderByWithRelationInput,
  Prisma.LessonCreateInput,
  Prisma.LessonUpdateInput,
  Prisma.LessonUpdateManyMutationInput
> {
  async findById(id: number) {
    return prisma.lesson.findFirst({
      where: { id, deletedAt: null },
      include: {
        createdBy: { select: { id: true, uuid: true, name: true } },
        updatedBy: { select: { id: true, uuid: true, name: true } },
      },
    })
  }

  async findBySlug(slug: string, excludeId?: number) {
    return prisma.lesson.findFirst({
      where: {
        slug,
        deletedAt: null,
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
      select: { id: true, slug: true },
    })
  }

  async findPublicBySlug(slug: string) {
    return prisma.lesson.findFirst({
      where: {
        slug,
        deletedAt: null,
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
    where: Prisma.LessonWhereInput
    orderBy: Prisma.LessonOrderByWithRelationInput
    skip: number
    take: number
  }) {
    const [total, items] = await prisma.$transaction([
      prisma.lesson.count({ where: params.where }),
      prisma.lesson.findMany({
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

  async create(data: Prisma.LessonCreateInput) {
    return prisma.lesson.create({
      data,
      include: {
        createdBy: { select: { id: true, uuid: true, name: true } },
        updatedBy: { select: { id: true, uuid: true, name: true } },
      },
    })
  }

  async update(id: number, data: Prisma.LessonUpdateInput) {
    return prisma.lesson.update({
      where: { id },
      data,
      include: {
        createdBy: { select: { id: true, uuid: true, name: true } },
        updatedBy: { select: { id: true, uuid: true, name: true } },
      },
    })
  }

  async updateMany(ids: number[], data: Prisma.LessonUpdateManyMutationInput) {
    return prisma.lesson.updateMany({
      where: {
        id: { in: ids },
        deletedAt: null,
      },
      data,
    })
  }

  async softDelete(id: number, updatedById?: number) {
    return prisma.lesson.update({
      where: { id },
      data: buildSoftDeleteUpdate(updatedById),
    })
  }
}

export const lessonRepository = new LessonRepository()
