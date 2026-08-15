export type AuditLogListQuery = {
  page?: number
  pageSize?: number
  search?: string
  action?: string
  resourceType?: string
  actorId?: number
  from?: string
  to?: string
}

export type AuditActorSummary = {
  id: number
  uuid: string
  name: string
  email: string
}

export type AuditLogResponse = {
  id: number
  uuid: string
  action: string
  resourceType: string
  resourceId: string | null
  description: string
  metadata: Record<string, unknown> | null
  ipAddress: string | null
  userAgent: string | null
  createdAt: Date
  updatedAt: Date
  actor: AuditActorSummary | null
}