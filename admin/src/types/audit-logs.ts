export type AuditLogActor = {
  id: number
  uuid: string
  name: string
  email: string
}

export type AuditLogRecord = {
  id: number
  uuid: string
  action: string
  resourceType: string
  resourceId: string | null
  description: string
  metadata: Record<string, unknown> | null
  ipAddress: string | null
  userAgent: string | null
  createdAt: string
  updatedAt: string
  actor: AuditLogActor | null
}

export type AuditLogsListParams = {
  page?: number
  pageSize?: number
  search?: string
  action?: string
  resourceType?: string
  actorId?: number
  from?: string
  to?: string
}

export type AuditLogsListResponse = {
  items: AuditLogRecord[]
  pagination: {
    page: number
    pageSize: number
    totalItems: number
    totalPages: number
  }
}
