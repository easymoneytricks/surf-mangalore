import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import {
  ActionToolbar,
  DeleteConfirmationDialog,
  EmptyState,
  GenericDataTable,
  GenericListPage,
  PrimaryButton,
  SearchBar,
  SecondaryButton,
  SelectInput,
  StatusBadge,
} from '../../components/admin'
import { eventsService } from '../../services/events.service'
import { type EventEntity, type EventListFilters } from '../../types/events'

const QUICK_FILTERS: Array<{ label: string; value: EventListFilters['quickFilter'] }> = [
  { label: 'All', value: 'all' },
  { label: 'Upcoming', value: 'upcoming' },
  { label: 'Past', value: 'past' },
  { label: 'Featured', value: 'featured' },
  { label: 'Draft', value: 'draft' },
  { label: 'Published', value: 'published' },
  { label: 'Cancelled', value: 'cancelled' },
]

export default function EventsListPage() {
  const navigate = useNavigate()
  const [items, setItems] = useState<EventEntity[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [filters, setFilters] = useState<EventListFilters>({ quickFilter: 'all' })
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [deleteTarget, setDeleteTarget] = useState<EventEntity | null>(null)

  const loadEvents = () => {
    setLoading(true)
    setError(null)

    eventsService
      .list({
        page,
        pageSize,
        search,
        sortBy: 'eventStartsAt',
        sortOrder: 'desc',
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
    const timer = window.setTimeout(loadEvents, 250)
    return () => window.clearTimeout(timer)
  }, [page, pageSize, search, filters])

  const uniqueCategories = useMemo(
    () => [...new Set(items.map((event) => event.category).filter(Boolean) as string[])],
    [items],
  )

  const uniqueInstructors = useMemo(
    () => [...new Set(items.map((event) => event.instructor).filter(Boolean) as string[])],
    [items],
  )

  const selectedNumericIds = selectedIds.map(Number).filter(Number.isFinite)

  const handleBulkPublish = async () => {
    if (!selectedNumericIds.length) {
      return
    }

    await eventsService.patchStatus(selectedNumericIds, 'PUBLISHED')
    setSelectedIds([])
    loadEvents()
  }

  const handleBulkUnpublish = async () => {
    if (!selectedNumericIds.length) {
      return
    }

    await eventsService.patchStatus(selectedNumericIds, 'UNPUBLISHED')
    setSelectedIds([])
    loadEvents()
  }

  const handleBulkDelete = async () => {
    if (!selectedNumericIds.length) {
      return
    }

    await Promise.all(selectedNumericIds.map((id) => eventsService.remove(id)))
    setSelectedIds([])
    loadEvents()
  }

  const handleDuplicate = async (id: number) => {
    await eventsService.duplicate(id)
    loadEvents()
  }

  const handleDelete = async () => {
    if (!deleteTarget) {
      return
    }

    await eventsService.remove(deleteTarget.id)
    setDeleteTarget(null)
    loadEvents()
  }

  return (
    <div className="space-y-6">
      <GenericListPage
        title="Events"
        description="Reference module implementation for complete CMS management lifecycle."
        actions={<PrimaryButton onClick={() => navigate('/events/create')}>Create Event</PrimaryButton>}
        filters={(
          <ActionToolbar>
            <SearchBar value={search} onChange={setSearch} placeholder="Search events, slugs, instructors..." />
            <SelectInput
              label="Quick Filter"
              value={filters.quickFilter}
              onChange={(value) => {
                setPage(1)
                setFilters((prev) => ({ ...prev, quickFilter: value as EventListFilters['quickFilter'] }))
              }}
              options={QUICK_FILTERS}
            />
            <SelectInput
              label="Category"
              value={filters.category || 'all'}
              onChange={(value) => {
                setPage(1)
                setFilters((prev) => ({ ...prev, category: value === 'all' ? undefined : value }))
              }}
              options={[{ label: 'All Categories', value: 'all' }, ...uniqueCategories.map((category) => ({ label: category, value: category }))]}
            />
            <SelectInput
              label="Instructor"
              value={filters.instructor || 'all'}
              onChange={(value) => {
                setPage(1)
                setFilters((prev) => ({ ...prev, instructor: value === 'all' ? undefined : value }))
              }}
              options={[{ label: 'All Instructors', value: 'all' }, ...uniqueInstructors.map((instructor) => ({ label: instructor, value: instructor }))]}
            />
          </ActionToolbar>
        )}
        bulkActions={selectedIds.length ? (
          <ActionToolbar>
            <span className="text-sm text-(--color-text-secondary)">{selectedIds.length} selected</span>
            <SecondaryButton onClick={handleBulkPublish}>Bulk Publish</SecondaryButton>
            <SecondaryButton onClick={handleBulkUnpublish}>Bulk Unpublish</SecondaryButton>
            <SecondaryButton onClick={handleBulkDelete}>Bulk Delete</SecondaryButton>
          </ActionToolbar>
        ) : undefined}
      >

      {error ? <p className="rounded-xl border border-rose-300/40 bg-rose-300/15 px-3 py-2 text-sm text-rose-100">{error}</p> : null}

      {loading ? <p className="text-sm text-(--color-text-secondary)">Loading events...</p> : null}

      {!loading && !items.length ? (
        <EmptyState title="No events found" description="Create your first event to start managing schedules, visibility, and publishing workflows." />
      ) : null}

      {!loading && items.length ? (
        <>
          <GenericDataTable<EventEntity>
            rows={items}
            rowKey={(row) => String(row.id)}
            searchTerm={search}
            searchableText={(row) => `${row.title} ${row.slug} ${row.category || ''} ${row.instructor || ''}`}
            selectable
            pageSize={pageSize}
            onSelectionChange={setSelectedIds}
            rowActions={(row) => (
              <div className="flex flex-wrap gap-1">
                <Link className="rounded-lg border border-white/15 px-2 py-1 text-xs" to={`/events/${row.id}/view`}>View</Link>
                <Link className="rounded-lg border border-white/15 px-2 py-1 text-xs" to={`/events/${row.id}/edit`}>Edit</Link>
                <button type="button" className="rounded-lg border border-white/15 px-2 py-1 text-xs" onClick={() => handleDuplicate(row.id)}>Duplicate</button>
                <button type="button" className="rounded-lg border border-rose-300/40 px-2 py-1 text-xs text-rose-200" onClick={() => setDeleteTarget(row)}>Delete</button>
              </div>
            )}
            columns={[
              { key: 'title', header: 'Title', sortable: true, render: (row) => row.title },
              { key: 'category', header: 'Category', sortable: true, render: (row) => row.category || '-' },
              { key: 'instructor', header: 'Instructor', sortable: true, render: (row) => row.instructor || '-' },
              {
                key: 'status',
                header: 'Status',
                sortable: true,
                render: (row) => <StatusBadge tone={row.status === 'CANCELLED' ? 'danger' : row.publishStatus === 'PUBLISHED' ? 'positive' : 'warning'} label={row.status} />,
              },
              { key: 'startDate', header: 'Start', sortable: true, render: (row) => new Date(row.startDate).toLocaleDateString() },
            ]}
          />

          <div className="text-xs text-(--color-text-secondary)">Server pagination: page {page} of {totalPages}, total {totalItems} events</div>
          <div className="flex items-center justify-end gap-2">
            <SecondaryButton onClick={() => setPage((prev) => Math.max(1, prev - 1))} disabled={page <= 1}>Previous</SecondaryButton>
            <SecondaryButton onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))} disabled={page >= totalPages}>Next</SecondaryButton>
          </div>
        </>
      ) : null}

      <DeleteConfirmationDialog
        isOpen={Boolean(deleteTarget)}
        resourceName={deleteTarget?.title || 'event'}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
      </GenericListPage>
    </div>
  )
}
