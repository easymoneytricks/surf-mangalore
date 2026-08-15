type RevisionInfoCardProps = {
  author?: string
  createdAt?: string
  updatedAt?: string
}

export default function RevisionInfoCard({ author, createdAt, updatedAt }: RevisionInfoCardProps) {
  return (
    <section className="admin-card rounded-2xl p-4">
      <h3 className="text-sm font-semibold text-(--color-text)">Revision Info</h3>
      <dl className="mt-3 space-y-2 text-sm text-(--color-text-secondary)">
        <div className="flex items-center justify-between gap-3">
          <dt>Author</dt>
          <dd>{author || 'System'}</dd>
        </div>
        <div className="flex items-center justify-between gap-3">
          <dt>Created</dt>
          <dd>{createdAt || '-'}</dd>
        </div>
        <div className="flex items-center justify-between gap-3">
          <dt>Updated</dt>
          <dd>{updatedAt || '-'}</dd>
        </div>
      </dl>
    </section>
  )
}
