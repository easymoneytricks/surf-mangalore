import { z } from 'zod'

import { paginationQuerySchema } from './common.validator'

export const roleIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
})

export const rolesListQuerySchema = paginationQuerySchema.extend({
  search: z.string().trim().max(120).optional(),
  status: z.string().trim().min(1).max(40).optional(),
})

export const rolePermissionIdsBodySchema = z.object({
  permissionIds: z.array(z.coerce.number().int().positive()).default([]),
})

export const roleCreateBodySchema = z.object({
  name: z.string().trim().min(2).max(120),
  title: z.string().trim().min(2).max(160),
  description: z.string().trim().max(500).optional(),
  status: z.enum(['active', 'inactive']).default('active'),
  isSystem: z.boolean().default(false),
  permissionIds: z.array(z.coerce.number().int().positive()).default([]),
})

export const roleUpdateBodySchema = z.object({
  name: z.string().trim().min(2).max(120).optional(),
  title: z.string().trim().min(2).max(160).optional(),
  description: z.string().trim().max(500).optional(),
  status: z.enum(['active', 'inactive']).optional(),
  isSystem: z.boolean().optional(),
  permissionIds: z.array(z.coerce.number().int().positive()).optional(),
}).refine((value) => Object.keys(value).length > 0, {
  message: 'At least one field must be provided',
})