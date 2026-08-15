import { z } from 'zod'

import { paginationQuerySchema } from './common.validator'

const roleSchema = z.enum(['SUPER_ADMIN', 'ADMIN', 'EDITOR', 'VIEWER', 'CONTENT_MANAGER', 'SUPPORT', 'OPERATIONS'])

export const userIdParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
})

export const usersListQuerySchema = paginationQuerySchema.extend({
  search: z.string().trim().max(120).optional(),
  role: roleSchema.optional(),
  status: z.string().trim().min(1).max(40).optional(),
})

export const userCreateBodySchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(180),
  password: z.string().min(8).max(128),
  role: roleSchema,
  status: z.enum(['active', 'inactive']).default('active'),
  avatar: z.union([z.string().trim().url().max(260), z.literal(''), z.null()]).optional(),
  mustChangePassword: z.boolean().default(true),
})

export const userPatchBodySchema = z.object({
  name: z.string().trim().min(1).max(120).optional(),
  email: z.string().trim().email().max(180).optional(),
  role: roleSchema.optional(),
  status: z.enum(['active', 'inactive']).optional(),
  avatar: z.union([z.string().trim().url().max(260), z.literal(''), z.null()]).optional(),
}).refine((value) => Object.keys(value).length > 0, {
  message: 'At least one field must be provided',
})

export const userPasswordBodySchema = z.object({
  password: z.string().min(8).max(128),
  mustChangePassword: z.boolean().default(false),
})

export const userResetPasswordBodySchema = z.object({
  password: z.string().min(8).max(128).optional(),
  mustChangePassword: z.boolean().default(true),
})