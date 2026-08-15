import { createBaseContentController } from '../content-engine'
import { contactMessageService } from '../services/contact-message.service'
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
