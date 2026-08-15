export type ContactMessageStatusValue = 'NEW' | 'IN_REVIEW' | 'RESOLVED' | 'SPAM' | 'ARCHIVED'
export type ContactMessageDatabaseStatusValue = 'NEW' | 'IN_REVIEW' | 'RESOLVED' | 'SPAM' | 'ARCHIVED'

export type ContactMessageListFilters = {
  quickFilter: 'all' | 'new' | 'read' | 'replied' | 'archived'
  status?: ContactMessageStatusValue
}

export type ContactMessageListQuery = {
  page: number
  pageSize: number
  search?: string
  sortBy?: 'createdAt' | 'updatedAt' | 'fullName'
  sortOrder?: 'asc' | 'desc'
  quickFilter: 'all' | 'new' | 'read' | 'replied' | 'archived'
  status?: ContactMessageStatusValue
}

export type ContactMessageCreateInput = {
  name: string
  email: string
  phone?: string
  subject?: string
  message: string
  source?: string
}

export type ContactMessageUpdateInput = {
  status?: ContactMessageStatusValue | ContactMessageDatabaseStatusValue
  subject?: string
  message?: string
  fullName?: string
  email?: string
  phone?: string
}
