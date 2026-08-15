import { type ReactNode } from 'react'

type SectionHeaderProps = {
  title: string
  subtitle?: string
  actions?: ReactNode
}

export default function SectionHeader({ title, subtitle, actions }: SectionHeaderProps) {
  return (
    <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h2 className="text-lg font-semibold text-(--color-text)">{title}</h2>
        {subtitle ? <p className="mt-1 text-sm text-(--color-text-secondary)">{subtitle}</p> : null}
      </div>
      {actions}
    </div>
  )
}
