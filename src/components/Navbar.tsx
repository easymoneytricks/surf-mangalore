import { useEffect, useRef, useState } from 'react'
import Button from './Button'
import Logo from './Logo'
import { navigationLinks } from '../constants/navigation'
import { useWebsiteSettings } from '../contexts/WebsiteSettingsContext'

type NavbarProps = {
  currentPath: string
  navigate: (path: string) => void
}

export default function Navbar({ currentPath, navigate }: NavbarProps) {
  const { settings } = useWebsiteSettings()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const openMenuButtonRef = useRef<HTMLButtonElement | null>(null)
  const closeMenuButtonRef = useRef<HTMLButtonElement | null>(null)

  const navLinks = settings.navigation.menuItems
    .filter((item) => item.enabled)
    .sort((a, b) => a.order - b.order)
    .map((item) => ({ to: item.path, label: item.label }))

  const resolvedLinks = navLinks.length ? navLinks : navigationLinks

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 8)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (!isMobileMenuOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false)
      }
    }

    const focusTarget = openMenuButtonRef.current

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)
    queueMicrotask(() => {
      closeMenuButtonRef.current?.focus()
    })

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKeyDown)
      focusTarget?.focus()
    }
  }, [isMobileMenuOpen])

  const handleNavigate = (path: string) => {
    navigate(path)
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'border-b border-white/10 bg-[rgba(4,19,27,0.78)] py-3 shadow-(--shadow-small) backdrop-blur-xl' : 'border-b border-transparent bg-transparent py-5'}`}
      >
        <div className="mx-auto flex max-w-[80rem] items-center justify-between px-6 sm:px-8 lg:px-12">
          <button type="button" onClick={() => handleNavigate('/')} className="rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--color-primary)" aria-label="Go to homepage">
            <Logo />
          </button>

          <nav className="hidden items-center gap-6 lg:flex" aria-label="Primary navigation">
            {resolvedLinks.map((link) => {
              const isActive = currentPath === link.to
              return (
                <button
                  key={link.to}
                  type="button"
                  onClick={() => handleNavigate(link.to)}
                  className={`relative text-sm font-medium transition-all duration-200 ${isActive ? 'text-(--color-primary)' : 'text-(--color-text-secondary) hover:text-(--color-text)'}`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span className="relative after:absolute after:left-0 after:top-[1.15rem] after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-(--color-primary) after:transition-transform after:duration-200 after:content-[''] hover:after:scale-x-100">{link.label}</span>
                </button>
              )
            })}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <Button variant="outline" size="sm" onClick={() => handleNavigate('/contact')}>
              Contact
            </Button>
            <Button variant="primary" size="sm" onClick={() => handleNavigate('/booking')}>
              Book Now <span className="ml-2">→</span>
            </Button>
          </div>

          <button
            ref={openMenuButtonRef}
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/10 text-(--color-text) backdrop-blur-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--color-primary) lg:hidden"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={isMobileMenuOpen}
          >
            <span className="text-lg">☰</span>
          </button>
        </div>
      </header>

      <div className={`fixed inset-0 z-40 bg-[rgba(4,19,27,0.76)] backdrop-blur-sm transition-opacity duration-300 ${isMobileMenuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`} onClick={() => setIsMobileMenuOpen(false)} />

      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-[88vw] max-w-sm flex-col border-l border-white/10 bg-[rgba(4,19,27,0.96)] p-6 shadow-(--shadow-large) transition-transform duration-300 ease-out ${isMobileMenuOpen ? 'pointer-events-auto translate-x-0' : 'pointer-events-none translate-x-full'}`}
        aria-label="Mobile navigation"
        aria-hidden={!isMobileMenuOpen}
      >
        <div className="mb-8 flex items-center justify-between">
          <Logo />
          <button ref={closeMenuButtonRef} type="button" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-(--color-text)" onClick={() => setIsMobileMenuOpen(false)} aria-label="Close navigation menu">
            <span className="text-lg">✕</span>
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-2" aria-label="Mobile navigation links">
          {resolvedLinks.map((link) => {
            const isActive = currentPath === link.to
            return (
              <button
                key={link.to}
                type="button"
                onClick={() => handleNavigate(link.to)}
                className={`rounded-2xl px-4 py-3 text-left text-base transition-all ${isActive ? 'bg-(--color-primary)/12 text-(--color-primary)' : 'text-(--color-text-secondary) hover:bg-white/8 hover:text-(--color-text)'}`}
                aria-current={isActive ? 'page' : undefined}
              >
                {link.label}
              </button>
            )
          })}
        </nav>

        <div className="mt-6 border-t border-white/10 pt-6">
          <Button variant="primary" size="md" onClick={() => handleNavigate('/booking')} className="w-full">
            Book Now <span className="ml-2">→</span>
          </Button>
        </div>
      </aside>
    </>
  )
}
