import type { ReactNode } from 'react'

type CardProps = {
  children: ReactNode
  variant?: 'glass' | 'feature' | 'image' | 'testimonial' | 'pricing'
  className?: string
}

export default function Card({ children, variant = 'glass', className = '' }: CardProps) {
  const variants = {
    glass: 'border border-white/12 bg-[linear-gradient(160deg,rgba(255,255,255,0.1),rgba(255,255,255,0.04))] backdrop-blur-2xl shadow-[0_20px_60px_rgba(4,19,27,0.28)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-primary)]/30 hover:shadow-[0_30px_80px_rgba(4,19,27,0.35)]',
    feature: 'border border-white/12 bg-[linear-gradient(155deg,rgba(20,52,69,0.96),rgba(8,28,40,0.94))] shadow-[0_24px_70px_rgba(4,19,27,0.32)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-primary)]/30 hover:shadow-[0_30px_90px_rgba(4,19,27,0.38)]',
    image: 'overflow-hidden border border-white/12 bg-[var(--color-surface-soft)] shadow-[0_24px_70px_rgba(4,19,27,0.3)] transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_32px_90px_rgba(4,19,27,0.38)]',
    testimonial: 'border border-white/12 bg-[linear-gradient(155deg,rgba(8,28,40,0.95),rgba(17,45,60,0.9))] shadow-[0_20px_60px_rgba(4,19,27,0.28)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-primary)]/30',
    pricing: 'border border-[var(--color-accent)]/30 bg-[var(--color-surface-strong)] shadow-[0_24px_70px_rgba(4,19,27,0.32)] transition-all duration-300 hover:-translate-y-1',
  }

  return <div className={`rounded-[var(--radius-lg)] p-6 ${variants[variant]} ${className}`}>{children}</div>
}
