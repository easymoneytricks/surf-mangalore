import { Prisma } from '@prisma/client'

import {
  BaseContentService,
  buildQuickFilterWhere,
  buildSearchOrClause,
  buildSorting,
  generateUniqueSlug,
  mergeWhereClauses,
  resolvePublishWorkflow,
  withCreateAudit,
  withUpdateAudit,
} from '../content-engine'
import { HTTP_STATUS } from '../constants/http'
import { seoRepository } from '../repositories/seo.repository'
import { type SeoListQuery, type SeoMutationInput } from '../types/seo'
import { ApiError } from '../utils/api-error'

type SeoListRecord = Awaited<ReturnType<typeof seoRepository.listRaw>>['items'][number]
type SeoDetailRecord = NonNullable<Awaited<ReturnType<typeof seoRepository.findById>>>
type SeoRecord = SeoListRecord | SeoDetailRecord

function normalizeRoutePath(path: string) {
  const trimmed = path.trim()
  if (!trimmed) {
    return '/'
  }

  const withLeadingSlash = trimmed.startsWith('/') ? trimmed : `/${trimmed}`
  return withLeadingSlash.length > 1 && withLeadingSlash.endsWith('/')
    ? withLeadingSlash.slice(0, -1)
    : withLeadingSlash
}

function normalizeCanonicalUrl(value?: string) {
  if (!value) {
    return undefined
  }

  const trimmed = value.trim()
  if (!trimmed) {
    return undefined
  }

  if (!/^https?:\/\//i.test(trimmed)) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Canonical URL must be an absolute URL')
  }

  return trimmed
}

function normalizeKeywords(values: string[]) {
  return values.map((item) => item.trim()).filter(Boolean)
}

function toSeoResponse(item: SeoRecord) {
  return {
    id: item.id,
    uuid: item.uuid,
    slug: item.slug,
    name: item.name,
    title: item.title,
    status: item.status,
    publishStatus: item.publishStatus,
    visibility: item.visibility,
    routePath: item.routePath,
    canonicalUrl: item.canonicalUrl,
    metaTitle: item.metaTitle,
    metaDescription: item.metaDescription,
    metaKeywords: item.metaKeywords,
    robots: item.robots || 'index,follow',
    openGraphTitle: item.openGraphTitle,
    openGraphDescription: item.openGraphDescription,
    openGraphImage: item.openGraphImage,
    schemaJson: item.schemaJson,
    localeCode: item.localeCode,
    lesson: item.lesson,
    experience: item.experience,
    event: item.event,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    audit: {
      createdBy: item.createdBy,
      updatedBy: item.updatedBy,
    },
  }
}

async function ensureUniqueRoutePath(routePath: string, localeCode?: string, excludeId?: number) {
  const existing = await seoRepository.findByRoutePath(routePath, localeCode, excludeId)
  if (existing) {
    throw new ApiError(HTTP_STATUS.CONFLICT, 'Another SEO page already exists for this route and locale')
  }
}

async function ensureUniqueSlug(slug: string, excludeId?: number) {
  const existing = await seoRepository.findBySlug(slug, excludeId)
  if (existing) {
    throw new ApiError(HTTP_STATUS.CONFLICT, 'An SEO page with this slug already exists')
  }
}

const baseSeoCrudService = new BaseContentService<
  SeoRecord,
  Prisma.SEOPageWhereInput,
  Prisma.SEOPageOrderByWithRelationInput,
  Prisma.SEOPageCreateInput,
  Prisma.SEOPageUpdateInput,
  Prisma.SEOPageUpdateManyMutationInput,
  SeoListQuery
>({
  repository: seoRepository,
  buildListQuery: (query) => {
    const sorting = buildSorting({
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
      allowedFields: ['updatedAt', 'createdAt', 'routePath', 'metaTitle'] as const,
      defaultField: 'updatedAt',
      defaultOrder: 'desc',
    })

    const searchWhere = buildSearchOrClause<Prisma.SEOPageWhereInput>(query.search, [
      'name',
      'title',
      'slug',
      'routePath',
      'metaTitle',
      'metaDescription',
    ])

    const quickFilterWhere = buildQuickFilterWhere<Prisma.SEOPageWhereInput>(query.quickFilter, () => {
      if (query.quickFilter === 'published') {
        return { publishStatus: 'PUBLISHED' }
      }

      if (query.quickFilter === 'draft') {
        return { publishStatus: 'DRAFT' }
      }

      if (query.quickFilter === 'public') {
        return { visibility: 'PUBLIC' }
      }

      if (query.quickFilter === 'private') {
        return { visibility: 'PRIVATE' }
      }

      if (query.quickFilter === 'indexable') {
        return {
          OR: [
            { robots: null },
            { robots: { equals: 'index,follow', mode: 'insensitive' } },
          ],
        }
      }

      if (query.quickFilter === 'noindex') {
        return {
          robots: { contains: 'noindex', mode: 'insensitive' },
        }
      }

      return {}
    })

    const where = mergeWhereClauses<Prisma.SEOPageWhereInput>(
      { deletedAt: null },
      searchWhere,
      quickFilterWhere,
      query.publishStatus ? { publishStatus: query.publishStatus } : null,
      query.visibility ? { visibility: query.visibility } : null,
      query.localeCode ? { localeCode: query.localeCode } : null,
    )

    return {
      where,
      orderBy: {
        [sorting.field]: sorting.order,
      } as Prisma.SEOPageOrderByWithRelationInput,
    }
  },
})

function toCreateData(input: SeoMutationInput, userId?: number): Prisma.SEOPageCreateInput {
  const publishWorkflow = resolvePublishWorkflow({
    publishStatus: input.publishStatus,
    visibility: input.visibility,
  })

  return {
    name: input.name,
    title: input.title,
    slug: input.slug || '',
    description: input.metaDescription,
    status: input.status,
    publishStatus: publishWorkflow.publishStatus,
    visibility: publishWorkflow.visibility,
    routePath: normalizeRoutePath(input.routePath),
    canonicalUrl: normalizeCanonicalUrl(input.canonicalUrl),
    metaTitle: input.metaTitle,
    metaDescription: input.metaDescription,
    metaKeywords: normalizeKeywords(input.metaKeywords),
    robots: input.robots || 'index,follow',
    openGraphTitle: input.openGraphTitle,
    openGraphDescription: input.openGraphDescription,
    openGraphImage: input.openGraphImage,
    schemaJson: input.schemaJson as Prisma.InputJsonValue | undefined,
    locale: input.localeCode ? { connect: { code: input.localeCode } } : undefined,
    lesson: input.lessonId ? { connect: { id: input.lessonId } } : undefined,
    experience: input.experienceId ? { connect: { id: input.experienceId } } : undefined,
    event: input.eventId ? { connect: { id: input.eventId } } : undefined,
    ...withCreateAudit({}, userId),
  }
}

function toUpdateData(input: Partial<SeoMutationInput>, userId?: number): Prisma.SEOPageUpdateInput {
  const publishWorkflow = resolvePublishWorkflow({
    publishStatus: input.publishStatus,
    visibility: input.visibility,
  })

  const data: Prisma.SEOPageUpdateInput = {
    ...(input.name !== undefined ? { name: input.name } : {}),
    ...(input.title !== undefined ? { title: input.title } : {}),
    ...(input.slug !== undefined ? { slug: input.slug } : {}),
    ...(input.metaDescription !== undefined ? { description: input.metaDescription } : {}),
    ...(input.status !== undefined ? { status: input.status } : {}),
    ...(input.publishStatus !== undefined ? { publishStatus: publishWorkflow.publishStatus } : {}),
    ...(input.visibility !== undefined ? { visibility: publishWorkflow.visibility } : {}),
    ...(input.routePath !== undefined ? { routePath: normalizeRoutePath(input.routePath) } : {}),
    ...(input.canonicalUrl !== undefined ? { canonicalUrl: normalizeCanonicalUrl(input.canonicalUrl) } : {}),
    ...(input.metaTitle !== undefined ? { metaTitle: input.metaTitle } : {}),
    ...(input.metaDescription !== undefined ? { metaDescription: input.metaDescription } : {}),
    ...(input.metaKeywords !== undefined ? { metaKeywords: normalizeKeywords(input.metaKeywords) } : {}),
    ...(input.robots !== undefined ? { robots: input.robots } : {}),
    ...(input.openGraphTitle !== undefined ? { openGraphTitle: input.openGraphTitle } : {}),
    ...(input.openGraphDescription !== undefined ? { openGraphDescription: input.openGraphDescription } : {}),
    ...(input.openGraphImage !== undefined ? { openGraphImage: input.openGraphImage } : {}),
    ...(input.schemaJson !== undefined ? { schemaJson: input.schemaJson as Prisma.InputJsonValue } : {}),
    ...(input.localeCode !== undefined
      ? {
        locale: input.localeCode
          ? { connect: { code: input.localeCode } }
          : { disconnect: true },
      }
      : {}),
    ...(input.lessonId !== undefined ? { lesson: input.lessonId ? { connect: { id: input.lessonId } } : { disconnect: true } } : {}),
    ...(input.experienceId !== undefined ? { experience: input.experienceId ? { connect: { id: input.experienceId } } : { disconnect: true } } : {}),
    ...(input.eventId !== undefined ? { event: input.eventId ? { connect: { id: input.eventId } } : { disconnect: true } } : {}),
  }

  return withUpdateAudit(data, userId)
}

export const seoService = {
  async list(query: SeoListQuery) {
    const result = await baseSeoCrudService.list(query)

    return {
      items: result.items.map((item) => toSeoResponse(item)),
      pagination: result.pagination,
    }
  },

  async getById(id: number) {
    const item = await baseSeoCrudService.getById(id)
    return toSeoResponse(item)
  },

  async create(input: SeoMutationInput, userId?: number) {
    const routePath = normalizeRoutePath(input.routePath)
    await ensureUniqueRoutePath(routePath, input.localeCode || 'en')

    const slug = input.slug ?? (await generateUniqueSlug(input.routePath.replaceAll('/', ' '), async (candidate) => {
      const existing = await seoRepository.findBySlug(candidate)
      return !existing
    }))

    await ensureUniqueSlug(slug)

    const created = await baseSeoCrudService.create(toCreateData({ ...input, slug, routePath }, userId))
    return toSeoResponse(created)
  },

  async update(id: number, input: Partial<SeoMutationInput>, userId?: number) {
    if (input.routePath !== undefined || input.localeCode !== undefined) {
      const existing = await baseSeoCrudService.getById(id)
      const routePath = normalizeRoutePath(input.routePath ?? existing.routePath)
      const localeCode = input.localeCode ?? existing.localeCode ?? 'en'
      await ensureUniqueRoutePath(routePath, localeCode, id)
    }

    if (input.slug) {
      await ensureUniqueSlug(input.slug, id)
    }

    const updated = await baseSeoCrudService.update(id, toUpdateData(input, userId))
    return toSeoResponse(updated)
  },

  async softDelete(id: number, userId?: number) {
    await baseSeoCrudService.remove(id, userId)
    return null
  },

  async getPublicByPath(path: string, localeCode?: string) {
    const normalizedPath = normalizeRoutePath(path)
    const item = await seoRepository.findPublicByPath(normalizedPath, localeCode)

    if (!item && normalizedPath !== '/') {
      const fallback = await seoRepository.findPublicByPath(normalizedPath.replace(/\/$/, ''), localeCode)
      return fallback ? toSeoResponse(fallback) : null
    }

    return item ? toSeoResponse(item) : null
  },
}
