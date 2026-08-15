import { type PaginatedResult } from '../types'
import { buildPaginationMeta } from '../helpers/pagination.helper'

export abstract class BaseContentRepository<TRecord, TWhere, TOrderBy, TCreateInput, TUpdateInput, TBulkUpdateInput> {
  abstract findById(id: number): Promise<TRecord | null>
  abstract findBySlug(slug: string, excludeId?: number): Promise<{ id: number; slug: string } | null>
  abstract listRaw(params: { where: TWhere; orderBy: TOrderBy; skip: number; take: number }): Promise<{ total: number; items: TRecord[] }>
  abstract create(data: TCreateInput): Promise<TRecord>
  abstract update(id: number, data: TUpdateInput): Promise<TRecord>
  abstract updateMany(ids: number[], data: TBulkUpdateInput): Promise<unknown>
  abstract softDelete(id: number, updatedById?: number): Promise<unknown>

  async listPaginated(params: {
    where: TWhere
    orderBy: TOrderBy
    page: number
    pageSize: number
    skip: number
    take: number
  }): Promise<PaginatedResult<TRecord>> {
    const result = await this.listRaw({
      where: params.where,
      orderBy: params.orderBy,
      skip: params.skip,
      take: params.take,
    })

    return {
      items: result.items,
      pagination: buildPaginationMeta({
        page: params.page,
        pageSize: params.pageSize,
        totalItems: result.total,
      }),
    }
  }
}
