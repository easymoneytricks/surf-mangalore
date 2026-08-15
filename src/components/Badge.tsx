type BadgeProps = {
  children: React.ReactNode
  tone?: 'accent' | 'muted' | 'success' | 'warning' | 'danger'
  className?: string
}

export default function Badge({ children, tone = 'accent', className = '' }: BadgeProps) {
  const tones = {
    accent: 'bg-[var(--color-accent-soft)] text-[var(--color-accent)]',
    muted: 'bg-white/8 text-[var(--color-text-muted)]',
    success: 'bg-emerald-500/12 text-emerald-300',
    warning: 'bg-amber-500/12 text-amber-300',
    danger: 'bg-rose-500/12 text-rose-300',
  }

  return <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] ${tones[tone]} ${className}`}>{children}</span>
}
