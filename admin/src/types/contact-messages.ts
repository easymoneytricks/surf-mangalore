export type ContactMessageEntity = {
  id: number
  uuid: string
  name: string
  email: string
  phone?: string
  subject?: string
  message: string
  fullName: string
  source: string
  status: 'NEW' | 'READ' | 'REPLIED' | 'ARCHIVED'
  createdAt: string
  updatedAt: string
}

export type ContactMessageListFilters = {
  quickFilter: 'all' | 'new' | 'read' | 'replied' | 'archived'
  status?: 'NEW' | 'READ' | 'REPLIED' | 'ARCHIVED'
}

export type ContactMessageListQuery = {
  page: number
  pageSize: number
  search?: string
  sortBy?: 'createdAt' | 'updatedAt' | 'fullName'
  sortOrder?: 'asc' | 'desc'
  filters: ContactMessageListFilters
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
  status?: 'NEW' | 'READ' | 'REPLIED' | 'ARCHIVED'
  subject?: string
  message?: string
  fullName?: string
  email?: string
  phone?: string
}
