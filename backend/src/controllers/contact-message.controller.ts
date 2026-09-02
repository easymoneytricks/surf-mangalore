import { createBaseContentController } from '../content-engine'
import { type Request, type Response } from 'express'
import { contactMessageService } from '../services/contact-message.service'
import { settingsService } from '../services/settings.service'
import { type ContactMessageListQuery } from '../types/contact-message'

const baseContactMessageController = createBaseContentController({
  resourceName: 'Contact Message',
  service: contactMessageService,
  parseListQuery: (req) => req.query as unknown as ContactMessageListQuery,
  parseCreateBody: (req) => req.body,
  parseUpdateBody: (req) => req.body,
})

export const listContactMessagesController = baseContactMessageController.list
export const getContactMessageByIdController = baseContactMessageController.getById
export const createContactMessageController = baseContactMessageController.create
export const updateContactMessageController = baseContactMessageController.update
export const deleteContactMessageController = baseContactMessageController.remove

export function getContactRecaptchaController(_req: Request, res: Response) {
  return settingsService.getWebsiteSettings(false).then((settings) => res.status(200).json({ success: true, data: { enabled: Boolean(settings.security?.recaptchaEnabled), siteKey: settings.security?.recaptchaSiteKey || null } }))
}

export async function replyToContactMessageController(req: Request, res: Response) {
  const result = await contactMessageService.reply(Number(req.params.id), req.body)
  return res.status(200).json({ success: true, message: 'Reply sent successfully', data: result })
}
