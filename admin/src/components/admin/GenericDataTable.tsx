import { useMemo, useState, type ReactNode } from 'react'

import Pagination from './Pagination'
import StatusBadge from './StatusBadge'
import TableToolbar from './TableToolbar'

export type GenericTableColumn<T> = {
  key: string
  header: string
  sortable?: boolean
  render: (row: T) => ReactNode
}

type GenericDataTableProps<T> = {
  columns: GenericTableColumn<T>[]
  rows: T[]
  rowKey: (row: T) => string
  searchableText?: (row: T) => string
  searchTerm?: string
  pageSize?: number
  selectable?: boolean
  onSelectionChange?: (selectedIds: string[]) => void
  rowActions?: (row: T) => ReactNode
  serverPaginationHint?: string
  showPagination?: boolean
}

export default function GenericDataTable<T>({
  columns,
  rows,
  rowKey,
  searchableText,
  searchTerm = '',
  pageSize = 8,
  selectable = false,
  onSelectionChange,
  rowActions,
  serverPaginationHint,
  showPagination = false,
}: GenericDataTableProps<T>) {
  const [sortBy, setSortBy] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [page, setPage] = useState(1)
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([])

  const filteredRows = useMemo(() => {
    if (!searchableText || !searchTerm.trim()) {
      return rows
    }

    const normalized = searchTerm.toLowerCase().trim()
    return rows.filter((row) => searchableText(row).toLowerCase().includes(normalized))
  }, [rows, searchTerm, searchableText])

  const sortedRows = useMemo(() => {
    if (!sortBy) {
      return filteredRows
    }

    const column = columns.find((item) => item.key === sortBy)
    if (!column) {
      return filteredRows
    }

    return [...filteredRows].sort((a, b) => {
      const valueA = String(column.render(a))
      const valueB = String(column.render(b))
      const result = valueA.localeCompare(valueB)
      return sortDirection === 'asc' ? result : -result
    })
  }, [filteredRows, sortBy, sortDirection, columns])

  const totalPages = Math.max(1, Math.ceil(sortedRows.length / pageSize))
  const paginatedRows = sortedRows.slice((page - 1) * pageSize, page * pageSize)

  const toggleSort = (columnKey: string) => {
    if (sortBy === columnKey) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))
      return
    }

    setSortBy(columnKey)
    setSortDirection('asc')
  }

  const toggleSelect = (id: string) => {
    const next = selectedRowIds.includes(id)
      ? selectedRowIds.filter((selectedId) => selectedId !== id)
      : [...selectedRowIds, id]

    setSelectedRowIds(next)
    onSelectionChange?.(next)
  }

  return (
    <div className="admin-card rounded-2xl border border-white/10 p-3">
      <TableToolbar>
        <div className="text-xs text-(--color-text-secondary)">{sortedRows.length} items</div>
        {selectedRowIds.length ? <StatusBadge tone="info" label={`${selectedRowIds.length} selected`} /> : null}
      </TableToolbar>

      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="min-w-full text-left">
          <thead className="bg-white/6">
            <tr>
              {selectable ? <th className="w-10 px-3 py-2" /> : null}
              {columns.map((column) => (
                <th key={column.key} className="px-3 py-2 text-xs font-semibold tracking-[0.1em] text-(--color-text-secondary) uppercase">
                  {column.sortable ? (
                    <button type="button" onClick={() => toggleSort(column.key)} className="inline-flex items-center gap-1 hover:text-(--color-text)">
                      {column.header}
                      {sortBy === column.key ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
                    </button>
                  ) : (
                    column.header
                  )}
                </th>
              ))}
              {rowActions ? <th className="px-3 py-2 text-xs font-semibold tracking-[0.1em] text-(--color-text-secondary) uppercase">Actions</th> : null}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/8">
            {paginatedRows.map((row) => {
              const id = rowKey(row)
              return (
                <tr key={id} className="hover:bg-white/6">
                  {selectable ? (
                    <td className="px-3 py-2">
                      <input
                        type="checkbox"
                        checked={selectedRowIds.includes(id)}
                        onChange={() => toggleSelect(id)}
                        aria-label={`Select row ${id}`}
                      />
                    </td>
                  ) : null}
                  {columns.map((column) => (
                    <td key={column.key} className="px-3 py-2 text-sm text-(--color-text)">{column.render(row)}</td>
                  ))}
                  {rowActions ? <td className="px-3 py-2 text-sm text-(--color-text)">{rowActions(row)}</td> : null}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {showPagination ? <Pagination page={page} totalPages={totalPages} onPageChange={setPage} /> : null}
      {serverPaginationHint ? <p className="mt-2 text-xs text-(--color-text-secondary)">{serverPaginationHint}</p> : null}
    </div>
  )
}
