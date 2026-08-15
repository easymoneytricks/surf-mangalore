import type { ReactNode } from 'react'

type HeadingProps = {
  as?: 'h1' | 'h2' | 'h3' | 'h4'
  children: ReactNode
  className?: string
}

export default function Heading({ as: Component = 'h2', children, className = '' }: HeadingProps) {
  const base = 'font-[var(--font-heading)] tracking-[var(--letter-tight)] text-[var(--color-text)]'

  return <Component className={`${base} ${className}`}>{children}</Component>
}
