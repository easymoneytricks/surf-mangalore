type StatusBadgeProps = {
  tone: 'positive' | 'neutral' | 'warning' | 'danger' | 'info'
  label: string
}

const toneClasses: Record<StatusBadgeProps['tone'], string> = {
  positive: 'border-emerald-300/35 bg-emerald-300/16 text-emerald-100',
  neutral: 'border-white/20 bg-white/8 text-slate-100',
  warning: 'border-amber-300/40 bg-amber-300/18 text-amber-100',
  danger: 'border-rose-300/40 bg-rose-300/18 text-rose-100',
  info: 'border-cyan-300/35 bg-cyan-300/14 text-cyan-100',
}

export default function StatusBadge({ tone, label }: StatusBadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold tracking-[0.11em] uppercase ${toneClasses[tone]}`}>
      {label}
    </span>
  )
}
