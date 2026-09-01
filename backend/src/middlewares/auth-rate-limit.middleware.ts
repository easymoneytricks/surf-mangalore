import rateLimit from 'express-rate-limit'

import { env } from '../config/env'

export const authLoginRateLimit = rateLimit({
  windowMs: env.AUTH_LOGIN_WINDOW_MS,
  max: env.AUTH_LOGIN_MAX_ATTEMPTS,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  handler: (_req, res) => res.status(429).json({ success: false, message: 'Too many login attempts. Please try again shortly.', error: { code: 'RATE_LIMITED' } }),
})

export const authRefreshRateLimit = rateLimit({
  windowMs: env.AUTH_REFRESH_WINDOW_MS,
  max: env.AUTH_REFRESH_MAX_ATTEMPTS,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => res.status(429).json({ success: false, message: 'Too many refresh attempts. Please try again shortly.', error: { code: 'RATE_LIMITED' } }),
})
