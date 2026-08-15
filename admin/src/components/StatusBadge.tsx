type StatusBadgeProps = {
  tone: 'positive' | 'neutral' | 'warning' | 'danger'
  label: string
}

const toneClasses = {
  positive: 'bg-emerald-400/12 text-emerald-200 border-emerald-300/30',
  neutral: 'bg-cyan-300/12 text-cyan-100 border-cyan-200/30',
  warning: 'bg-amber-300/12 text-amber-100 border-amber-200/30',
  danger: 'bg-rose-300/12 text-rose-100 border-rose-200/30',
}

export default function StatusBadge({ tone, label }: StatusBadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium tracking-wide ${toneClasses[tone]}`}>
      {label}
    </span>
  )
}
