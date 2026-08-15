import { type Request, type Response } from 'express'

import { HTTP_STATUS } from '../../constants/http'
import { auditLogService } from '../../services/audit-log.service'
import { sendPaginated, sendSuccess } from '../../utils/api-response'

type BaseCrudControllerConfig<TListQuery, TCreateInput, TUpdateInput, TService> = {
  resourceName: string
  service: TService
  parseListQuery: (req: Request) => TListQuery
  parseCreateBody: (req: Request) => TCreateInput
  parseUpdateBody: (req: Request) => TUpdateInput
}

type CrudServiceContract<TListQuery, TCreateInput, TUpdateInput, TEntity> = {
  list(query: TListQuery): Promise<{ items: TEntity[]; pagination: { page: number; pageSize: number; totalItems: number; totalPages: number } }>
  getById(id: number): Promise<TEntity>
  create(input: TCreateInput, userId?: number): Promise<TEntity>
  update(id: number, input: TUpdateInput, userId?: number): Promise<TEntity>
  softDelete(id: number, userId?: number): Promise<unknown>
}

export function createBaseContentController<TListQuery, TCreateInput, TUpdateInput, TEntity>(
  config: BaseCrudControllerConfig<TListQuery, TCreateInput, TUpdateInput, CrudServiceContract<TListQuery, TCreateInput, TUpdateInput, TEntity>>,
) {
  const normalizeResourceId = (value: unknown): string | number | null => {
    if (Array.isArray(value)) {
      return typeof value[0] === 'string' || typeof value[0] === 'number' ? value[0] : null
    }

    if (typeof value === 'string' || typeof value === 'number') {
      return value
    }

    return null
  }

  return {
    list: async (req: Request, res: Response) => {
      const result = await config.service.list(config.parseListQuery(req))

      return sendPaginated(res, {
        statusCode: HTTP_STATUS.OK,
        message: `${config.resourceName} fetched successfully`,
        items: result.items,
        pagination: result.pagination,
      })
    },

    getById: async (req: Request, res: Response) => {
      const result = await config.service.getById(Number(req.params.id))

      return sendSuccess(res, {
        statusCode: HTTP_STATUS.OK,
        message: `${config.resourceName} fetched successfully`,
        data: result,
      })
    },

    create: async (req: Request, res: Response) => {
      const result = await config.service.create(config.parseCreateBody(req), req.authUser?.id)

      await auditLogService.record({
        actorId: req.authUser?.id,
        action: 'CREATE',
        resourceType: config.resourceName.replace(/\s+/g, '_').toUpperCase(),
        resourceId: (result as { id?: number | string } | null | undefined)?.id ?? null,
        description: `${config.resourceName} created`,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      })

      return sendSuccess(res, {
        statusCode: HTTP_STATUS.CREATED,
        message: `${config.resourceName} created successfully`,
        data: result,
      })
    },

    update: async (req: Request, res: Response) => {
      const result = await config.service.update(Number(req.params.id), config.parseUpdateBody(req), req.authUser?.id)

      await auditLogService.record({
        actorId: req.authUser?.id,
        action: 'UPDATE',
        resourceType: config.resourceName.replace(/\s+/g, '_').toUpperCase(),
        resourceId: normalizeResourceId((result as { id?: number | string } | null | undefined)?.id ?? req.params.id),
        description: `${config.resourceName} updated`,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      })

      return sendSuccess(res, {
        statusCode: HTTP_STATUS.OK,
        message: `${config.resourceName} updated successfully`,
        data: result,
      })
    },

    remove: async (req: Request, res: Response) => {
      await config.service.softDelete(Number(req.params.id), req.authUser?.id)

      await auditLogService.record({
        actorId: req.authUser?.id,
        action: 'DELETE',
        resourceType: config.resourceName.replace(/\s+/g, '_').toUpperCase(),
        resourceId: normalizeResourceId(req.params.id),
        description: `${config.resourceName} deleted`,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      })

      return sendSuccess(res, {
        statusCode: HTTP_STATUS.OK,
        message: `${config.resourceName} deleted successfully`,
        data: null,
      })
    },
  }
}
