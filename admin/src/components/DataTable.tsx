import { type ReactNode } from 'react'

type Column<T> = {
  key: string
  header: string
  render: (row: T) => ReactNode
}

type DataTableProps<T> = {
  columns: Column<T>[]
  rows: T[]
  rowKey: (row: T) => string
  emptyState?: ReactNode
}

export default function DataTable<T>({ columns, rows, rowKey, emptyState }: DataTableProps<T>) {
  if (!rows.length) {
    return <>{emptyState || null}</>
  }

  return (
    <div className="overflow-hidden rounded-xl border border-white/10">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-white/10">
          <thead className="bg-white/5">
            <tr>
              {columns.map((column) => (
                <th key={column.key} scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-(--color-text-secondary)">
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/8 bg-transparent">
            {rows.map((row) => (
              <tr key={rowKey(row)} className="hover:bg-white/6">
                {columns.map((column) => (
                  <td key={column.key} className="px-4 py-3 text-sm text-(--color-text)">
                    {column.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
