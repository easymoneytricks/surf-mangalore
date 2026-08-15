export default function NotFound() {
  return (
    <section className="rounded-[2rem] border border-white/10 bg-slate-900/60 p-10 text-slate-200">
      <h1 className="text-2xl font-semibold text-white">404 · Page not found</h1>
      <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)]">The page you requested does not exist or may have moved.</p>
    </section>
  )
}
