import { z } from 'zod'

import { BOOKING_LIST_QUICK_FILTERS, BOOKING_LIST_SORT_FIELDS, BOOKING_STATUSES, BOOKING_TYPES } from '../constants/bookings'

const emptyToUndefined = z.preprocess((value) => {
  if (typeof value === 'string' && value.trim() === '') {
    return undefined
  }

  return value
}, z.string().optional())

const dateOnlyRegex = /^\d{4}-\d{2}-\d{2}$/

function isFutureOrTodayDateString(value: string) {
  if (!dateOnlyRegex.test(value)) {
    return false
  }

  const today = new Date()
  const todayUtc = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate())
  const [year, month, day] = value.split('-').map(Number)
  const targetUtc = Date.UTC(year, month - 1, day)

  return targetUtc >= todayUtc
}

function isValidDateOnly(value: string) {
  if (!dateOnlyRegex.test(value)) {
    return false
  }

  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  return date.getUTCFullYear() === year && date.getUTCMonth() + 1 === month && date.getUTCDate() === day
}

export const bookingIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
})

export const bookingListQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
  search: emptyToUndefined,
  sortBy: z.enum(BOOKING_LIST_SORT_FIELDS).default('bookingDate'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  quickFilter: z.enum(BOOKING_LIST_QUICK_FILTERS).default('all'),
  bookingStatus: z.enum(BOOKING_STATUSES).optional(),
  bookingType: z.enum(BOOKING_TYPES).optional(),
  eventId: z.coerce.number().int().positive().optional(),
  lessonId: z.coerce.number().int().positive().optional(),
  experienceId: z.coerce.number().int().positive().optional(),
  instructor: emptyToUndefined,
  fromDate: emptyToUndefined,
  toDate: emptyToUndefined,
}).superRefine((value, ctx) => {
  if (value.fromDate && !isValidDateOnly(value.fromDate)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['fromDate'],
      message: 'fromDate must be in YYYY-MM-DD format',
    })
  }

  if (value.toDate && !isValidDateOnly(value.toDate)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['toDate'],
      message: 'toDate must be in YYYY-MM-DD format',
    })
  }

  if (value.fromDate && value.toDate && value.fromDate > value.toDate) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['toDate'],
      message: 'toDate must be on or after fromDate',
    })
  }
})

export const bookingCreateBodySchema = z.object({
  bookingType: z.enum(BOOKING_TYPES),
  selectedItemId: z.coerce.number().int().positive(),
  preferredDate: z.string().refine((value) => isValidDateOnly(value), { message: 'preferredDate must be in YYYY-MM-DD format' })
    .refine((value) => isFutureOrTodayDateString(value), { message: 'preferredDate cannot be in the past' }),
  preferredTime: z.string().trim().max(80).optional(),
  participants: z.coerce.number().int().min(1).max(20),
  customerName: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(160),
  phone: z.string().trim().min(8).max(24),
  emergencyContact: z.string().trim().max(160).optional(),
  specialNotes: z.string().trim().max(2000).optional(),
})

export const bookingStatusPatchBodySchema = z.object({
  bookingStatus: z.enum(BOOKING_STATUSES),
  note: z.string().trim().max(1000).optional(),
})

export const bookingUpdateBodySchema = z.object({
  preferredDate: z.string().refine((value) => isValidDateOnly(value), { message: 'preferredDate must be in YYYY-MM-DD format' })
    .refine((value) => isFutureOrTodayDateString(value), { message: 'preferredDate cannot be in the past' })
    .optional(),
  preferredTime: z.string().trim().max(80).optional(),
  participants: z.coerce.number().int().min(1).max(20).optional(),
  assignedInstructor: z.string().trim().max(120).optional(),
  internalNotes: z.string().trim().max(3000).optional(),
  emergencyContact: z.string().trim().max(160).optional(),
  specialNotes: z.string().trim().max(2000).optional(),
}).refine((value) => Object.keys(value).length > 0, {
  message: 'At least one field must be provided for update',
})
