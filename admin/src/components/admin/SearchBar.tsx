type SearchBarProps = {
  value: string
  placeholder?: string
  onChange: (value: string) => void
  showLabel?: boolean
}

export default function SearchBar({ value, placeholder = 'Search...', onChange, showLabel = true }: SearchBarProps) {
  return (
    <label className="relative block min-w-[14rem]">
      <span className={showLabel ? 'mb-1 block text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-(--color-text-secondary)' : 'sr-only'}>Search</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-10 w-full rounded-xl border border-white/15 bg-white/6 px-3 text-sm text-(--color-text) placeholder:text-(--color-text-secondary) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-primary)"
      />
    </label>
  )
}
