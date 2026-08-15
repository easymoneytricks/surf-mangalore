import type { ReactNode } from 'react'

type SectionProps = {
  children: ReactNode
  className?: string
  id?: string
}

export default function Section({ children, className = '', id }: SectionProps) {
  return (
    <section id={id} className={`mx-auto w-full max-w-[var(--container-lg)] px-6 py-16 sm:px-8 lg:px-12 lg:py-24 ${className}`}>
      {children}
    </section>
  )
}
