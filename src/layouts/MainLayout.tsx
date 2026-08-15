import { useEffect, type ReactNode } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SEO from '../components/seo/SEO'

type MainLayoutProps = {
  children: ReactNode
  currentPath: string
  navigate: (path: string) => void
}

export default function MainLayout({ children, currentPath, navigate }: MainLayoutProps) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [currentPath])

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(122,214,209,0.16),transparent_42%)] text-(--color-text)">
      <SEO pathname={currentPath} />
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-(--color-primary) focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-(--color-surface)">
        Skip to main content
      </a>
      <Navbar currentPath={currentPath} navigate={navigate} />
      <main id="main-content" className="mx-auto flex min-h-[calc(100vh-8rem)] w-full max-w-[80rem] flex-col px-6 py-10 sm:px-8 sm:py-12 lg:px-12 lg:py-14">
        <div className="w-full transition-all duration-300 ease-out">{children}</div>
      </main>
      <Footer currentPath={currentPath} navigate={navigate} />
    </div>
  )
}
