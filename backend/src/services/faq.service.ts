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
import { faqRepository } from '../repositories/faq.repository'
import { ApiError } from '../utils/api-error'
import { type FaqListQuery, type FaqMutationInput } from '../types/faq'

type FaqListRecord = Awaited<ReturnType<typeof faqRepository.listRaw>>['items'][number]
type FaqDetailRecord = NonNullable<Awaited<ReturnType<typeof faqRepository.findById>>>
type FaqRecord = FaqListRecord | FaqDetailRecord

const baseFaqCrudService = new BaseContentService<
  FaqRecord,
  Prisma.FAQWhereInput,
  Prisma.FAQOrderByWithRelationInput,
  Prisma.FAQCreateInput,
  Prisma.FAQUpdateInput,
  Prisma.FAQUpdateManyMutationInput,
  FaqListQuery
>({
  repository: faqRepository,
  buildListQuery: (query) => {
    const sorting = buildSorting({
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
      allowedFields: ['question', 'sortOrder', 'createdAt', 'updatedAt'] as const,
      defaultField: 'sortOrder',
      defaultOrder: 'desc',
    })

    const searchWhere = buildSearchOrClause<Prisma.FAQWhereInput>(query.search, ['question', 'answer', 'slug', 'title', 'description'])

    const quickFilterWhere = buildQuickFilterWhere<Prisma.FAQWhereInput>(query.quickFilter, () => {
      if (query.quickFilter === 'draft') {
        return { publishStatus: 'DRAFT' }
      }

      if (query.quickFilter === 'published') {
        return { publishStatus: 'PUBLISHED' }
      }

      return {}
    })

    const where = mergeWhereClauses<Prisma.FAQWhereInput>(
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
      } as Prisma.FAQOrderByWithRelationInput,
    }
  },
})

function toFaqResponse(faq: FaqRecord) {
  return {
    id: faq.id,
    uuid: faq.uuid,
    slug: faq.slug,
    question: faq.question,
    answer: faq.answer,
    status: faq.status,
    publishStatus: faq.publishStatus,
    visibility: faq.visibility,
    isFeatured: faq.isFeatured,
    sortOrder: faq.sortOrder,
    createdAt: faq.createdAt,
    updatedAt: faq.updatedAt,
    audit: {
      createdAt: faq.createdAt,
      updatedAt: faq.updatedAt,
      createdBy: faq.createdBy,
      updatedBy: faq.updatedBy,
    },
  }
}

function toCreateData(input: FaqMutationInput, userId?: number): Prisma.FAQCreateInput {
  const publishWorkflow = resolvePublishWorkflow({
    publishStatus: input.publishStatus,
    visibility: input.visibility,
  })

  return {
    name: input.question,
    title: input.question,
    description: input.answer,
    slug: input.slug ?? '',
    question: input.question,
    answer: input.answer,
    status: input.status,
    publishStatus: publishWorkflow.publishStatus,
    visibility: publishWorkflow.visibility,
    sortOrder: input.sortOrder,
    isFeatured: input.isFeatured,
    ...withCreateAudit({}, userId),
  }
}

async function toUpdateData(input: Partial<FaqMutationInput>, userId?: number): Promise<Prisma.FAQUpdateInput> {
  const publishWorkflow = resolvePublishWorkflow({
    publishStatus: input.publishStatus,
    visibility: input.visibility,
  })

  const data: Prisma.FAQUpdateInput = {
    ...(input.question !== undefined ? { name: input.question, title: input.question, question: input.question } : {}),
    ...(input.answer !== undefined ? { description: input.answer, answer: input.answer } : {}),
    ...(input.slug !== undefined ? { slug: input.slug } : {}),
    ...(input.status !== undefined ? { status: input.status } : {}),
    ...(input.publishStatus !== undefined ? { publishStatus: publishWorkflow.publishStatus } : {}),
    ...(input.visibility !== undefined ? { visibility: publishWorkflow.visibility } : {}),
    ...(input.sortOrder !== undefined ? { sortOrder: input.sortOrder } : {}),
    ...(input.isFeatured !== undefined ? { isFeatured: input.isFeatured } : {}),
  }

  return withUpdateAudit(data, userId)
}

async function ensureSlugAvailable(slug: string, excludeId?: number) {
  const existing = await faqRepository.findBySlug(slug, excludeId)
  if (existing) {
    throw new ApiError(HTTP_STATUS.CONFLICT, 'An FAQ with this slug already exists')
  }
}

export const faqService = {
  async list(query: FaqListQuery) {
    const result = await baseFaqCrudService.list(query)
    return {
      items: result.items.map((item) => toFaqResponse(item)),
      pagination: result.pagination,
    }
  },

  async getById(id: number) {
    const faq = await baseFaqCrudService.getById(id)
    return toFaqResponse(faq)
  },

  async create(input: FaqMutationInput, userId?: number) {
    const slug = input.slug ?? (await generateUniqueSlug(input.question, async (candidate) => {
      const existing = await faqRepository.findBySlug(candidate)
      return !existing
    }))

    const created = await baseFaqCrudService.create({ ...toCreateData({ ...input, slug }, userId) })
    return toFaqResponse(created)
  },

  async update(id: number, input: Partial<FaqMutationInput>, userId?: number) {
    if (input.slug) {
      await ensureSlugAvailable(input.slug, id)
    }

    const updated = await baseFaqCrudService.update(id, await toUpdateData(input, userId))
    return toFaqResponse(updated)
  },

  async duplicate(id: number, userId?: number) {
    const source = await baseFaqCrudService.getById(id)
    const duplicateSlug = await generateUniqueSlug(`${source.slug}-copy`, async (candidate) => {
      const existing = await faqRepository.findBySlug(candidate)
      return !existing
    })

    const created = await baseFaqCrudService.create({
      ...toCreateData(
        {
          question: source.question,
          answer: source.answer,
          slug: duplicateSlug,
          status: 'inactive',
          publishStatus: 'DRAFT',
          visibility: 'PUBLIC',
          sortOrder: source.sortOrder,
          isFeatured: false,
        },
        userId,
      ),
    })

    return toFaqResponse(created)
  },

  async softDelete(id: number, userId?: number) {
    return baseFaqCrudService.remove(id, userId)
  },
}
