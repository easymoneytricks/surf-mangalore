import { type ReactNode } from 'react'

type PageHeaderProps = {
  title: string
  description: string
  actions?: ReactNode
}

export default function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-[-0.02em] text-(--color-text) sm:text-3xl">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm text-(--color-text-secondary)">{description}</p>
      </div>
      {actions}
    </div>
  )
}
