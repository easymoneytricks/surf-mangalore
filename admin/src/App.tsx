import { Navigate, Route, Routes } from 'react-router-dom'

import AdminLayout from './layouts/AdminLayout'
import BookingsListPage from './pages/bookings/BookingsListPage'
import BookingCreatePage from './pages/bookings/BookingCreatePage'
import BookingViewPage from './pages/bookings/BookingViewPage'
import CoachFormPage from './pages/coaches/CoachFormPage'
import CoachesListPage from './pages/coaches/CoachesListPage'
import CoachViewPage from './pages/coaches/CoachViewPage'
import DashboardPage from './pages/DashboardPage'
import ExperienceFormPage from './pages/experiences/ExperienceFormPage'
import ExperiencesListPage from './pages/experiences/ExperiencesListPage'
import ExperienceViewPage from './pages/experiences/ExperienceViewPage'
import GalleryAlbumsPage from './pages/gallery/GalleryAlbumsPage'
import GalleryFormPage from './pages/gallery/GalleryFormPage'
import GalleryListPage from './pages/gallery/GalleryListPage'
import GalleryViewPage from './pages/gallery/GalleryViewPage'
import EventFormPage from './pages/events/EventFormPage'
import EventsListPage from './pages/events/EventsListPage'
import EventViewPage from './pages/events/EventViewPage'
import LessonFormPage from './pages/lessons/LessonFormPage'
import LessonsListPage from './pages/lessons/LessonsListPage'
import LessonViewPage from './pages/lessons/LessonViewPage'
import MediaLibraryPage from './pages/media/MediaLibraryPage'
import WebsiteSettingsPage from './pages/settings/WebsiteSettingsPage'
import LoginPage from './pages/auth/LoginPage'
import { ProtectedRoute, PublicOnlyRoute } from './routes/AuthRoutes'
import TestimonialsPage from './pages/testimonials/TestimonialsPage'
import FAQsPage from './pages/faqs/FAQsPage'
import ContactMessagesPage from './pages/contact-messages/ContactMessagesPage'
import SEOManagerPage from './pages/seo/SEOManagerPage'
import UsersPage from './pages/users/UsersPage'
import RolesPage from './pages/roles/RolesPage'
import PermissionsPage from './pages/permissions/PermissionsPage'
import AuditLogsPage from './pages/audit-logs/AuditLogsPage'
import PermissionRoute from './routes/PermissionRoute'

export default function App() {
  return (
    <Routes>
      <Route element={<PublicOnlyRoute />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<AdminLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route element={<PermissionRoute permission="dashboard.view" />}>
          <Route path="dashboard" element={<DashboardPage />} />
        </Route>
        <Route path="bookings" element={<BookingsListPage />} />
        <Route element={<PermissionRoute permission="bookings.manage" />}>
          <Route path="bookings/create" element={<BookingCreatePage />} />
        </Route>
        <Route path="bookings/:id/view" element={<BookingViewPage />} />
        <Route path="coaches" element={<CoachesListPage />} />
        <Route path="coaches/create" element={<CoachFormPage mode="create" />} />
        <Route path="coaches/:id/edit" element={<CoachFormPage mode="edit" />} />
        <Route path="coaches/:id/view" element={<CoachViewPage />} />
        <Route path="lessons" element={<LessonsListPage />} />
        <Route path="lessons/create" element={<LessonFormPage mode="create" />} />
        <Route path="lessons/:id/edit" element={<LessonFormPage mode="edit" />} />
        <Route path="lessons/:id/view" element={<LessonViewPage />} />
        <Route path="experiences" element={<ExperiencesListPage />} />
        <Route path="experiences/create" element={<ExperienceFormPage mode="create" />} />
        <Route path="experiences/:id/edit" element={<ExperienceFormPage mode="edit" />} />
        <Route path="experiences/:id/view" element={<ExperienceViewPage />} />
        <Route path="events" element={<EventsListPage />} />
        <Route path="events/create" element={<EventFormPage mode="create" />} />
        <Route path="events/:id/edit" element={<EventFormPage mode="edit" />} />
        <Route path="events/:id/view" element={<EventViewPage />} />
        <Route path="gallery" element={<GalleryListPage />} />
        <Route path="gallery/create" element={<GalleryFormPage mode="create" />} />
        <Route path="gallery/:id/edit" element={<GalleryFormPage mode="edit" />} />
        <Route path="gallery/:id/view" element={<GalleryViewPage />} />
        <Route path="gallery/albums" element={<GalleryAlbumsPage />} />
        <Route path="testimonials" element={<TestimonialsPage />} />
        <Route path="faqs" element={<FAQsPage />} />
        <Route path="media-library" element={<MediaLibraryPage />} />
        <Route path="contact-messages" element={<ContactMessagesPage />} />
        <Route element={<PermissionRoute permission="seo.manage" />}>
          <Route path="seo" element={<SEOManagerPage />} />
        </Route>
        <Route path="settings" element={<WebsiteSettingsPage />} />
        <Route element={<PermissionRoute permission="users.view" />}>
          <Route path="users" element={<UsersPage />} />
        </Route>
        <Route element={<PermissionRoute permission="roles.view" />}>
          <Route path="roles" element={<RolesPage />} />
        </Route>
        <Route element={<PermissionRoute permission="permissions.view" />}>
          <Route path="permissions" element={<PermissionsPage />} />
        </Route>
        <Route element={<PermissionRoute permission="audit-logs.view" />}>
          <Route path="audit-logs" element={<AuditLogsPage />} />
        </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
