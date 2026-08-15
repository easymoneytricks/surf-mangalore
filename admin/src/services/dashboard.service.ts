import { apiRequest } from './http'
import { type DashboardOverview, type DashboardRange } from '../types/dashboard'

export const dashboardService = {
  getOverview(range: DashboardRange) {
    const query = new URLSearchParams({ range }).toString()
    return apiRequest<DashboardOverview>(`/dashboard?${query}`)
  },
}
