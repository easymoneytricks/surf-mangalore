import { type SortOrder } from '../types'

export function buildSorting<TSort extends string>(params: {
  sortBy: string | undefined
  sortOrder: SortOrder | undefined
  allowedFields: readonly TSort[]
  defaultField: TSort
  defaultOrder?: SortOrder
}) {
  const resolvedField = params.allowedFields.includes(params.sortBy as TSort)
    ? (params.sortBy as TSort)
    : params.defaultField

  const resolvedOrder = params.sortOrder === 'asc' || params.sortOrder === 'desc'
    ? params.sortOrder
    : (params.defaultOrder || 'desc')

  return {
    field: resolvedField,
    order: resolvedOrder,
  }
}
