type PaginationProps = {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  return (
    <div className="mt-3 flex items-center justify-end gap-2">
      <button
        type="button"
        onClick={() => onPageChange(Math.max(page - 1, 1))}
        disabled={page <= 1}
        className="rounded-lg border border-white/15 px-3 py-1.5 text-xs text-(--color-text) disabled:opacity-40"
      >
        Previous
      </button>
      <span className="text-xs text-(--color-text-secondary)">Page {page} of {totalPages}</span>
      <button
        type="button"
        onClick={() => onPageChange(Math.min(page + 1, totalPages))}
        disabled={page >= totalPages}
        className="rounded-lg border border-white/15 px-3 py-1.5 text-xs text-(--color-text) disabled:opacity-40"
      >
        Next
      </button>
    </div>
  )
}
