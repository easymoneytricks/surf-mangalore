import compression from 'compression'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'

import { env } from './config/env'
import { pinoHttpLogger } from './config/logger'
import { swaggerSpec, swaggerUi } from './config/swagger'
import { errorMiddleware } from './middlewares/error.middleware'
import { notFoundMiddleware } from './middlewares/not-found.middleware'
import { globalRateLimit } from './middlewares/rate-limit.middleware'
import { rootRouter } from './routes'

const app = express()

app.disable('x-powered-by')
app.set('trust proxy', env.NODE_ENV === 'production' ? 1 : 0)
app.use(helmet())
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        callback(null, true)
        return
      }

      if (env.ALLOWED_ORIGINS.includes(origin)) {
        callback(null, true)
        return
      }

      callback(new Error('CORS origin not allowed'))
    },
    credentials: true,
  }),
)
app.use((_req, res, next) => {
  res.setHeader('X-Robots-Tag', 'noindex, nofollow')
  next()
})
app.use(globalRateLimit)
app.use(compression())
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(pinoHttpLogger)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
app.use(rootRouter)

app.use(notFoundMiddleware)
app.use(errorMiddleware)

export { app }
