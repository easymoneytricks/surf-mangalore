import NoDataIllustration from './NoDataIllustration'

type EmptyStateProps = {
  title: string
  description: string
}

export default function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="admin-card flex flex-col items-center gap-3 rounded-2xl px-6 py-10 text-center">
      <NoDataIllustration />
      <h3 className="text-lg font-semibold text-(--color-text)">{title}</h3>
      <p className="max-w-lg text-sm text-(--color-text-secondary)">{description}</p>
    </div>
  )
}
