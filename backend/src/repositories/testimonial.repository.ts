import { type Prisma } from '@prisma/client'

import { BaseContentRepository, buildSoftDeleteUpdate } from '../content-engine'
import { prisma } from '../lib/prisma'

class TestimonialRepository extends BaseContentRepository<
  Prisma.TestimonialGetPayload<{
    include: {
      createdBy: { select: { id: true; uuid: true; name: true } }
      updatedBy: { select: { id: true; uuid: true; name: true } }
    }
  }>,
  Prisma.TestimonialWhereInput,
  Prisma.TestimonialOrderByWithRelationInput,
  Prisma.TestimonialCreateInput,
  Prisma.TestimonialUpdateInput,
  Prisma.TestimonialUpdateManyMutationInput
> {
  private readonly includeConfig = {
    createdBy: { select: { id: true, uuid: true, name: true } },
    updatedBy: { select: { id: true, uuid: true, name: true } },
  } as const

  async findById(id: number) {
    return prisma.testimonial.findFirst({
      where: { id, deletedAt: null },
      include: this.includeConfig,
    })
  }

  async findBySlug(slug: string, excludeId?: number) {
    return prisma.testimonial.findFirst({
      where: {
        slug,
        deletedAt: null,
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
      select: { id: true, slug: true },
    })
  }

  async listRaw(params: {
    where: Prisma.TestimonialWhereInput
    orderBy: Prisma.TestimonialOrderByWithRelationInput
    skip: number
    take: number
  }) {
    const [total, items] = await prisma.$transaction([
      prisma.testimonial.count({ where: params.where }),
      prisma.testimonial.findMany({
        where: params.where,
        orderBy: params.orderBy,
        skip: params.skip,
        take: params.take,
        include: this.includeConfig,
      }),
    ])

    return { total, items }
  }

  async create(data: Prisma.TestimonialCreateInput) {
    return prisma.testimonial.create({
      data,
      include: this.includeConfig,
    })
  }

  async update(id: number, data: Prisma.TestimonialUpdateInput) {
    return prisma.testimonial.update({
      where: { id },
      data,
      include: this.includeConfig,
    })
  }

  async updateMany(ids: number[], data: Prisma.TestimonialUpdateManyMutationInput) {
    return prisma.testimonial.updateMany({
      where: {
        id: { in: ids },
        deletedAt: null,
      },
      data,
    })
  }

  async softDelete(id: number, updatedById?: number) {
    return prisma.testimonial.update({
      where: { id },
      data: buildSoftDeleteUpdate(updatedById),
    })
  }
}

export const testimonialRepository = new TestimonialRepository()
