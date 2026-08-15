import { Router } from 'express'

import { buildContentPermissionMiddlewares } from '../../content-engine'
import { AUTH_PERMISSIONS } from '../../constants/auth'
import { asyncHandler } from '../../middlewares/async-handler'
import { validateRequest } from '../../middlewares/validate.middleware'
import { getPermissionByIdController, listPermissionsController } from '../../controllers/permissions.controller'
import { permissionIdParamSchema, permissionsListQuerySchema } from '../../validators/permissions.validator'

const permissionsRouter = Router()

permissionsRouter.use(...buildContentPermissionMiddlewares(AUTH_PERMISSIONS.MANAGE_PERMISSIONS))

permissionsRouter.get('/', validateRequest({ query: permissionsListQuerySchema }), asyncHandler(listPermissionsController))
permissionsRouter.get('/:id', validateRequest({ params: permissionIdParamSchema }), asyncHandler(getPermissionByIdController))

export { permissionsRouter }