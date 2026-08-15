export default function NoDataIllustration() {
  return (
    <div className="relative mx-auto h-24 w-24" aria-hidden="true">
      <div className="absolute inset-0 rounded-full border border-dashed border-(--color-primary)/45" />
      <div className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-xl bg-(--color-primary)/20" />
    </div>
  )
}
