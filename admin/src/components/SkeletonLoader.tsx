type SkeletonLoaderProps = {
  lines?: number
}

export default function SkeletonLoader({ lines = 3 }: SkeletonLoaderProps) {
  return (
    <div className="space-y-2" aria-hidden="true">
      {Array.from({ length: lines }).map((_, index) => (
        <div key={index} className="h-4 animate-pulse rounded bg-white/12" />
      ))}
    </div>
  )
}
