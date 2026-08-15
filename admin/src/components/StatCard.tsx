import StatusBadge from './StatusBadge'

type StatCardProps = {
  title: string
  value: string
  delta: string
  tone: 'positive' | 'neutral' | 'warning'
}

export default function StatCard({ title, value, delta, tone }: StatCardProps) {
  return (
    <article className="admin-card p-5">
      <div className="mb-4 flex items-start justify-between gap-4">
        <p className="text-sm font-medium text-(--color-text-secondary)">{title}</p>
        <StatusBadge tone={tone} label={tone === 'positive' ? 'Healthy' : tone === 'warning' ? 'Attention' : 'Stable'} />
      </div>
      <p className="text-3xl font-semibold tracking-[-0.02em] text-(--color-text)">{value}</p>
      <p className="mt-2 text-sm text-(--color-text-secondary)">{delta}</p>
    </article>
  )
}
