import { type Request, type Response } from 'express'

import { env } from '../config/env'
import { HTTP_STATUS } from '../constants/http'
import { prisma } from '../lib/prisma'
import { sendSuccess } from '../utils/api-response'

export function healthController(_req: Request, res: Response) {
  return sendSuccess(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'Service healthy',
    data: {
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      environment: env.NODE_ENV,
      prismaClientReady: Boolean(prisma),
    },
  })
}
