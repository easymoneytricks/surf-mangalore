import { apiRequest } from './http'
import { type AuditLogsListParams, type AuditLogsListResponse, type AuditLogRecord } from '../types/audit-logs'

export type { AuditLogsListParams, AuditLogsListResponse, AuditLogRecord } from '../types/audit-logs'

function buildQuery(params: AuditLogsListParams) {
  const searchParams = new URLSearchParams()

  if (params.page) searchParams.set('page', String(params.page))
  if (params.pageSize) searchParams.set('pageSize', String(params.pageSize))
  if (params.search) searchParams.set('search', params.search)
  if (params.action) searchParams.set('action', params.action)
  if (params.resourceType) searchParams.set('resourceType', params.resourceType)
  if (params.actorId) searchParams.set('actorId', String(params.actorId))
  if (params.from) searchParams.set('from', params.from)
  if (params.to) searchParams.set('to', params.to)

  const query = searchParams.toString()
  return query ? `?${query}` : ''
}

export const auditLogsService = {
  list(params: AuditLogsListParams) {
    return apiRequest<AuditLogsListResponse>(`/audit-logs${buildQuery(params)}`)
  },

  getById(id: number) {
    return apiRequest<AuditLogRecord>(`/audit-logs/${id}`)
  },
}