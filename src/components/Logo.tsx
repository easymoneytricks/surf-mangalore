import { useWebsiteSettings } from '../contexts/WebsiteSettingsContext'

type LogoProps = {
  className?: string
}

export default function Logo({ className = '' }: LogoProps) {
  const { settings } = useWebsiteSettings()
  const websiteName = settings.general.websiteName || 'Surf Mangalore'
  const [firstWord = 'Surf', ...rest] = websiteName.split(' ')
  const secondLine = rest.length ? rest.join(' ') : firstWord

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {settings.general.logoUrl ? (
        <img src={settings.general.logoUrl} alt={websiteName} className="h-10 w-10 rounded-full border border-[var(--color-primary)]/40 object-cover shadow-[var(--shadow-small)]" />
      ) : (
        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-primary)]/40 bg-[var(--color-primary)]/10 shadow-[var(--shadow-small)]">
          <svg viewBox="0 0 24 24" className="h-5 w-5 text-[var(--color-primary)]" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M12 3 4 8v10l8 5 8-5V8l-8-5Z" />
            <path d="M8 11c1.2 1.3 2.5 2 4 2s2.8-.7 4-2" />
          </svg>
        </div>
      )}
      <div className="flex flex-col leading-none">
        <span className="text-[0.72rem] uppercase tracking-[0.35em] text-[var(--color-text-secondary)]">{firstWord}</span>
        <span className="text-sm font-semibold tracking-[0.18em] text-[var(--color-text)]">{secondLine}</span>
      </div>
    </div>
  )
}
