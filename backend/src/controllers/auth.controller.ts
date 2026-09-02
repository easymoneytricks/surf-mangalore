import { type Request, type Response } from 'express'

import { env } from '../config/env'
import { HTTP_STATUS } from '../constants/http'
import { authService } from '../services/auth.service'
import { sendSuccess } from '../utils/api-response'
import { clearRefreshTokenCookie, setRefreshTokenCookie } from '../utils/auth-cookie'

function requestMeta(req: Request) {
  return {
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
  }
}

export async function loginController(req: Request, res: Response) {
  const result = await authService.login(req.body, requestMeta(req))
  setRefreshTokenCookie(res, result.refreshToken)

  return sendSuccess(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'Login successful',
    data: {
      accessToken: result.accessToken,
      user: result.user,
    },
  })
}

export async function refreshController(req: Request, res: Response) {
  const refreshToken = req.cookies?.[env.AUTH_COOKIE_NAME] as string | undefined
  const result = await authService.refresh(refreshToken || '', requestMeta(req))

  setRefreshTokenCookie(res, result.refreshToken)
  return sendSuccess(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'Token refreshed',
    data: {
      accessToken: result.accessToken,
      user: result.user,
    },
  })
}

export async function logoutController(req: Request, res: Response) {
  const refreshToken = req.cookies?.[env.AUTH_COOKIE_NAME] as string | undefined
  await authService.logout(refreshToken)
  clearRefreshTokenCookie(res)

  return sendSuccess(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'Logout successful',
    data: null,
  })
}

export async function meController(req: Request, res: Response) {
  const user = await authService.me(req.authUser!.id)

  return sendSuccess(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'Authenticated user profile',
    data: user,
  })
}

export async function changeOwnPasswordController(req: Request, res: Response) {
  await authService.changeOwnPassword(req.authUser!.id, req.body, req.authUser!.id)
  return sendSuccess(res, { statusCode: HTTP_STATUS.OK, message: 'Password changed successfully.', data: null })
}
