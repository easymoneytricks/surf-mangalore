import { Prisma } from '@prisma/client'

import {
  BaseContentService,
  buildQuickFilterWhere,
  buildSearchOrClause,
  buildSorting,
  mergeWhereClauses,
  resolvePublishWorkflow,
  withCreateAudit,
  withUpdateAudit,
  generateUniqueSlug,
} from '../content-engine'
import { HTTP_STATUS } from '../constants/http'
import { testimonialRepository } from '../repositories/testimonial.repository'
import { ApiError } from '../utils/api-error'
import { type TestimonialListQuery, type TestimonialMutationInput } from '../types/testimonial'

type TestimonialListRecord = Awaited<ReturnType<typeof testimonialRepository.listRaw>>['items'][number]
type TestimonialDetailRecord = NonNullable<Awaited<ReturnType<typeof testimonialRepository.findById>>>
type TestimonialRecord = TestimonialListRecord | TestimonialDetailRecord

const baseTestimonialCrudService = new BaseContentService<
  TestimonialRecord,
  Prisma.TestimonialWhereInput,
  Prisma.TestimonialOrderByWithRelationInput,
  Prisma.TestimonialCreateInput,
  Prisma.TestimonialUpdateInput,
  Prisma.TestimonialUpdateManyMutationInput,
  TestimonialListQuery
>({
  repository: testimonialRepository,
  buildListQuery: (query) => {
    const sorting = buildSorting({
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
      allowedFields: ['authorName', 'rating', 'createdAt', 'updatedAt'] as const,
      defaultField: 'createdAt',
      defaultOrder: 'desc',
    })

    const searchWhere = buildSearchOrClause<Prisma.TestimonialWhereInput>(query.search, [
      'authorName',
      'authorEmail',
      'authorLocation',
      'quote',
      'slug',
      'title',
      'description',
    ])

    const quickFilterWhere = buildQuickFilterWhere<Prisma.TestimonialWhereInput>(query.quickFilter, () => {
      if (query.quickFilter === 'draft') {
        return { publishStatus: 'DRAFT' }
      }

      if (query.quickFilter === 'published') {
        return { publishStatus: 'PUBLISHED' }
      }

      return {}
    })

    const where = mergeWhereClauses<Prisma.TestimonialWhereInput>(
      { deletedAt: null },
      searchWhere,
      quickFilterWhere,
      query.status ? { status: query.status } : null,
      query.publishStatus ? { publishStatus: query.publishStatus } : null,
      query.visibility ? { visibility: query.visibility } : null,
      query.featured ? { isFeatured: query.featured === 'true' } : null,
    )

    return {
      where,
      orderBy: {
        [sorting.field]: sorting.order,
      } as Prisma.TestimonialOrderByWithRelationInput,
    }
  },
})

function toTestimonialResponse(testimonial: TestimonialRecord) {
  return {
    id: testimonial.id,
    uuid: testimonial.uuid,
    slug: testimonial.slug,
    authorName: testimonial.authorName,
    authorEmail: testimonial.authorEmail,
    authorLocation: testimonial.authorLocation,
    quote: testimonial.quote,
    rating: testimonial.rating,
    status: testimonial.status,
    publishStatus: testimonial.publishStatus,
    visibility: testimonial.visibility,
    isFeatured: testimonial.isFeatured,
    createdAt: testimonial.createdAt,
    updatedAt: testimonial.updatedAt,
    audit: {
      createdAt: testimonial.createdAt,
      updatedAt: testimonial.updatedAt,
      createdBy: testimonial.createdBy,
      updatedBy: testimonial.updatedBy,
    },
  }
}

function toCreateData(input: TestimonialMutationInput, userId?: number): Prisma.TestimonialCreateInput {
  const publishWorkflow = resolvePublishWorkflow({
    publishStatus: input.publishStatus,
    visibility: input.visibility,
  })

  return {
    name: input.authorName,
    title: input.authorLocation ?? input.authorEmail ?? 'Guest testimonial',
    description: input.quote,
      slug: input.slug ?? '',
    authorName: input.authorName,
    authorEmail: input.authorEmail,
    authorLocation: input.authorLocation,
    quote: input.quote,
    rating: input.rating,
    status: input.status,
    publishStatus: publishWorkflow.publishStatus,
    visibility: publishWorkflow.visibility,
    isFeatured: input.isFeatured,
    ...withCreateAudit({}, userId),
  }
}

async function toUpdateData(input: Partial<TestimonialMutationInput>, userId?: number): Promise<Prisma.TestimonialUpdateInput> {
  const publishWorkflow = resolvePublishWorkflow({
    publishStatus: input.publishStatus,
    visibility: input.visibility,
  })

  const data: Prisma.TestimonialUpdateInput = {
    ...(input.authorName !== undefined ? { name: input.authorName, authorName: input.authorName } : {}),
    ...(input.authorLocation !== undefined ? { title: input.authorLocation, authorLocation: input.authorLocation } : {}),
    ...(input.authorEmail !== undefined ? { authorEmail: input.authorEmail } : {}),
    ...(input.quote !== undefined ? { description: input.quote, quote: input.quote } : {}),
    ...(input.rating !== undefined ? { rating: input.rating } : {}),
    ...(input.slug !== undefined ? { slug: input.slug } : {}),
    ...(input.status !== undefined ? { status: input.status } : {}),
    ...(input.publishStatus !== undefined ? { publishStatus: publishWorkflow.publishStatus } : {}),
    ...(input.visibility !== undefined ? { visibility: publishWorkflow.visibility } : {}),
    ...(input.isFeatured !== undefined ? { isFeatured: input.isFeatured } : {}),
  }

  return withUpdateAudit(data, userId)
}

async function ensureSlugAvailable(slug: string, excludeId?: number) {
  const existing = await testimonialRepository.findBySlug(slug, excludeId)
  if (existing) {
    throw new ApiError(HTTP_STATUS.CONFLICT, 'A testimonial with this slug already exists')
  }
}

export const testimonialService = {
  async list(query: TestimonialListQuery) {
    const result = await baseTestimonialCrudService.list(query)
    return {
      items: result.items.map((item) => toTestimonialResponse(item)),
      pagination: result.pagination,
    }
  },

  async getById(id: number) {
    const testimonial = await baseTestimonialCrudService.getById(id)
    return toTestimonialResponse(testimonial)
  },

  async create(input: TestimonialMutationInput, userId?: number) {
    const slug = input.slug ?? (await generateUniqueSlug(input.authorName, async (candidate) => {
      const existing = await testimonialRepository.findBySlug(candidate)
      return !existing
    }))

    const created = await baseTestimonialCrudService.create({ ...toCreateData({ ...input, slug }, userId) })
    return toTestimonialResponse(created)
  },

  async update(id: number, input: Partial<TestimonialMutationInput>, userId?: number) {
    if (input.slug) {
      await ensureSlugAvailable(input.slug, id)
    }

    const updated = await baseTestimonialCrudService.update(id, await toUpdateData(input, userId))
    return toTestimonialResponse(updated)
  },

  async duplicate(id: number, userId?: number) {
    const source = await baseTestimonialCrudService.getById(id)
    const duplicateSlug = await generateUniqueSlug(`${source.slug}-copy`, async (candidate) => {
      const existing = await testimonialRepository.findBySlug(candidate)
      return !existing
    })

    const created = await baseTestimonialCrudService.create({
      ...toCreateData(
        {
          authorName: source.authorName,
          authorEmail: source.authorEmail ?? undefined,
          authorLocation: source.authorLocation ?? undefined,
          quote: source.quote,
          slug: duplicateSlug,
          rating: source.rating ?? undefined,
          status: 'inactive',
          publishStatus: 'DRAFT',
          visibility: 'PUBLIC',
          isFeatured: false,
        },
        userId,
      ),
    })

    return toTestimonialResponse(created)
  },

  async softDelete(id: number, userId?: number) {
    return baseTestimonialCrudService.remove(id, userId)
  },
}
