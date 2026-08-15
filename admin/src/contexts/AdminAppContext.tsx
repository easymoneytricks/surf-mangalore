import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useAuth } from './AuthContext'
import { readStorage, writeStorage } from '../utils/storage'

export type AdminThemeMode = 'dark' | 'light'

type CurrentUser = {
  id: string | number
  name: string
  email?: string
  role: string
  permissions: string[]
}

type NotificationItem = {
  id: string
  module: string
  title: string
  detail: string
  createdAt: string
  read: boolean
  tone: 'info' | 'success' | 'warning' | 'danger'
}

type AdminAppContextValue = {
  currentUser: CurrentUser
  sidebarCollapsed: boolean
  mobileSidebarOpen: boolean
  theme: AdminThemeMode
  notifications: NotificationItem[]
  unreadNotifications: number
  globalLoading: boolean
  apiCacheEnabled: boolean
  toggleSidebarCollapsed: () => void
  openMobileSidebar: () => void
  closeMobileSidebar: () => void
  toggleTheme: () => void
  markNotificationRead: (id: string) => void
  markAllNotificationsRead: () => void
  setGlobalLoading: (value: boolean) => void
}

const AdminAppContext = createContext<AdminAppContextValue | null>(null)

const THEME_STORAGE_KEY = 'admin_theme_mode_v1'
const NOTIFICATIONS_STORAGE_KEY = 'admin_notifications_v1'

const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n-1',
    module: 'Contact Messages',
    title: '3 new enquiries need review',
    detail: 'Two private lesson requests and one group booking enquiry arrived in the last 30 minutes.',
    createdAt: '2m ago',
    read: false,
    tone: 'info',
  },
  {
    id: 'n-2',
    module: 'Events',
    title: 'Sunrise camp publish approval pending',
    detail: 'Event draft has complete content but awaits final publish confirmation.',
    createdAt: '14m ago',
    read: false,
    tone: 'warning',
  },
  {
    id: 'n-3',
    module: 'Bookings',
    title: 'Weekend slots synced successfully',
    detail: 'Availability sync completed for next 14 days with no conflicts.',
    createdAt: '1h ago',
    read: true,
    tone: 'success',
  },
]

export function AdminAppProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [theme, setTheme] = useState<AdminThemeMode>(() => readStorage<AdminThemeMode>(THEME_STORAGE_KEY, 'dark'))
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => readStorage<NotificationItem[]>(NOTIFICATIONS_STORAGE_KEY, DEFAULT_NOTIFICATIONS))
  const [globalLoading, setGlobalLoading] = useState(false)

  useEffect(() => {
    writeStorage(THEME_STORAGE_KEY, theme)
    document.documentElement.dataset.adminTheme = theme
  }, [theme])

  useEffect(() => {
    writeStorage(NOTIFICATIONS_STORAGE_KEY, notifications)
  }, [notifications])

  const value = useMemo<AdminAppContextValue>(
    () => ({
      currentUser: {
        id: user?.id || 'guest',
        name: user?.name || 'Admin User',
        email: user?.email,
        role: user?.role || 'Super Admin',
        permissions: user?.permissions || [],
      },
      sidebarCollapsed,
      mobileSidebarOpen,
      theme,
      notifications,
      unreadNotifications: notifications.filter((item) => !item.read).length,
      globalLoading,
      apiCacheEnabled: true,
      toggleSidebarCollapsed: () => setSidebarCollapsed((prev) => !prev),
      openMobileSidebar: () => setMobileSidebarOpen(true),
      closeMobileSidebar: () => setMobileSidebarOpen(false),
      toggleTheme: () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark')),
      markNotificationRead: (id) => setNotifications((prev) => prev.map((item) => (item.id === id ? { ...item, read: true } : item))),
      markAllNotificationsRead: () => setNotifications((prev) => prev.map((item) => ({ ...item, read: true }))),
      setGlobalLoading,
    }),
    [sidebarCollapsed, mobileSidebarOpen, theme, notifications, globalLoading, user],
  )

  return (
    <AdminAppContext.Provider value={value}>
      <div data-admin-theme={theme}>{children}</div>
    </AdminAppContext.Provider>
  )
}

export function useAdminApp() {
  const context = useContext(AdminAppContext)
  if (!context) {
    throw new Error('useAdminApp must be used within AdminAppProvider')
  }

  return context
}
