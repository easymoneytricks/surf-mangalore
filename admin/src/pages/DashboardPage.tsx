import { useEffect, useMemo, useState } from 'react'

import {
  ActionToolbar,
  EmptyState,
  GenericDataTable,
  GenericListPage,
  LoadingState,
  SelectInput,
} from '../components/admin'
import { dashboardService } from '../services/dashboard.service'
import { type DashboardOverview, type DashboardRange } from '../types/dashboard'

const RANGE_OPTIONS: Array<{ label: string; value: DashboardRange }> = [
  { label: 'Today', value: 'today' },
  { label: 'Last 7 days', value: '7d' },
  { label: 'Last 30 days', value: '30d' },
  { label: 'Last 90 days', value: '90d' },
]

function formatDateTime(value: string) {
  return new Date(value).toLocaleString()
}

export default function DashboardPage() {
  const [range, setRange] = useState<DashboardRange>('7d')
  const [overview, setOverview] = useState<DashboardOverview | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    setLoading(true)
    setError(null)

    dashboardService.getOverview(range)
      .then((result) => {
        if (!cancelled) {
          setOverview(result)
        }
      })
      .catch((requestError) => {
        if (!cancelled) {
          setError((requestError as Error).message)
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
  }, [range])

  const statCards = useMemo(() => {
    if (!overview) {
      return []
    }

    return [
      { label: 'Bookings', value: overview.stats.totalBookings },
      { label: 'Pending', value: overview.stats.pendingBookings },
      { label: 'Confirmed', value: overview.stats.confirmedBookings },
      { label: 'Completed', value: overview.stats.completedBookings },
      { label: 'Cancelled', value: overview.stats.cancelledBookings },
      { label: 'No-show', value: overview.stats.noShowBookings },
      { label: 'Upcoming events', value: overview.stats.upcomingEvents },
      { label: 'Active lessons', value: overview.stats.activeLessons },
      { label: 'Unread contacts', value: overview.stats.unreadContacts },
    ]
  }, [overview])

  return (
    <GenericListPage
      title="CMS Dashboard"
      description="Production analytics backed by bookings, events, contacts, and audit logs."
      filters={(
        <ActionToolbar>
          <SelectInput label="Range" value={range} onChange={(value) => setRange(value as DashboardRange)} options={RANGE_OPTIONS} />
        </ActionToolbar>
      )}
    >
      {loading ? <LoadingState mode="table" /> : null}
      {error ? <p className="rounded-xl border border-rose-300/40 bg-rose-300/15 px-3 py-2 text-sm text-rose-100">{error}</p> : null}

      {!loading && overview ? (
        <>
          <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {statCards.map((item) => (
              <article key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.12em] text-(--color-text-secondary)">{item.label}</p>
                <p className="mt-2 text-2xl font-semibold text-(--color-text)">{item.value}</p>
              </article>
            ))}
          </section>

          <section className="grid gap-6 xl:grid-cols-2">
            <article className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-(--color-text-secondary)">Recent Bookings</h3>
              {!overview.recentBookings.length ? <EmptyState title="No bookings yet" description="Bookings will appear here once submitted." /> : (
                <GenericDataTable
                  rows={overview.recentBookings}
                  rowKey={(row) => String(row.id)}
                  columns={[
                    { key: 'bookingReference', header: 'Reference', render: (row) => row.bookingReference },
                    { key: 'customerName', header: 'Customer', render: (row) => row.customerName },
                    { key: 'activity', header: 'Activity', render: (row) => row.activity || '-' },
                    { key: 'bookingStatus', header: 'Status', render: (row) => row.bookingStatus },
                    { key: 'createdAt', header: 'Created', render: (row) => formatDateTime(row.createdAt) },
                  ]}
                />
              )}
            </article>

            <article className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-(--color-text-secondary)">Upcoming Event Capacity</h3>
              {!overview.upcomingEventCapacity.length ? <EmptyState title="No upcoming events" description="Publish events to see capacity projections." /> : (
                <GenericDataTable
                  rows={overview.upcomingEventCapacity}
                  rowKey={(row) => String(row.id)}
                  columns={[
                    { key: 'title', header: 'Event', render: (row) => row.title },
                    { key: 'eventDate', header: 'Date', render: (row) => formatDateTime(row.eventDate) },
                    { key: 'capacityMax', header: 'Capacity', render: (row) => row.capacityMax ?? 'Open' },
                    { key: 'currentParticipants', header: 'Booked', render: (row) => row.currentParticipants },
                    { key: 'remainingSpots', header: 'Remaining', render: (row) => row.remainingSpots ?? 'Open' },
                  ]}
                />
              )}
            </article>
          </section>

          <section className="grid gap-6 xl:grid-cols-2">
            <article className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-(--color-text-secondary)">Bookings by Day</h3>
              <GenericDataTable
                rows={overview.charts.bookingsByDay}
                rowKey={(row) => row.date}
                columns={[
                  { key: 'date', header: 'Date', render: (row) => row.date },
                  { key: 'count', header: 'Bookings', render: (row) => row.count },
                ]}
              />
            </article>

            <article className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-(--color-text-secondary)">Recent Activity</h3>
              <GenericDataTable
                rows={overview.recentActivity}
                rowKey={(row) => String(row.id)}
                columns={[
                  { key: 'actorName', header: 'Actor', render: (row) => row.actorName || 'System' },
                  { key: 'action', header: 'Action', render: (row) => row.action },
                  { key: 'resourceType', header: 'Module', render: (row) => row.resourceType },
                  { key: 'description', header: 'Details', render: (row) => row.description },
                  { key: 'createdAt', header: 'At', render: (row) => formatDateTime(row.createdAt) },
                ]}
              />
            </article>
          </section>

          <p className="text-xs text-(--color-text-secondary)">Last refreshed: {formatDateTime(overview.generatedAt)}</p>
        </>
      ) : null}
    </GenericListPage>
  )
}
