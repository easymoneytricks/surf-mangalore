import { type ReactNode } from 'react'

type FormSectionProps = {
  title: string
  description?: string
  children: ReactNode
}

export default function FormSection({ title, description, children }: FormSectionProps) {
  return (
    <section className="space-y-3">
      <div>
        <h3 className="text-sm font-semibold text-(--color-text)">{title}</h3>
        {description ? <p className="text-xs text-(--color-text-secondary)">{description}</p> : null}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">{children}</div>
    </section>
  )
}
