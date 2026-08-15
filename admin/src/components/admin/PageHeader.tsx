import { type ReactNode } from 'react'

type PageHeaderProps = {
  title: string
  description?: string
  actions?: ReactNode
}

export default function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <header className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-[-0.02em] text-(--color-text) sm:text-3xl">{title}</h1>
        {description ? <p className="mt-2 max-w-3xl text-sm text-(--color-text-secondary)">{description}</p> : null}
      </div>
      {actions}
    </header>
  )
}
