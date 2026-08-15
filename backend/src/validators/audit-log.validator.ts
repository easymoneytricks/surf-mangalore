import { z } from 'zod'

import { paginationQuerySchema } from './common.validator'

export const auditLogIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
})

export const auditLogListQuerySchema = paginationQuerySchema.extend({
  search: z.string().trim().max(160).optional(),
  action: z.string().trim().max(80).optional(),
  resourceType: z.string().trim().max(120).optional(),
  actorId: z.coerce.number().int().positive().optional(),
  from: z.string().trim().datetime().optional(),
  to: z.string().trim().datetime().optional(),
})