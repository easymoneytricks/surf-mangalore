import { Outlet } from 'react-router-dom'

import Sidebar from '../components/Sidebar'
import TopNavigation from '../components/TopNavigation'
import { useAdminApp } from '../contexts/AdminAppContext'
import { LoadingState, PageContainer } from '../components/admin'

export default function AdminLayout() {
  const {
    sidebarCollapsed,
    mobileSidebarOpen,
    closeMobileSidebar,
    openMobileSidebar,
    toggleSidebarCollapsed,
    globalLoading,
  } = useAdminApp()

  return (
    <div className="min-h-screen px-3 py-3 sm:px-4 sm:py-4">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-60 focus:rounded-full focus:bg-(--color-primary) focus:px-4 focus:py-2 focus:text-(--color-surface)">
        Skip to content
      </a>

      <Sidebar isCollapsed={sidebarCollapsed} isMobileOpen={mobileSidebarOpen} onCloseMobile={closeMobileSidebar} />

      <div
        className="ml-0 transition-all duration-300 md:ml-(--sidebar-offset)"
        style={{
          ['--sidebar-offset' as string]: sidebarCollapsed ? 'var(--admin-sidebar-collapsed)' : 'var(--admin-sidebar-width)',
        }}
      >
        <TopNavigation
          onToggleSidebar={openMobileSidebar}
          onToggleCollapse={toggleSidebarCollapsed}
          isCollapsed={sidebarCollapsed}
        />

        <main id="main-content" className="pb-8">
          <PageContainer>
            {globalLoading ? <LoadingState mode="card" /> : <Outlet />}
          </PageContainer>
        </main>
      </div>
    </div>
  )
}
