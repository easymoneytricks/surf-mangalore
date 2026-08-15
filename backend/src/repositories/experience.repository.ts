import { type Prisma } from '@prisma/client'

import { BaseContentRepository, buildSoftDeleteUpdate } from '../content-engine'
import { prisma } from '../lib/prisma'

class ExperienceRepository extends BaseContentRepository<
  Prisma.ExperienceGetPayload<{
    include: {
      createdBy: { select: { id: true; uuid: true; name: true } }
      updatedBy: { select: { id: true; uuid: true; name: true } }
      lessons: { select: { id: true; uuid: true; title: true; slug: true; difficulty: true; publishStatus: true } }
    }
  }>,
  Prisma.ExperienceWhereInput,
  Prisma.ExperienceOrderByWithRelationInput,
  Prisma.ExperienceCreateInput,
  Prisma.ExperienceUpdateInput,
  Prisma.ExperienceUpdateManyMutationInput
> {
  private readonly includeConfig = {
    createdBy: { select: { id: true, uuid: true, name: true } },
    updatedBy: { select: { id: true, uuid: true, name: true } },
    lessons: { select: { id: true, uuid: true, title: true, slug: true, difficulty: true, publishStatus: true } },
  } as const

  async findById(id: number) {
    return prisma.experience.findFirst({
      where: { id, deletedAt: null },
      include: this.includeConfig,
    })
  }

  async findBySlug(slug: string, excludeId?: number) {
    return prisma.experience.findFirst({
      where: {
        slug,
        deletedAt: null,
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
      select: { id: true, slug: true },
    })
  }

  async findPublicBySlug(slug: string) {
    return prisma.experience.findFirst({
      where: {
        slug,
        deletedAt: null,
        publishStatus: 'PUBLISHED',
        visibility: 'PUBLIC',
        status: 'active',
      },
      include: this.includeConfig,
    })
  }

  async listRaw(params: {
    where: Prisma.ExperienceWhereInput
    orderBy: Prisma.ExperienceOrderByWithRelationInput
    skip: number
    take: number
  }) {
    const [total, items] = await prisma.$transaction([
      prisma.experience.count({ where: params.where }),
      prisma.experience.findMany({
        where: params.where,
        orderBy: params.orderBy,
        skip: params.skip,
        take: params.take,
        include: this.includeConfig,
      }),
    ])

    return { total, items }
  }

  async create(data: Prisma.ExperienceCreateInput) {
    return prisma.experience.create({
      data,
      include: this.includeConfig,
    })
  }

  async update(id: number, data: Prisma.ExperienceUpdateInput) {
    return prisma.experience.update({
      where: { id },
      data,
      include: this.includeConfig,
    })
  }

  async updateMany(ids: number[], data: Prisma.ExperienceUpdateManyMutationInput) {
    return prisma.experience.updateMany({
      where: {
        id: { in: ids },
        deletedAt: null,
      },
      data,
    })
  }

  async softDelete(id: number, updatedById?: number) {
    return prisma.experience.update({
      where: { id },
      data: buildSoftDeleteUpdate(updatedById),
    })
  }

  async syncLessons(experienceId: number, linkedLessonIds: number[]) {
    await prisma.$transaction([
      prisma.lesson.updateMany({
        where: {
          experienceId,
          ...(linkedLessonIds.length ? { id: { notIn: linkedLessonIds } } : {}),
        },
        data: {
          experienceId: null,
        },
      }),
      ...(linkedLessonIds.length
        ? [
            prisma.lesson.updateMany({
              where: {
                id: { in: linkedLessonIds },
                deletedAt: null,
              },
              data: {
                experienceId,
              },
            }),
          ]
        : []),
      prisma.experience.update({
        where: { id: experienceId },
        data: { linkedLessonsCount: linkedLessonIds.length },
      }),
    ])
  }
}

export const experienceRepository = new ExperienceRepository()
