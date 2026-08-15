import { type ReactNode } from 'react'

type ContentHeaderProps = {
  title: string
  description?: string
  actions?: ReactNode
}

export default function ContentHeader({ title, description, actions }: ContentHeaderProps) {
  return (
    <header className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="text-2xl font-semibold tracking-[-0.02em] text-(--color-text)">{title}</h1>
        {description ? <p className="mt-1 text-sm text-(--color-text-secondary)">{description}</p> : null}
      </div>
      {actions}
    </header>
  )
}
