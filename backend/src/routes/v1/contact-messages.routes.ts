import { Router } from 'express'

import { buildContentPermissionMiddlewares } from '../../content-engine'
import { permissionSlug } from '../../constants/auth'
import {
  createContactMessageController,
  deleteContactMessageController,
  getContactMessageByIdController,
  listContactMessagesController,
  updateContactMessageController,
} from '../../controllers/contact-message.controller'
import { asyncHandler } from '../../middlewares/async-handler'
import { validateRequest } from '../../middlewares/validate.middleware'
import {
  contactMessageCreateBody,
  contactMessageIdParamSchema,
  contactMessageListQuerySchema,
  contactMessageUpdateBody,
} from '../../validators/contact-message.validator'

const contactMessagesRouter = Router()

contactMessagesRouter.post('/', validateRequest({ body: contactMessageCreateBody }), asyncHandler(createContactMessageController))

contactMessagesRouter.get('/', ...buildContentPermissionMiddlewares(permissionSlug('contact-messages', 'view')), validateRequest({ query: contactMessageListQuerySchema }), asyncHandler(listContactMessagesController))
contactMessagesRouter.get('/id/:id', ...buildContentPermissionMiddlewares(permissionSlug('contact-messages', 'view')), validateRequest({ params: contactMessageIdParamSchema }), asyncHandler(getContactMessageByIdController))
contactMessagesRouter.patch('/:id', ...buildContentPermissionMiddlewares(permissionSlug('contact-messages', 'edit')), validateRequest({ params: contactMessageIdParamSchema, body: contactMessageUpdateBody }), asyncHandler(updateContactMessageController))
contactMessagesRouter.delete('/:id', ...buildContentPermissionMiddlewares(permissionSlug('contact-messages', 'delete')), validateRequest({ params: contactMessageIdParamSchema }), asyncHandler(deleteContactMessageController))

export { contactMessagesRouter }
