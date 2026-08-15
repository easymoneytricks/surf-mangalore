import { Router } from 'express'

import { env } from '../config/env'
import { v1Router } from './v1'

const rootRouter = Router()

rootRouter.use(`${env.API_PREFIX}/${env.API_VERSION}`, v1Router)

export { rootRouter }
