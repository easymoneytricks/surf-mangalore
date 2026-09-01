import rateLimit from 'express-rate-limit'

import { env } from '../config/env'

export const globalRateLimit = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.path === '/api/v1/health' || req.method === 'GET',
  handler: (_req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many requests. Please try again shortly.',
      error: { code: 'RATE_LIMITED', details: undefined },
    })
  },
})
