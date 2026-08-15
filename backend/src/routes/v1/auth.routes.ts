import { Router } from 'express'

import { loginController, logoutController, meController, refreshController } from '../../controllers/auth.controller'
import { asyncHandler } from '../../middlewares/async-handler'
import { requireAuthentication } from '../../middlewares/auth.middleware'
import { authLoginRateLimit, authRefreshRateLimit } from '../../middlewares/auth-rate-limit.middleware'
import { validateRequest } from '../../middlewares/validate.middleware'
import { loginBodySchema } from '../../validators/auth.validator'

const authRouter = Router()

authRouter.post('/login', authLoginRateLimit, validateRequest({ body: loginBodySchema }), asyncHandler(loginController))
authRouter.post('/logout', asyncHandler(logoutController))
authRouter.post('/refresh', authRefreshRateLimit, asyncHandler(refreshController))
authRouter.get('/me', requireAuthentication, asyncHandler(meController))

export { authRouter }
