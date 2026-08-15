import { Router } from 'express'

import { buildContentPermissionMiddlewares } from '../../content-engine'
import { AUTH_PERMISSIONS } from '../../constants/auth'
import { asyncHandler } from '../../middlewares/async-handler'
import { validateRequest } from '../../middlewares/validate.middleware'
import { getAuditLogByIdController, listAuditLogsController } from '../../controllers/audit-logs.controller'
import { auditLogIdParamSchema, auditLogListQuerySchema } from '../../validators/audit-log.validator'

const auditLogsRouter = Router()

auditLogsRouter.use(...buildContentPermissionMiddlewares(AUTH_PERMISSIONS.VIEW_AUDIT_LOGS))

auditLogsRouter.get('/', validateRequest({ query: auditLogListQuerySchema }), asyncHandler(listAuditLogsController))
auditLogsRouter.get('/:id', validateRequest({ params: auditLogIdParamSchema }), asyncHandler(getAuditLogByIdController))

export { auditLogsRouter }