import { type ReactNode } from 'react'

type DetailCardProps = {
  title: string
  children: ReactNode
}

export default function DetailCard({ title, children }: DetailCardProps) {
  return (
    <article className="admin-card rounded-2xl p-4">
      <h3 className="text-sm font-semibold text-(--color-text)">{title}</h3>
      <div className="mt-2 text-sm text-(--color-text-secondary)">{children}</div>
    </article>
  )
}
