import { type Request, type Response } from 'express'

import { HTTP_STATUS } from '../constants/http'
import { permissionsService } from '../services/permissions.service'
import { type PermissionListQuery } from '../types/permissions'
import { sendSuccess } from '../utils/api-response'

export async function listPermissionsController(req: Request, res: Response) {
  const query = req.query as unknown as PermissionListQuery
  const result = await permissionsService.list(query)

  return sendSuccess(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'Permissions fetched successfully',
    data: result,
  })
}

export async function getPermissionByIdController(req: Request, res: Response) {
  const result = await permissionsService.getById(Number(req.params.id))

  return sendSuccess(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'Permission fetched successfully',
    data: result,
  })
}