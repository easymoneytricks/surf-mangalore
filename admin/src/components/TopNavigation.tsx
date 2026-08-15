import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { GLOBAL_SEARCH_STATIC_ITEMS } from '../constants/global-search'
import { useAdminApp } from '../contexts/AdminAppContext'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ui/ToastContext'
import { Breadcrumbs, IconButton, SearchBar } from './admin'

type TopNavigationProps = {
  onToggleSidebar: () => void
  onToggleCollapse: () => void
  isCollapsed: boolean
}

export default function TopNavigation({ onToggleSidebar, onToggleCollapse, isCollapsed }: TopNavigationProps) {
  const navigate = useNavigate()
  const { pushToast } = useToast()
  const {
    currentUser,
    notifications,
    unreadNotifications,
    theme,
    toggleTheme,
    markNotificationRead,
    markAllNotificationsRead,
  } = useAdminApp()
  const { logout } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) {
      return GLOBAL_SEARCH_STATIC_ITEMS.slice(0, 8)
    }

    const q = searchTerm.toLowerCase()
    return GLOBAL_SEARCH_STATIC_ITEMS
      .filter((item) => `${item.title} ${item.subtitle} ${item.keywords.join(' ')}`.toLowerCase().includes(q))
      .slice(0, 10)
  }, [searchTerm])

  const handleNavigate = (path: string) => {
    navigate(path)
    setSearchOpen(false)
    setNotificationsOpen(false)
    setUserMenuOpen(false)
  }

  const handleLogout = () => {
    void logout().finally(() => {
      navigate('/login', { replace: true })
      pushToast('Logged out successfully', 'info')
    })
  }

  return (
    <header className="admin-surface sticky top-0 z-30 mb-6 flex min-h-(--admin-topbar-height) items-center justify-between gap-3 rounded-2xl px-3 py-2 sm:px-4">
      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="rounded-lg border border-white/12 bg-white/8 px-2 py-1.5 text-sm text-(--color-text-secondary) hover:text-(--color-text) md:hidden"
          aria-label="Open sidebar"
        >
          Menu
        </button>
        <button
          type="button"
          onClick={onToggleCollapse}
          className="hidden rounded-lg border border-white/12 bg-white/8 px-2 py-1.5 text-sm text-(--color-text-secondary) hover:text-(--color-text) md:block"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? 'Expand' : 'Collapse'}
        </button>
        <div className="min-w-0">
          <Breadcrumbs />
        </div>
      </div>

      <div className="relative flex items-center gap-2">
        <div className="relative hidden lg:block">
          <SearchBar
            value={searchTerm}
            onChange={(value) => {
              setSearchTerm(value)
              setSearchOpen(true)
            }}
            placeholder="Global CMS search"
          />
          {searchOpen ? (
            <div className="absolute right-0 top-12 z-[60] w-[26rem] max-w-[88vw] rounded-2xl border border-white/15 bg-[var(--color-surface)] p-2 shadow-xl">
              <div className="mb-1 px-2 py-1 text-xs uppercase tracking-[0.12em] text-(--color-text-secondary)">Search Results</div>
              {searchResults.length ? (
                <div className="max-h-80 space-y-1 overflow-y-auto">
                  {searchResults.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleNavigate(item.path)}
                      className="w-full rounded-xl border border-transparent px-3 py-2 text-left hover:border-white/15 hover:bg-white/8"
                    >
                      <p className="text-sm font-medium text-(--color-text)">{item.title}</p>
                      <p className="text-xs text-(--color-text-secondary)">{item.subtitle}</p>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="rounded-xl px-3 py-3 text-sm text-(--color-text-secondary)">No results found.</p>
              )}
              <div className="mt-1 flex justify-end">
                <button type="button" className="rounded-lg px-2 py-1 text-xs text-(--color-text-secondary) hover:text-(--color-text)" onClick={() => setSearchOpen(false)}>
                  Close
                </button>
              </div>
            </div>
          ) : null}
        </div>
        <div className="relative">
          <IconButton
            icon="🔔"
            label="Notifications"
            onClick={() => {
              setNotificationsOpen((prev) => !prev)
              setUserMenuOpen(false)
              setSearchOpen(false)
            }}
          />
          <span className="absolute -right-1 -top-1 rounded-full bg-(--color-accent) px-1.5 py-0.5 text-[10px] font-semibold text-black">
            {unreadNotifications}
          </span>

          {notificationsOpen ? (
            <div className="absolute right-0 top-11 z-[60] w-[23rem] max-w-[88vw] rounded-2xl border border-white/15 bg-[var(--color-surface)] p-3 shadow-xl">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-semibold text-(--color-text)">Notifications</p>
                <button
                  type="button"
                  className="text-xs text-(--color-primary) hover:underline"
                  onClick={() => {
                    markAllNotificationsRead()
                    pushToast('All notifications marked as read', 'success')
                  }}
                >
                  Mark all as read
                </button>
              </div>
              <div className="max-h-80 space-y-2 overflow-y-auto">
                {notifications.map((item) => (
                  <article key={item.id} className={`rounded-xl border px-3 py-2 ${item.read ? 'border-white/10 bg-white/4' : 'border-cyan-300/30 bg-cyan-300/8'}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium text-(--color-text)">{item.title}</p>
                        <p className="text-xs text-(--color-text-secondary)">{item.module} • {item.createdAt}</p>
                      </div>
                      {!item.read ? <span className="mt-1 h-2.5 w-2.5 rounded-full bg-(--color-primary)" /> : null}
                    </div>
                    <p className="mt-1 text-xs leading-6 text-(--color-text-secondary)">{item.detail}</p>
                    {!item.read ? (
                      <button
                        type="button"
                        className="mt-1 text-xs text-(--color-primary) hover:underline"
                        onClick={() => {
                          markNotificationRead(item.id)
                          pushToast('Notification marked as read', 'success')
                        }}
                      >
                        Mark as read
                      </button>
                    ) : null}
                  </article>
                ))}
              </div>
            </div>
          ) : null}
        </div>
        <button type="button" onClick={toggleTheme} className="rounded-xl border border-white/12 bg-white/6 px-3 py-2 text-sm text-(--color-text-secondary) hover:text-(--color-text)" aria-label="Toggle theme">
          {theme === 'dark' ? 'Dark' : 'Light'}
        </button>
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setUserMenuOpen((prev) => !prev)
              setNotificationsOpen(false)
              setSearchOpen(false)
            }}
            className="rounded-xl border border-white/12 bg-white/6 px-3 py-2 text-sm text-(--color-text)"
            aria-label="User menu"
          >
            {currentUser.name}
          </button>

          {userMenuOpen ? (
            <div className="absolute right-0 top-11 z-[60] w-44 rounded-xl border border-white/15 bg-[var(--color-surface)] p-1.5 shadow-xl">
              <button type="button" onClick={() => { pushToast('Profile view opened', 'info'); setUserMenuOpen(false) }} className="w-full rounded-lg px-3 py-2 text-left text-sm text-(--color-text) hover:bg-white/8">Profile</button>
              <button type="button" onClick={() => handleNavigate('/settings')} className="w-full rounded-lg px-3 py-2 text-left text-sm text-(--color-text) hover:bg-white/8">Settings</button>
              <button type="button" onClick={handleLogout} className="w-full rounded-lg px-3 py-2 text-left text-sm text-rose-200 hover:bg-rose-400/10">Logout</button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  )
}
