import { type ReactNode } from 'react'

type SectionCardProps = {
  title: string
  subtitle?: string
  actions?: ReactNode
  children: ReactNode
}

export default function SectionCard({ title, subtitle, actions, children }: SectionCardProps) {
  return (
    <section className="admin-card p-5 sm:p-6">
      <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-(--color-text)">{title}</h2>
          {subtitle ? <p className="mt-1 text-sm text-(--color-text-secondary)">{subtitle}</p> : null}
        </div>
        {actions}
      </header>
      {children}
    </section>
  )
}
