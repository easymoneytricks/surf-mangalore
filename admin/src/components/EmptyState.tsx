type EmptyStateProps = {
  title: string
  description: string
}

export default function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="admin-card flex flex-col items-center justify-center gap-3 px-6 py-12 text-center">
      <p className="text-lg font-semibold text-(--color-text)">{title}</p>
      <p className="max-w-lg text-sm text-(--color-text-secondary)">{description}</p>
    </div>
  )
}
