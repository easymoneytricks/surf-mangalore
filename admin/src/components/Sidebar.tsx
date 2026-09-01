import { NavLink } from 'react-router-dom'

import { sidebarNavigation } from '../constants/navigation'
import { useAuth } from '../contexts/AuthContext'
import { hasPermission } from '../utils/permissions'

type SidebarProps = {
  isCollapsed: boolean
  isMobileOpen: boolean
  onCloseMobile: () => void
}

export default function Sidebar({ isCollapsed, isMobileOpen, onCloseMobile }: SidebarProps) {
  const { user } = useAuth()

  const visibleItems = sidebarNavigation.filter((item) => !item.permission || hasPermission(user?.permissions, item.permission))

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity md:hidden ${isMobileOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
        onClick={onCloseMobile}
        aria-hidden="true"
      />
      <aside
        className={`admin-surface fixed inset-y-0 left-0 z-50 flex w-(--admin-sidebar-width) flex-col rounded-r-2xl p-3 transition-transform duration-300 md:translate-x-0 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} ${isCollapsed ? 'md:w-(--admin-sidebar-collapsed)' : 'md:w-(--admin-sidebar-width)'}`}
        aria-label="Admin sidebar"
      >
        <div className="mb-4 flex items-center gap-3 rounded-xl border border-white/10 bg-white/6 px-3 py-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-(--color-primary)/20 text-sm font-semibold text-(--color-primary)">SM</span>
          {!isCollapsed ? (
            <div>
              <p className="text-sm font-semibold text-(--color-text)">Surf Mangalore</p>
              <p className="text-xs text-(--color-text-secondary)">Admin Panel</p>
            </div>
          ) : null}
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto py-1" aria-label="CMS sections">
          {visibleItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center justify-between rounded-xl px-3 py-2 text-sm transition-all ${isActive ? 'bg-(--color-primary)/16 text-(--color-primary)' : 'text-(--color-text-secondary) hover:bg-white/8 hover:text-(--color-text)'}`
              }
              title={isCollapsed ? item.label : undefined}
            >
              <span>{isCollapsed ? item.label.slice(0, 1) : item.label}</span>
              {!isCollapsed ? <span className="text-xs opacity-60">›</span> : null}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  )
}
