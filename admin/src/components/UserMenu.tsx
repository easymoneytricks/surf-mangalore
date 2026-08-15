export default function UserMenu() {
  return (
    <button type="button" className="flex items-center gap-2 rounded-xl border border-white/12 bg-white/6 px-3 py-2 text-sm text-(--color-text) hover:border-white/24" aria-label="User menu">
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-(--color-primary)/20 text-xs font-semibold text-(--color-primary)">A</span>
      <span className="hidden sm:inline">Admin User</span>
    </button>
  )
}
