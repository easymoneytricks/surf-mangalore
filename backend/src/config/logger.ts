import pino from 'pino'
import pinoHttp from 'pino-http'

import { env } from './env'

export const logger = pino({
  level: env.LOG_LEVEL,
  redact: {
    paths: [
      'req.headers.authorization',
      'req.headers.cookie',
      'res.headers["set-cookie"]',
      '*.password',
      '*.passwordHash',
      '*.token',
      '*.refreshToken',
      '*.jwt',
    ],
    remove: true,
  },
})

export const pinoHttpLogger = pinoHttp({
  logger,
  customSuccessMessage: (req) => `Request completed: ${req.method} ${req.url}`,
  customErrorMessage: (req) => `Request failed: ${req.method} ${req.url}`,
})
