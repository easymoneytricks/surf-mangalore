import { type Request, type Response } from 'express'

import { HTTP_STATUS } from '../constants/http'
import { rolesService } from '../services/roles.service'
import { type RoleListQuery } from '../types/roles'
import { sendPaginated, sendSuccess } from '../utils/api-response'

export async function listRolesController(req: Request, res: Response) {
  const query = req.query as unknown as RoleListQuery
  const result = await rolesService.list(query)

  return sendPaginated(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'Roles fetched successfully',
    items: result.items,
    pagination: result.pagination,
  })
}

export async function getRoleByIdController(req: Request, res: Response) {
  const result = await rolesService.getById(Number(req.params.id))

  return sendSuccess(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'Role fetched successfully',
    data: result,
  })
}

export async function createRoleController(req: Request, res: Response) {
  const result = await rolesService.create(req.body, req.authUser?.id)

  return sendSuccess(res, {
    statusCode: HTTP_STATUS.CREATED,
    message: 'Role created successfully',
    data: result,
  })
}

export async function updateRoleController(req: Request, res: Response) {
  const result = await rolesService.update(Number(req.params.id), req.body, req.authUser?.id)

  return sendSuccess(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'Role updated successfully',
    data: result,
  })
}

export async function deleteRoleController(req: Request, res: Response) {
  await rolesService.delete(Number(req.params.id), req.authUser?.id)

  return sendSuccess(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'Role deleted successfully',
    data: null,
  })
}

export async function updateRolePermissionsController(req: Request, res: Response) {
  const result = await rolesService.updatePermissions(Number(req.params.id), req.body, req.authUser?.id)

  return sendSuccess(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'Role permissions updated successfully',
    data: result,
  })
}