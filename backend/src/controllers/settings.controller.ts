import { type Request, type Response } from 'express'

import { HTTP_STATUS } from '../constants/http'
import { settingsService } from '../services/settings.service'
import { type WebsiteSettings } from '../types/settings'
import { sendSuccess } from '../utils/api-response'

export async function getWebsiteSettingsController(_req: Request, res: Response) {
  const settings = await settingsService.getWebsiteSettings()

  return sendSuccess(res, {
    statusCode: HTTP_STATUS.OK,
    data: settings,
    message: 'Website settings fetched successfully',
  })
}

export async function updateWebsiteSettingsController(req: Request, res: Response) {
  const payload = req.body as WebsiteSettings
  const userId = req.authUser?.id

  const settings = await settingsService.updateWebsiteSettings(payload, userId)

  return sendSuccess(res, {
    statusCode: HTTP_STATUS.OK,
    data: settings,
    message: 'Website settings updated successfully',
  })
}
