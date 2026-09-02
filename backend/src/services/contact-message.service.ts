import { Prisma } from '@prisma/client'
import { HTTP_STATUS } from '../constants/http'

import {
  BaseContentService,
  buildQuickFilterWhere,
  buildSearchOrClause,
  buildSorting,
  mergeWhereClauses,
} from '../content-engine'
import { contactMessageRepository } from '../repositories/contact-message.repository'
import { ApiError } from '../utils/api-error'
import { type ContactMessageListQuery, type ContactMessageCreateInput, type ContactMessageUpdateInput } from '../types/contact-message'
import { sendAdminContactNotification, sendContactReply } from './email.service'
import { settingsService } from './settings.service'

type ContactMessageListRecord = Awaited<ReturnType<typeof contactMessageRepository.listRaw>>['items'][number]
type ContactMessageDetailRecord = NonNullable<Awaited<ReturnType<typeof contactMessageRepository.findById>>>
type ContactMessageRecord = ContactMessageListRecord | ContactMessageDetailRecord

function toUiStatus(status: string) {
  if (status === 'IN_REVIEW') {
    return 'READ'
  }

  if (status === 'RESOLVED') {
    return 'REPLIED'
  }

  if (status === 'ARCHIVED') {
    return 'ARCHIVED'
  }

  return 'NEW'
}

function toDatabaseStatus(status?: string) {
  if (!status) {
    return undefined
  }

  if (status === 'READ' || status === 'IN_REVIEW') {
    return 'IN_REVIEW'
  }

  if (status === 'REPLIED' || status === 'RESOLVED') {
    return 'RESOLVED'
  }

  if (status === 'ARCHIVED') {
    return 'ARCHIVED'
  }

  return 'NEW'
}

function toDatabaseStatusWhere(status?: string): Prisma.ContactMessageWhereInput | null {
  const normalized = toDatabaseStatus(status)
  return normalized ? { status: normalized } : null
}

const baseContactMessageCrudService = new BaseContentService<
  ContactMessageRecord,
  Prisma.ContactMessageWhereInput,
  Prisma.ContactMessageOrderByWithRelationInput,
  Prisma.ContactMessageCreateInput,
  Prisma.ContactMessageUpdateInput,
  Prisma.ContactMessageUpdateManyMutationInput,
  ContactMessageListQuery
>({
  repository: contactMessageRepository,
  buildListQuery: (query) => {
    const sorting = buildSorting({
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
      allowedFields: ['createdAt', 'updatedAt', 'fullName'] as const,
      defaultField: 'createdAt',
      defaultOrder: 'desc',
    })

    const searchWhere = buildSearchOrClause<Prisma.ContactMessageWhereInput>(query.search, ['name', 'email', 'subject', 'message', 'fullName'])

    const quickFilterWhere = buildQuickFilterWhere<Prisma.ContactMessageWhereInput>(query.quickFilter, () => {
      if (query.quickFilter === 'new') {
        return { status: 'NEW' }
      }

      if (query.quickFilter === 'read') {
        return { status: 'IN_REVIEW' }
      }

      if (query.quickFilter === 'replied') {
        return { status: 'RESOLVED' }
      }

      if (query.quickFilter === 'archived') {
        return { status: 'ARCHIVED' }
      }

      return {}
    })

    const where = mergeWhereClauses<Prisma.ContactMessageWhereInput>(
      { deletedAt: null },
      searchWhere,
      quickFilterWhere,
      toDatabaseStatusWhere(query.status),
    )

    return {
      where,
      orderBy: {
        [sorting.field]: sorting.order,
      } as Prisma.ContactMessageOrderByWithRelationInput,
    }
  },
})

export const contactMessageService = {
  async list(query: ContactMessageListQuery) {
    const result = await baseContactMessageCrudService.list(query)
    return {
      items: result.items.map((item) => ({
        ...item,
        status: toUiStatus(item.status),
      })),
      pagination: result.pagination,
    }
  },

  async getById(id: number) {
    const contactMessage = await baseContactMessageCrudService.getById(id)
    return {
      ...contactMessage,
      status: toUiStatus(contactMessage.status),
    }
  },

  async create(input: ContactMessageCreateInput) {
    const security = (await settingsService.getWebsiteSettings(true)).security
    if (security.recaptchaEnabled) {
      if (!input.captchaToken || !security.recaptchaSecretKey) throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Please complete the CAPTCHA verification.')
      const verification = await fetch('https://www.google.com/recaptcha/api/siteverify', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ secret: security.recaptchaSecretKey, response: input.captchaToken }) })
      const result = await verification.json() as { success?: boolean }
      if (!result.success) throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'CAPTCHA verification failed. Please try again.')
    }
    const duplicateCutoff = new Date(Date.now() - 5 * 60 * 1000)
    const duplicate = await contactMessageRepository.findRecentDuplicate({
      email: input.email,
      subject: input.subject,
      message: input.message,
      source: input.source,
      createdAfter: duplicateCutoff,
    })

    if (duplicate) {
      throw new ApiError(HTTP_STATUS.CONFLICT, 'Duplicate contact message detected. Please wait a few minutes before retrying.')
    }

    const created = await baseContactMessageCrudService.create({
      name: input.name,
      title: input.subject ?? `Message from ${input.name}`,
      description: input.message,
      fullName: input.name,
      email: input.email,
      phone: input.phone,
      subject: input.subject,
      message: input.message,
      source: input.source ?? 'website',
    })

    void sendAdminContactNotification(input).catch(() => undefined)

    return {
      ...created,
      status: toUiStatus(created.status),
    }
  },

  async update(id: number, input: ContactMessageUpdateInput, _userId?: number) {
    const data: ContactMessageUpdateInput = {
      ...input,
      status: toDatabaseStatus(input.status),
    }

    const updated = await baseContactMessageCrudService.update(id, data)

    return {
      ...updated,
      status: toUiStatus(updated.status),
    }
  },

  async softDelete(id: number, userId?: number) {
    return baseContactMessageCrudService.remove(id, userId)
  },

  async reply(id: number, input: { message: string; subject?: string }) {
    const message = await contactMessageRepository.findById(id)
    if (!message) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Contact message not found')
    try {
      await sendContactReply({ to: message.email, name: message.name, subject: input.subject || message.subject || undefined, message: input.message })
    } catch {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Unable to send reply. Check SMTP settings and try again.')
    }
    const updated = await baseContactMessageCrudService.update(id, { status: 'RESOLVED' })
    return { ...updated, status: 'REPLIED' }
  },
}
