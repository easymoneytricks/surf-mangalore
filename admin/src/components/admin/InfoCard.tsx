type InfoCardProps = {
  label: string
  value: string
}

export default function InfoCard({ label, value }: InfoCardProps) {
  return (
    <article className="admin-card rounded-2xl p-4">
      <p className="text-xs tracking-[0.1em] text-(--color-text-secondary) uppercase">{label}</p>
      <p className="mt-2 text-xl font-semibold text-(--color-text)">{value}</p>
    </article>
  )
}
