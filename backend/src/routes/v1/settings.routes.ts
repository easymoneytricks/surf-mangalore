import { Router } from 'express'

import { getWebsiteSettingsController, updateWebsiteSettingsController } from '../../controllers/settings.controller'
import { buildContentPermissionMiddlewares } from '../../content-engine'
import { permissionSlug } from '../../constants/auth'
import { asyncHandler } from '../../middlewares/async-handler'
import { validateRequest } from '../../middlewares/validate.middleware'
import { websiteSettingsBodySchema } from '../../validators/settings.validator'

const settingsRouter = Router()

settingsRouter.get('/', asyncHandler(getWebsiteSettingsController))

settingsRouter.put(
  '/',
  ...buildContentPermissionMiddlewares(permissionSlug('site-settings', 'edit')),
  validateRequest({ body: websiteSettingsBodySchema }),
  asyncHandler(updateWebsiteSettingsController),
)

export { settingsRouter }
