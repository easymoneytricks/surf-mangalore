import { type Request, type Response } from 'express'

import { HTTP_STATUS } from '../constants/http'
import { auditLogService } from '../services/audit-log.service'
import { type AuditLogListQuery } from '../types/audit-log'
import { sendPaginated, sendSuccess } from '../utils/api-response'

export async function listAuditLogsController(req: Request, res: Response) {
  const query = req.query as unknown as AuditLogListQuery
  const result = await auditLogService.list(query)

  return sendPaginated(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'Audit logs fetched successfully',
    items: result.items,
    pagination: result.pagination,
  })
}

export async function getAuditLogByIdController(req: Request, res: Response) {
  const result = await auditLogService.getById(Number(req.params.id))

  return sendSuccess(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'Audit log fetched successfully',
    data: result,
  })
}