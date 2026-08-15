import { type PaginationMeta } from '../types'

export function normalizePagination(page?: number, pageSize?: number) {
  const safePage = Number.isFinite(page) ? Math.max(1, Number(page)) : 1
  const safePageSize = Number.isFinite(pageSize) ? Math.min(100, Math.max(1, Number(pageSize))) : 10

  return {
    page: safePage,
    pageSize: safePageSize,
    skip: (safePage - 1) * safePageSize,
    take: safePageSize,
  }
}

export function buildPaginationMeta(params: { page: number; pageSize: number; totalItems: number }): PaginationMeta {
  return {
    page: params.page,
    pageSize: params.pageSize,
    totalItems: params.totalItems,
    totalPages: Math.max(1, Math.ceil(params.totalItems / params.pageSize)),
  }
}
