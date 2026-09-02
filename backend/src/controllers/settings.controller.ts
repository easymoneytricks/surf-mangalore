import { type Request, type Response } from 'express'

import { HTTP_STATUS } from '../constants/http'
import { settingsService } from '../services/settings.service'
import { type WebsiteSettings } from '../types/settings'
import { sendSuccess } from '../utils/api-response'
import { sendTestEmail } from '../services/email.service'

export async function getWebsiteSettingsController(_req: Request, res: Response) {
  const settings = await settingsService.getWebsiteSettings(false)

  return sendSuccess(res, {
    statusCode: HTTP_STATUS.OK,
    data: settings,
    message: 'Website settings fetched successfully',
  })
}

export async function getAdminWebsiteSettingsController(_req: Request, res: Response) {
  const settings = await settingsService.getWebsiteSettings(true)
  return sendSuccess(res, { statusCode: HTTP_STATUS.OK, data: settings, message: 'Admin settings fetched successfully' })
}

export async function sendTestEmailController(req: Request, res: Response) {
  await sendTestEmail(String(req.body?.to || ''))
  return sendSuccess(res, { statusCode: HTTP_STATUS.OK, data: { sent: true }, message: 'Test email sent successfully.' })
}

export async function updateWebsiteSettingsController(req: Request, res: Response) {
  const payload = req.body as WebsiteSettings
  const userId = req.authUser?.id

  await settingsService.updateWebsiteSettings(payload, userId)
  const settings = await settingsService.getWebsiteSettings(false)

  return sendSuccess(res, {
    statusCode: HTTP_STATUS.OK,
    data: settings,
    message: 'Website settings updated successfully',
  })
}
