import { z } from 'zod'

import { paginationQuerySchema } from './common.validator'

export const permissionIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
})

export const permissionsListQuerySchema = paginationQuerySchema.extend({
  search: z.string().trim().max(120).optional(),
  resource: z.string().trim().max(120).optional(),
  action: z.string().trim().max(40).optional(),
})