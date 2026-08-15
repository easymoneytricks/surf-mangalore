import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { DetailCard, PageHeader, SectionCard, SectionHeader, StatusBadge } from '../../components/admin'
import { eventsService } from '../../services/events.service'
import { type EventEntity } from '../../types/events'

export default function EventViewPage() {
  const { id } = useParams()
  const [event, setEvent] = useState<EventEntity | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) {
      return
    }

    eventsService
      .getById(Number(id))
      .then(setEvent)
      .catch((fetchError: Error) => setError(fetchError.message))
  }, [id])

  if (error) {
    return <p className="text-sm text-rose-200">{error}</p>
  }

  if (!event) {
    return <p className="text-sm text-(--color-text-secondary)">Loading event...</p>
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={event.title}
        description={event.shortDescription || 'Event details'}
        actions={<Link className="text-sm text-(--color-primary)" to="/events">Back to Events</Link>}
      />

      <SectionCard>
        <SectionHeader
          title="Event Snapshot"
          actions={<StatusBadge tone={event.featuredEvent ? 'positive' : 'neutral'} label={event.featuredEvent ? 'Featured' : 'Standard'} />}
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <DetailCard title="Slug">{event.slug}</DetailCard>
          <DetailCard title="Status">{event.status}</DetailCard>
          <DetailCard title="Publish">{event.publishStatus}</DetailCard>
          <DetailCard title="Visibility">{event.visibility}</DetailCard>
          <DetailCard title="Category">{event.category || '-'}</DetailCard>
          <DetailCard title="Instructor">{event.instructor || '-'}</DetailCard>
          <DetailCard title="Start Date">{new Date(event.startDate).toLocaleString()}</DetailCard>
          <DetailCard title="End Date">{event.endDate ? new Date(event.endDate).toLocaleString() : '-'}</DetailCard>
          <DetailCard title="Price">{event.price ? `${event.currency} ${event.price}` : '-'}</DetailCard>
          <DetailCard title="Discount">{event.discountPrice ? `${event.currency} ${event.discountPrice}` : '-'}</DetailCard>
          <DetailCard title="Participants">{`${event.currentParticipants}/${event.maxParticipants || 'N/A'}`}</DetailCard>
          <DetailCard title="Registration Deadline">{event.registrationDeadline ? new Date(event.registrationDeadline).toLocaleString() : '-'}</DetailCard>
        </div>
      </SectionCard>

      {event.coverImageUrl ? (
        <SectionCard>
          <SectionHeader title="Cover Image" />
          <img src={event.coverImageUrl} alt={event.title} className="h-72 w-full rounded-xl object-cover" />
        </SectionCard>
      ) : null}
    </div>
  )
}
