import { Router } from 'express'

import { buildContentPermissionMiddlewares } from '../../content-engine'
import { AUTH_PERMISSIONS } from '../../constants/auth'
import { asyncHandler } from '../../middlewares/async-handler'
import { validateRequest } from '../../middlewares/validate.middleware'
import { createRoleController, deleteRoleController, getRoleByIdController, listRolesController, updateRoleController, updateRolePermissionsController } from '../../controllers/roles.controller'
import { roleCreateBodySchema, roleIdParamSchema, rolePermissionIdsBodySchema, roleUpdateBodySchema, rolesListQuerySchema } from '../../validators/roles.validator'

const rolesRouter = Router()

rolesRouter.use(...buildContentPermissionMiddlewares(AUTH_PERMISSIONS.MANAGE_ROLES))

rolesRouter.get('/', validateRequest({ query: rolesListQuerySchema }), asyncHandler(listRolesController))
rolesRouter.get('/:id', validateRequest({ params: roleIdParamSchema }), asyncHandler(getRoleByIdController))
rolesRouter.post('/', validateRequest({ body: roleCreateBodySchema }), asyncHandler(createRoleController))
rolesRouter.put('/:id', validateRequest({ params: roleIdParamSchema, body: roleUpdateBodySchema }), asyncHandler(updateRoleController))
rolesRouter.delete('/:id', validateRequest({ params: roleIdParamSchema }), asyncHandler(deleteRoleController))
rolesRouter.put('/:id/permissions', validateRequest({ params: roleIdParamSchema, body: rolePermissionIdsBodySchema }), asyncHandler(updateRolePermissionsController))

export { rolesRouter }