import { Router } from 'express'

import { buildContentPermissionMiddlewares } from '../../content-engine'
import { permissionSlug } from '../../constants/auth'
import { getDashboardOverviewController } from '../../controllers/dashboard.controller'
import { asyncHandler } from '../../middlewares/async-handler'
import { validateRequest } from '../../middlewares/validate.middleware'
import { dashboardQuerySchema } from '../../validators/dashboard.validator'

const dashboardRouter = Router()

dashboardRouter.get(
  '/',
  ...buildContentPermissionMiddlewares(permissionSlug('dashboard', 'view')),
  validateRequest({ query: dashboardQuerySchema }),
  asyncHandler(getDashboardOverviewController),
)

export { dashboardRouter }
