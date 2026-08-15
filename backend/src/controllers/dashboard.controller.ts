import { type Request, type Response } from 'express'

import { HTTP_STATUS } from '../constants/http'
import { dashboardService } from '../services/dashboard.service'
import { type DashboardQuery } from '../types/dashboard'
import { sendSuccess } from '../utils/api-response'

export async function getDashboardOverviewController(req: Request, res: Response) {
  const query = req.query as unknown as DashboardQuery
  const result = await dashboardService.getOverview(query)

  return sendSuccess(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'Dashboard overview fetched successfully',
    data: result,
  })
}
