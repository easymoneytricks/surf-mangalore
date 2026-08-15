import SkeletonTable from './SkeletonTable'

type LoadingStateProps = {
  mode?: 'card' | 'table' | 'form'
}

export default function LoadingState({ mode = 'card' }: LoadingStateProps) {
  if (mode === 'table') {
    return <SkeletonTable rows={5} columns={4} />
  }

  if (mode === 'form') {
    return (
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-10 animate-pulse rounded-xl bg-white/10" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="h-24 animate-pulse rounded-2xl bg-white/10" />
      ))}
    </div>
  )
}
