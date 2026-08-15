import { useEffect, useState, type ReactNode } from 'react'
import MainLayout from './layouts/MainLayout'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import BookingPage from './pages/BookingPage'
import EventDetailPage from './pages/EventDetailPage'
import EventsPage from './pages/EventsPage'
import GalleryPage from './pages/GalleryPage'
import HomePage from './pages/HomePage'
import CoachProfilePage from './pages/CoachProfilePage'
import ExperienceDetailPage from './pages/ExperienceDetailPage'
import ExperiencesPage from './pages/ExperiencesPage'
import LessonDetailPage from './pages/LessonDetailPage'
import LessonsPage from './pages/LessonsPage'
import NotFound from './pages/NotFound'

const routeMap: Record<string, ReactNode> = {
  '/': <HomePage />,
  '/about': <AboutPage />,
  '/experiences': <ExperiencesPage />,
  '/booking': <BookingPage />,
  '/lessons': <LessonsPage />,
  '/events': <EventsPage />,
  '/gallery': <GalleryPage />,
  '/contact': <ContactPage />,
}

export default function App() {
  const [pathname, setPathname] = useState(() => {
    if (typeof window === 'undefined') {
      return '/'
    }

    return window.location.pathname
  })

  useEffect(() => {
    const onPopState = () => {
      setPathname(window.location.pathname)
    }

    window.addEventListener('popstate', onPopState)

    return () => {
      window.removeEventListener('popstate', onPopState)
    }
  }, [])

  const navigate = (path: string) => {
    window.history.pushState({}, '', path)
    setPathname(path)
  }

  const lessonMatch = pathname.match(/^\/lessons\/([a-z0-9-]+)$/)
  const experienceMatch = pathname.match(/^\/experiences\/([a-z0-9-]+)$/)
  const eventMatch = pathname.match(/^\/events\/([a-z0-9-]+)$/)
  const coachMatch = pathname.match(/^\/coaches\/([a-z0-9-]+)$/)
  const page = lessonMatch
    ? <LessonDetailPage slug={lessonMatch[1]} />
    : experienceMatch
      ? <ExperienceDetailPage slug={experienceMatch[1]} />
      : eventMatch
        ? <EventDetailPage slug={eventMatch[1]} />
      : coachMatch
        ? <CoachProfilePage slug={coachMatch[1]} />
        : (routeMap[pathname] ?? <NotFound />)

  return <MainLayout currentPath={pathname} navigate={navigate}>{page}</MainLayout>
}
