import { type Request, type Response } from 'express'

import { HTTP_STATUS } from '../constants/http'
import { usersService } from '../services/users.service'
import { type UserListQuery } from '../types/users'
import { sendPaginated, sendSuccess } from '../utils/api-response'

export async function listUsersController(req: Request, res: Response) {
  const query = req.query as unknown as UserListQuery
  const result = await usersService.list(query)

  return sendPaginated(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'Users fetched successfully',
    items: result.items,
    pagination: result.pagination,
  })
}

export async function getUserByIdController(req: Request, res: Response) {
  const result = await usersService.getById(Number(req.params.id))

  return sendSuccess(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'User fetched successfully',
    data: result,
  })
}

export async function patchUserController(req: Request, res: Response) {
  const result = await usersService.patch(Number(req.params.id), req.body, req.authUser?.id)

  return sendSuccess(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'User updated successfully',
    data: result,
  })
}

export async function createUserController(req: Request, res: Response) {
  const result = await usersService.create(req.body, req.authUser?.id)

  return sendSuccess(res, {
    statusCode: HTTP_STATUS.CREATED,
    message: 'User created successfully',
    data: result,
  })
}

export async function deleteUserController(req: Request, res: Response) {
  await usersService.softDelete(Number(req.params.id), req.authUser?.id, req.authUser?.id)

  return sendSuccess(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'User deleted successfully',
    data: null,
  })
}

export async function resetUserPasswordController(req: Request, res: Response) {
  const result = await usersService.resetPassword(Number(req.params.id), req.body, req.authUser?.id)

  return sendSuccess(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'User password reset successfully',
    data: result,
  })
}

export async function changeUserPasswordController(req: Request, res: Response) {
  const result = await usersService.changePassword(Number(req.params.id), req.body, req.authUser?.id)

  return sendSuccess(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'User updated successfully',
    data: result,
  })
}