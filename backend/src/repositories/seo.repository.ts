import { type Prisma } from '@prisma/client'

import { BaseContentRepository, buildSoftDeleteUpdate } from '../content-engine'
import { prisma } from '../lib/prisma'

class SeoRepository extends BaseContentRepository<
  Prisma.SEOPageGetPayload<{
    include: {
      createdBy: { select: { id: true; uuid: true; name: true } }
      updatedBy: { select: { id: true; uuid: true; name: true } }
      lesson: { select: { id: true; title: true; slug: true } }
      experience: { select: { id: true; title: true; slug: true } }
      event: { select: { id: true; title: true; slug: true } }
    }
  }>,
  Prisma.SEOPageWhereInput,
  Prisma.SEOPageOrderByWithRelationInput,
  Prisma.SEOPageCreateInput,
  Prisma.SEOPageUpdateInput,
  Prisma.SEOPageUpdateManyMutationInput
> {
  async findById(id: number) {
    return prisma.sEOPage.findFirst({
      where: { id, deletedAt: null },
      include: {
        createdBy: { select: { id: true, uuid: true, name: true } },
        updatedBy: { select: { id: true, uuid: true, name: true } },
        lesson: { select: { id: true, title: true, slug: true } },
        experience: { select: { id: true, title: true, slug: true } },
        event: { select: { id: true, title: true, slug: true } },
      },
    })
  }

  async findBySlug(slug: string, excludeId?: number) {
    return prisma.sEOPage.findFirst({
      where: {
        slug,
        deletedAt: null,
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
      select: { id: true, slug: true },
    })
  }

  async findByRoutePath(routePath: string, localeCode?: string, excludeId?: number) {
    return prisma.sEOPage.findFirst({
      where: {
        routePath,
        localeCode: localeCode ?? undefined,
        deletedAt: null,
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
      select: { id: true, routePath: true, localeCode: true },
    })
  }

  async listRaw(params: {
    where: Prisma.SEOPageWhereInput
    orderBy: Prisma.SEOPageOrderByWithRelationInput
    skip: number
    take: number
  }) {
    const [total, items] = await prisma.$transaction([
      prisma.sEOPage.count({ where: params.where }),
      prisma.sEOPage.findMany({
        where: params.where,
        orderBy: params.orderBy,
        skip: params.skip,
        take: params.take,
        include: {
          createdBy: { select: { id: true, uuid: true, name: true } },
          updatedBy: { select: { id: true, uuid: true, name: true } },
          lesson: { select: { id: true, title: true, slug: true } },
          experience: { select: { id: true, title: true, slug: true } },
          event: { select: { id: true, title: true, slug: true } },
        },
      }),
    ])

    return { total, items }
  }

  async create(data: Prisma.SEOPageCreateInput) {
    return prisma.sEOPage.create({
      data,
      include: {
        createdBy: { select: { id: true, uuid: true, name: true } },
        updatedBy: { select: { id: true, uuid: true, name: true } },
        lesson: { select: { id: true, title: true, slug: true } },
        experience: { select: { id: true, title: true, slug: true } },
        event: { select: { id: true, title: true, slug: true } },
      },
    })
  }

  async update(id: number, data: Prisma.SEOPageUpdateInput) {
    return prisma.sEOPage.update({
      where: { id },
      data,
      include: {
        createdBy: { select: { id: true, uuid: true, name: true } },
        updatedBy: { select: { id: true, uuid: true, name: true } },
        lesson: { select: { id: true, title: true, slug: true } },
        experience: { select: { id: true, title: true, slug: true } },
        event: { select: { id: true, title: true, slug: true } },
      },
    })
  }

  async updateMany(ids: number[], data: Prisma.SEOPageUpdateManyMutationInput) {
    return prisma.sEOPage.updateMany({
      where: {
        id: { in: ids },
        deletedAt: null,
      },
      data,
    })
  }

  async softDelete(id: number, updatedById?: number) {
    return prisma.sEOPage.update({
      where: { id },
      data: buildSoftDeleteUpdate(updatedById),
    })
  }

  async findPublicByPath(routePath: string, localeCode?: string) {
    return prisma.sEOPage.findFirst({
      where: {
        routePath,
        localeCode: localeCode ?? undefined,
        status: 'active',
        publishStatus: 'PUBLISHED',
        visibility: 'PUBLIC',
        deletedAt: null,
      },
      orderBy: { updatedAt: 'desc' },
      include: {
        createdBy: { select: { id: true, uuid: true, name: true } },
        updatedBy: { select: { id: true, uuid: true, name: true } },
        lesson: { select: { id: true, title: true, slug: true } },
        experience: { select: { id: true, title: true, slug: true } },
        event: { select: { id: true, title: true, slug: true } },
      },
    })
  }
}

export const seoRepository = new SeoRepository()
