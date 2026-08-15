import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import {
  ActionToolbar,
  EmptyState,
  GenericDataTable,
  GenericListPage,
  PrimaryButton,
  SearchBar,
  SecondaryButton,
  SelectInput,
  StatusBadge,
  TextInput,
} from '../../components/admin'
import { useAuth } from '../../contexts/AuthContext'
import { useToast } from '../../contexts/ui/ToastContext'
import { bookingsService } from '../../services/bookings.service'
import { type BookableOption, type BookingEntity, type BookingListFilters } from '../../types/bookings'
import { hasPermission } from '../../utils/permissions'

const QUICK_FILTERS: Array<{ label: string; value: BookingListFilters['quickFilter'] }> = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
  { label: 'Rejected', value: 'rejected' },
  { label: 'No Show', value: 'no_show' },
]

export default function BookingsListPage() {
  const { user } = useAuth()
  const { pushToast } = useToast()
  const navigate = useNavigate()
  const [items, setItems] = useState<BookingEntity[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [filters, setFilters] = useState<BookingListFilters>({ quickFilter: 'all' })
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc')
  const [bookableOptions, setBookableOptions] = useState<{ lessons: BookableOption[]; experiences: BookableOption[]; events: BookableOption[] } | null>(null)

  const loadBookings = () => {
    setLoading(true)
    setError(null)

    bookingsService
      .list({
        page,
        pageSize,
        search,
        sortBy: 'bookingDate',
        sortOrder,
        filters,
      })
      .then((result) => {
        setItems(result.items)
        setTotalPages(result.pagination.totalPages)
        setTotalItems(result.pagination.totalItems)
      })
      .catch((fetchError: Error) => setError(fetchError.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    bookingsService.listOptions().then(setBookableOptions).catch(() => undefined)
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(loadBookings, 250)
    return () => window.clearTimeout(timer)
  }, [page, pageSize, search, filters, sortOrder])

  const lessonOptions = useMemo(() => [
    { label: 'All Lessons', value: 'all' },
    ...(bookableOptions?.lessons ?? []).map((item) => ({ label: item.title, value: String(item.id) })),
  ], [bookableOptions])

  const experienceOptions = useMemo(() => [
    { label: 'All Experiences', value: 'all' },
    ...(bookableOptions?.experiences ?? []).map((item) => ({ label: item.title, value: String(item.id) })),
  ], [bookableOptions])

  const eventOptions = useMemo(() => [
    { label: 'All Events', value: 'all' },
    ...(bookableOptions?.events ?? []).map((item) => ({ label: item.title, value: String(item.id) })),
  ], [bookableOptions])

  const handleExport = () => {
    pushToast(`Export prepared for ${items.length} bookings on current page`, 'info')
  }

  const canCreateBooking = hasPermission(user?.permissions, 'bookings.manage')

  return (
    <div className="space-y-6">
      <GenericListPage
        title="Bookings"
        description="Manage customer booking requests, scheduling, and status workflows."
        actions={(
          <div className="flex flex-wrap gap-2">
            {canCreateBooking ? <PrimaryButton onClick={() => navigate('/bookings/create')}>Create Booking</PrimaryButton> : null}
            <PrimaryButton onClick={handleExport}>Export Bookings</PrimaryButton>
          </div>
        )}
        filters={(
          <ActionToolbar>
            <SearchBar value={search} onChange={setSearch} placeholder="Search customer, email, phone, item..." />
            <SelectInput
              label="Quick Filter"
              value={filters.quickFilter}
              onChange={(value) => {
                setPage(1)
                setFilters((prev) => ({ ...prev, quickFilter: value as BookingListFilters['quickFilter'] }))
              }}
              options={QUICK_FILTERS}
            />
            <SelectInput
              label="Type"
              value={filters.bookingType || 'all'}
              onChange={(value) => {
                setPage(1)
                setFilters((prev) => ({ ...prev, bookingType: value === 'all' ? undefined : value as BookingListFilters['bookingType'] }))
              }}
              options={[
                { label: 'All Types', value: 'all' },
                { label: 'Lesson', value: 'LESSON' },
                { label: 'Experience', value: 'EXPERIENCE' },
                { label: 'Event', value: 'EVENT' },
              ]}
            />
            <SelectInput
              label="Event"
              value={filters.eventId ? String(filters.eventId) : 'all'}
              onChange={(value) => {
                setPage(1)
                setFilters((prev) => ({ ...prev, eventId: value === 'all' ? undefined : Number(value) }))
              }}
              options={eventOptions}
            />
            <SelectInput
              label="Lesson"
              value={filters.lessonId ? String(filters.lessonId) : 'all'}
              onChange={(value) => {
                setPage(1)
                setFilters((prev) => ({ ...prev, lessonId: value === 'all' ? undefined : Number(value) }))
              }}
              options={lessonOptions}
            />
            <SelectInput
              label="Experience"
              value={filters.experienceId ? String(filters.experienceId) : 'all'}
              onChange={(value) => {
                setPage(1)
                setFilters((prev) => ({ ...prev, experienceId: value === 'all' ? undefined : Number(value) }))
              }}
              options={experienceOptions}
            />
            <TextInput
              label="Instructor"
              value={filters.instructor || ''}
              onChange={(event) => {
                setPage(1)
                setFilters((prev) => ({ ...prev, instructor: event.target.value || undefined }))
              }}
            />
            <TextInput
              label="From Date"
              type="date"
              value={filters.fromDate || ''}
              onChange={(event) => {
                setPage(1)
                setFilters((prev) => ({ ...prev, fromDate: event.target.value || undefined }))
              }}
            />
            <TextInput
              label="To Date"
              type="date"
              value={filters.toDate || ''}
              onChange={(event) => {
                setPage(1)
                setFilters((prev) => ({ ...prev, toDate: event.target.value || undefined }))
              }}
            />
            <SelectInput
              label="Sort"
              value={sortOrder}
              onChange={(value) => {
                setPage(1)
                setSortOrder(value as 'asc' | 'desc')
              }}
              options={[
                { label: 'Newest', value: 'desc' },
                { label: 'Oldest', value: 'asc' },
              ]}
            />
          </ActionToolbar>
        )}
      >
        {error ? <p className="rounded-xl border border-rose-300/40 bg-rose-300/15 px-3 py-2 text-sm text-rose-100">{error}</p> : null}
        {loading ? <p className="text-sm text-(--color-text-secondary)">Loading bookings...</p> : null}

        {!loading && !items.length ? (
          <EmptyState title="No bookings found" description="Booking requests from the public website will appear here." />
        ) : null}

        {!loading && items.length ? (
          <>
            <GenericDataTable<BookingEntity>
              rows={items}
              rowKey={(row) => String(row.id)}
              searchTerm={search}
              searchableText={(row) => `${row.bookingReference} ${row.customer.name} ${row.customer.email} ${row.selectedItem?.title || ''}`}
              pageSize={pageSize}
              rowActions={(row) => (
                <div className="flex flex-wrap gap-1">
                  <Link className="rounded-lg border border-white/15 px-2 py-1 text-xs" to={`/bookings/${row.id}/view`}>View</Link>
                  <button type="button" className="rounded-lg border border-white/15 px-2 py-1 text-xs" onClick={() => navigate(`/bookings/${row.id}/view`)}>Manage</button>
                </div>
              )}
              columns={[
                { key: 'bookingReference', header: 'Booking ID', sortable: true, render: (row) => row.bookingReference },
                { key: 'customer', header: 'Customer', sortable: true, render: (row) => row.customer.name },
                { key: 'type', header: 'Type', sortable: true, render: (row) => row.bookingType },
                { key: 'selectedItem', header: 'Selected Item', sortable: true, render: (row) => row.selectedItem?.title || '-' },
                { key: 'bookingDate', header: 'Booking Date', sortable: true, render: (row) => new Date(row.bookingDate).toISOString().slice(0, 10) },
                {
                  key: 'status',
                  header: 'Status',
                  sortable: true,
                  render: (row) => <StatusBadge tone={row.bookingStatus === 'CONFIRMED' || row.bookingStatus === 'COMPLETED' ? 'positive' : row.bookingStatus === 'PENDING' ? 'warning' : 'neutral'} label={row.bookingStatus} />,
                },
                { key: 'createdAt', header: 'Created At', sortable: true, render: (row) => new Date(row.createdAt).toLocaleString() },
              ]}
            />

            <div className="text-xs text-(--color-text-secondary)">Server pagination: page {page} of {totalPages}, total {totalItems} bookings</div>
            <div className="flex items-center justify-end gap-2">
              <SecondaryButton onClick={() => setPage((prev) => Math.max(1, prev - 1))} disabled={page <= 1}>Previous</SecondaryButton>
              <SecondaryButton onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))} disabled={page >= totalPages}>Next</SecondaryButton>
            </div>
          </>
        ) : null}
      </GenericListPage>
    </div>
  )
}
