import { useEffect, useMemo, useState } from 'react'
import Badge from '../components/Badge'
import Button from '../components/Button'
import Card from '../components/Card'
import { fetchEventBySlug, type EventPublicDetail } from '../services/events.service'
import { navigateTo } from '../utils/navigation'

type EventDetailPageProps = {
  slug: string
}

function formatDateTime(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return 'Date TBD'
  }

  return date.toLocaleString('en-IN', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export default function EventDetailPage({ slug }: EventDetailPageProps) {
  const [event, setEvent] = useState<EventPublicDetail | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    fetchEventBySlug(slug)
      .then((result) => {
        if (!cancelled) {
          setEvent(result)
        }
      })
      .catch((fetchError: Error) => {
        if (!cancelled) {
          setError(fetchError.message)
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [slug])

  const bookingUrl = useMemo(() => {
    if (!event) {
      return '/booking'
    }

    const params = new URLSearchParams({
      bookingType: 'EVENT',
      selectedItemId: String(event.id),
      preferredDate: event.startDate.slice(0, 10),
      preferredTime: event.startTimeLabel || '',
    })

    return `/booking?${params.toString()}`
  }, [event])

  if (loading) {
    return (
      <section className="mx-auto w-full max-w-[var(--container-md)] px-4 py-12 sm:px-6">
        <p className="text-sm text-[var(--color-text-secondary)]">Loading event details...</p>
      </section>
    )
  }

  if (error || !event) {
    return (
      <section className="mx-auto w-full max-w-[var(--container-md)] px-4 py-12 sm:px-6">
        <Card variant="glass" className="border-rose-200/30 p-8 text-center">
          <p className="text-lg font-semibold text-white">Event not found</p>
          <p className="mt-3 text-sm text-[var(--color-text-secondary)]">{error || 'This event may no longer be available.'}</p>
          <Button variant="outline" className="mt-6" onClick={() => navigateTo('/events')}>Back to events</Button>
        </Card>
      </section>
    )
  }

  return (
    <section className="mx-auto w-full max-w-[var(--container-lg)] px-4 py-12 sm:px-6 lg:px-14">
      <div className="grid gap-10 lg:grid-cols-[0.95fr_0.75fr]">
        <div>
          <div className="mb-6 overflow-hidden rounded-[2rem] bg-slate-900 shadow-[0_24px_80px_rgba(0,0,0,0.2)]">
            {event.coverImageUrl ? (
              <img src={event.coverImageUrl} alt={event.title} className="h-[320px] w-full object-cover" />
            ) : (
              <div className="flex h-[320px] items-center justify-center bg-slate-800 text-sm text-[var(--color-text-secondary)]">Event cover unavailable</div>
            )}
          </div>

          <Badge tone="accent">Event</Badge>
          <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">{event.title}</h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-[var(--color-text-secondary)]">{event.fullDescription || event.shortDescription || 'A community-driven surf event designed for connection, progression, and coastal energy.'}</p>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            <Card variant="glass" className="border-white/10 p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-primary)]">Starts</p>
              <p className="mt-3 text-lg font-semibold text-white">{formatDateTime(event.startDate)}</p>
            </Card>
            <Card variant="glass" className="border-white/10 p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-primary)]">Ends</p>
              <p className="mt-3 text-lg font-semibold text-white">{event.endDate ? formatDateTime(event.endDate) : 'Flexible close'}</p>
            </Card>
            <Card variant="glass" className="border-white/10 p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-primary)]">Location</p>
              <p className="mt-3 text-lg font-semibold text-white">{event.location || 'Mangalore coast'}</p>
            </Card>
            <Card variant="glass" className="border-white/10 p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-primary)]">Capacity</p>
              <p className="mt-3 text-lg font-semibold text-white">
                {event.maxParticipants ? `${event.currentParticipants ?? 0}/${event.maxParticipants} guests` : 'Flexible group size'}
              </p>
            </Card>
          </div>
        </div>

        <div className="space-y-6">
          <Card variant="feature" className="border-white/12 p-8">
            <div className="text-sm uppercase tracking-[0.32em] text-[var(--color-primary)]">Reserve your seat</div>
            <p className="mt-4 text-lg font-semibold text-white">Join this event with date and item pre-selected.</p>
            <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)]">Your booking form opens with this event already chosen, including date and time details where available.</p>
            <div className="mt-8 space-y-3">
              {event.price !== undefined ? (
                <div className="rounded-3xl bg-slate-950/80 p-5 text-white">
                  <p className="text-sm uppercase tracking-[0.28em] text-[var(--color-primary)]">Starting price</p>
                  <p className="mt-2 text-3xl font-semibold">{event.currency || 'INR'} {event.price}</p>
                </div>
              ) : null}
              <Button variant="primary" size="lg" className="w-full" onClick={() => navigateTo(bookingUrl)}>
                Book this event
              </Button>
              <Button variant="ghost" className="w-full" onClick={() => navigateTo('/events')}>
                Back to events
              </Button>
            </div>
          </Card>

          <Card variant="glass" className="border-white/10 p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-primary)]">Hosted by</p>
            <p className="mt-3 text-lg font-semibold text-white">{event.instructor || 'Surf Mangalore team'}</p>
            <p className="mt-4 text-sm leading-7 text-[var(--color-text-secondary)]">Category: {event.category || event.eventType || 'Surf event'}</p>
          </Card>
        </div>
      </div>
    </section>
  )
}
