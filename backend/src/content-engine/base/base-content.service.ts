import { HTTP_STATUS } from '../../constants/http'
import { ApiError } from '../../utils/api-error'
import { type BaseListQuery, type PaginatedResult } from '../types'
import { normalizePagination } from '../helpers/pagination.helper'
import { type BaseContentRepository } from './base-content.repository'

type ListBuilderOutput<TWhere, TOrderBy> = {
  where: TWhere
  orderBy: TOrderBy
}

type BaseContentServiceConfig<TRecord, TWhere, TOrderBy, TCreateInput, TUpdateInput, TBulkUpdateInput, TListQuery extends BaseListQuery> = {
  repository: BaseContentRepository<TRecord, TWhere, TOrderBy, TCreateInput, TUpdateInput, TBulkUpdateInput>
  buildListQuery: (query: TListQuery) => ListBuilderOutput<TWhere, TOrderBy>
}

export class BaseContentService<TRecord, TWhere, TOrderBy, TCreateInput, TUpdateInput, TBulkUpdateInput, TListQuery extends BaseListQuery> {
  private readonly repository: BaseContentRepository<TRecord, TWhere, TOrderBy, TCreateInput, TUpdateInput, TBulkUpdateInput>
  private readonly buildListQuery: (query: TListQuery) => ListBuilderOutput<TWhere, TOrderBy>

  constructor(config: BaseContentServiceConfig<TRecord, TWhere, TOrderBy, TCreateInput, TUpdateInput, TBulkUpdateInput, TListQuery>) {
    this.repository = config.repository
    this.buildListQuery = config.buildListQuery
  }

  async list(query: TListQuery): Promise<PaginatedResult<TRecord>> {
    const pagination = normalizePagination(query.page, query.pageSize)
    const listQuery = this.buildListQuery(query)

    return this.repository.listPaginated({
      where: listQuery.where,
      orderBy: listQuery.orderBy,
      page: pagination.page,
      pageSize: pagination.pageSize,
      skip: pagination.skip,
      take: pagination.take,
    })
  }

  async getById(id: number) {
    const entity = await this.repository.findById(id)
    if (!entity) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Content item not found')
    }

    return entity
  }

  async create(input: TCreateInput) {
    return this.repository.create(input)
  }

  async update(id: number, input: TUpdateInput) {
    await this.getById(id)
    return this.repository.update(id, input)
  }

  async remove(id: number, updatedById?: number) {
    await this.getById(id)
    return this.repository.softDelete(id, updatedById)
  }

  async patchMany(ids: number[], input: TBulkUpdateInput) {
    return this.repository.updateMany(ids, input)
  }
}
