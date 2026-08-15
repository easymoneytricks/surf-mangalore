import { Router } from 'express'

import { buildContentPermissionMiddlewares } from '../../content-engine'
import { getUserByIdController, listUsersController, patchUserController, createUserController, deleteUserController, resetUserPasswordController, changeUserPasswordController } from '../../controllers/users.controller'
import { AUTH_PERMISSIONS } from '../../constants/auth'
import { asyncHandler } from '../../middlewares/async-handler'
import { validateRequest } from '../../middlewares/validate.middleware'
import { userCreateBodySchema, userIdParamsSchema, userPasswordBodySchema, userPatchBodySchema, userResetPasswordBodySchema, usersListQuerySchema } from '../../validators/users.validator'

const usersRouter = Router()

usersRouter.use(...buildContentPermissionMiddlewares(AUTH_PERMISSIONS.MANAGE_USERS))

usersRouter.get('/', validateRequest({ query: usersListQuerySchema }), asyncHandler(listUsersController))
usersRouter.get('/:id', validateRequest({ params: userIdParamsSchema }), asyncHandler(getUserByIdController))
usersRouter.post('/', validateRequest({ body: userCreateBodySchema }), asyncHandler(createUserController))
usersRouter.patch('/:id', validateRequest({ params: userIdParamsSchema, body: userPatchBodySchema }), asyncHandler(patchUserController))
usersRouter.patch('/:id/password', validateRequest({ params: userIdParamsSchema, body: userPasswordBodySchema }), asyncHandler(changeUserPasswordController))
usersRouter.post('/:id/reset-password', validateRequest({ params: userIdParamsSchema, body: userResetPasswordBodySchema }), asyncHandler(resetUserPasswordController))
usersRouter.delete('/:id', validateRequest({ params: userIdParamsSchema }), asyncHandler(deleteUserController))

export { usersRouter }