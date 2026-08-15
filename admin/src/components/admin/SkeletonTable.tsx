type SkeletonTableProps = {
  rows?: number
  columns?: number
}

export default function SkeletonTable({ rows = 4, columns = 4 }: SkeletonTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10">
      <div className="divide-y divide-white/10">
        {Array.from({ length: rows + 1 }).map((_, rowIndex) => (
          <div key={rowIndex} className="grid gap-3 px-4 py-3" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
            {Array.from({ length: columns }).map((_, cellIndex) => (
              <div key={cellIndex} className="h-4 animate-pulse rounded bg-white/10" />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
