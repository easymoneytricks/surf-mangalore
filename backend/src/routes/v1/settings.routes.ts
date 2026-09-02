import { Router } from 'express'

import { getAdminWebsiteSettingsController, getWebsiteSettingsController, sendTestEmailController, updateWebsiteSettingsController } from '../../controllers/settings.controller'
import { buildContentPermissionMiddlewares } from '../../content-engine'
import { permissionSlug } from '../../constants/auth'
import { asyncHandler } from '../../middlewares/async-handler'
import { validateRequest } from '../../middlewares/validate.middleware'
import { websiteSettingsBodySchema } from '../../validators/settings.validator'
import { z } from 'zod'

const settingsRouter = Router()

settingsRouter.get('/', asyncHandler(getWebsiteSettingsController))
settingsRouter.get('/admin', ...buildContentPermissionMiddlewares(permissionSlug('site-settings', 'edit')), asyncHandler(getAdminWebsiteSettingsController))
settingsRouter.post('/admin/test-email', ...buildContentPermissionMiddlewares(permissionSlug('site-settings', 'edit')), validateRequest({ body: z.object({ to: z.string().email() }) }), asyncHandler(sendTestEmailController))

settingsRouter.put(
  '/',
  ...buildContentPermissionMiddlewares(permissionSlug('site-settings', 'edit')),
  validateRequest({ body: websiteSettingsBodySchema }),
  asyncHandler(updateWebsiteSettingsController),
)

export { settingsRouter }
