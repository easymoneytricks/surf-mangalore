import { type Response } from 'express'

import { env } from '../config/env'

function getCookieOptions() {
  return {
    httpOnly: true,
    secure: env.AUTH_COOKIE_SECURE || env.NODE_ENV === 'production',
    sameSite: env.AUTH_COOKIE_SAME_SITE,
    domain: env.AUTH_COOKIE_DOMAIN || undefined,
    path: `${env.API_PREFIX}/${env.API_VERSION}/auth`,
    maxAge: env.REFRESH_TOKEN_COOKIE_MAX_AGE_MS,
  } as const
}

export function setRefreshTokenCookie(res: Response, token: string) {
  res.cookie(env.AUTH_COOKIE_NAME, token, getCookieOptions())
}

export function clearRefreshTokenCookie(res: Response) {
  res.clearCookie(env.AUTH_COOKIE_NAME, {
    ...getCookieOptions(),
    maxAge: undefined,
  })
}
