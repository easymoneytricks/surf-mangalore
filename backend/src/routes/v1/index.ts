import { Router } from 'express'

import { authRouter } from './auth.routes'
import { bookingsRouter } from './bookings.routes'
import { coachesRouter } from './coaches.routes'
import { contactMessagesRouter } from './contact-messages.routes'
import { dashboardRouter } from './dashboard.routes'
import { eventsRouter } from './events.routes'
import { experiencesRouter } from './experiences.routes'
import { faqsRouter } from './faqs.routes'
import { galleryRouter } from './gallery.routes'
import { healthRouter } from './health.routes'
import { lessonsRouter } from './lessons.routes'
import { mediaRouter } from './media.routes'
import { seoRouter } from './seo.routes'
import { settingsRouter } from './settings.routes'
import { permissionsRouter } from './permissions.routes'
import { rolesRouter } from './roles.routes'
import { auditLogsRouter } from './audit-logs.routes'
import { testimonialsRouter } from './testimonials.routes'
import { usersRouter } from './users.routes'

const v1Router = Router()

v1Router.use('/health', healthRouter)
v1Router.use('/auth', authRouter)
v1Router.use('/dashboard', dashboardRouter)
v1Router.use('/bookings', bookingsRouter)
v1Router.use('/coaches', coachesRouter)
v1Router.use('/events', eventsRouter)
v1Router.use('/experiences', experiencesRouter)
v1Router.use('/faqs', faqsRouter)
v1Router.use('/gallery', galleryRouter)
v1Router.use('/lessons', lessonsRouter)
v1Router.use('/media', mediaRouter)
v1Router.use('/settings', settingsRouter)
v1Router.use('/permissions', permissionsRouter)
v1Router.use('/roles', rolesRouter)
v1Router.use('/audit-logs', auditLogsRouter)
v1Router.use('/testimonials', testimonialsRouter)
v1Router.use('/contact-messages', contactMessagesRouter)
v1Router.use('/seo', seoRouter)
v1Router.use('/users', usersRouter)

export { v1Router }
