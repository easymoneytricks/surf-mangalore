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
import { coachesService } from '../../services/coaches.service'
import { type CoachEntity, type CoachListFilters } from '../../types/coaches'
import { getPublicSiteBaseUrl } from '../../config/runtime'

const PUBLIC_SITE_BASE_URL = getPublicSiteBaseUrl()

const QUICK_FILTERS: Array<{ label: string; value: CoachListFilters['quickFilter'] }> = [
  { label: 'All', value: 'all' },
  { label: 'Featured', value: 'featured' },
  { label: 'Draft', value: 'draft' },
  { label: 'Published', value: 'published' },
]

export default function CoachesListPage() {
  const navigate = useNavigate()
  const [items, setItems] = useState<CoachEntity[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [filters, setFilters] = useState<CoachListFilters>({ quickFilter: 'all' })
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [deleteTarget, setDeleteTarget] = useState<CoachEntity | null>(null)
  const [mutating, setMutating] = useState(false)

  const loadCoaches = () => {
    setLoading(true)
    setError(null)

    coachesService
      .list({
        page,
        pageSize,
        search,
        sortBy: 'displayOrder',
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
    const timer = window.setTimeout(loadCoaches, 250)
    return () => window.clearTimeout(timer)
  }, [page, pageSize, search, filters])

  const uniqueStatuses = useMemo(
    () => [...new Set(items.map((coach) => coach.status).filter(Boolean) as string[])],
    [items],
  )

  const selectedNumericIds = selectedIds.map(Number).filter(Number.isFinite)

  const handleBulkActivate = async () => {
    if (!selectedNumericIds.length) {
      return
    }

    setMutating(true)
    try {
      await Promise.all(selectedNumericIds.map((id) => coachesService.update(id, { status: 'active' })))
      setSelectedIds([])
      loadCoaches()
    } finally {
      setMutating(false)
    }
  }

  const handleBulkDeactivate = async () => {
    if (!selectedNumericIds.length) {
      return
    }

    setMutating(true)
    try {
      await Promise.all(selectedNumericIds.map((id) => coachesService.update(id, { status: 'inactive' })))
      setSelectedIds([])
      loadCoaches()
    } finally {
      setMutating(false)
    }
  }

  const handleActivate = async (id: number) => {
    setMutating(true)
    try {
      await coachesService.update(id, { status: 'active' })
      loadCoaches()
    } finally {
      setMutating(false)
    }
  }

  const handleDeactivate = async (id: number) => {
    setMutating(true)
    try {
      await coachesService.update(id, { status: 'inactive' })
      loadCoaches()
    } finally {
      setMutating(false)
    }
  }

  const handleBulkPublish = async () => {
    if (!selectedNumericIds.length) {
      return
    }

    setMutating(true)
    try {
      await coachesService.patchStatus(selectedNumericIds, 'PUBLISHED')
      setSelectedIds([])
      loadCoaches()
    } finally {
      setMutating(false)
    }
  }

  const handleBulkDraft = async () => {
    if (!selectedNumericIds.length) {
      return
    }

    setMutating(true)
    try {
      await coachesService.patchStatus(selectedNumericIds, 'DRAFT')
      setSelectedIds([])
      loadCoaches()
    } finally {
      setMutating(false)
    }
  }

  const handleBulkFeature = async () => {
    if (!selectedNumericIds.length) {
      return
    }

    setMutating(true)
    try {
      await coachesService.patchFeatured(selectedNumericIds, true)
      setSelectedIds([])
      loadCoaches()
    } finally {
      setMutating(false)
    }
  }

  const handleBulkDelete = async () => {
    if (!selectedNumericIds.length) {
      return
    }

    setMutating(true)
    try {
      await Promise.all(selectedNumericIds.map((id) => coachesService.remove(id)))
      setSelectedIds([])
      loadCoaches()
    } finally {
      setMutating(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) {
      return
    }

    setMutating(true)
    try {
      await coachesService.remove(deleteTarget.id)
      setDeleteTarget(null)
      loadCoaches()
    } finally {
      setMutating(false)
    }
  }

  const handleDuplicate = async (id: number) => {
    setMutating(true)
    try {
      await coachesService.duplicate(id)
      loadCoaches()
    } finally {
      setMutating(false)
    }
  }

  const buildPreviewUrl = (slug: string) => `${PUBLIC_SITE_BASE_URL}/coaches/${slug}`

  return (
    <div className="space-y-6">
      <GenericListPage
        title="Coaches"
        description="Manage coach profiles, publishing state, and homepage visibility."
        actions={<PrimaryButton onClick={() => navigate('/coaches/create')}>Create Coach</PrimaryButton>}
        filters={(
          <ActionToolbar>
            <SearchBar value={search} onChange={setSearch} placeholder="Search coaches, slugs, titles..." />
            <SelectInput
              label="Quick Filter"
              value={filters.quickFilter}
              onChange={(value) => {
                setPage(1)
                setFilters((prev) => ({ ...prev, quickFilter: value as CoachListFilters['quickFilter'] }))
              }}
              options={QUICK_FILTERS}
            />
            <SelectInput
              label="Status"
              value={filters.status || 'all'}
              onChange={(value) => {
                setPage(1)
                setFilters((prev) => ({ ...prev, status: value === 'all' ? undefined : value as CoachListFilters['status'] }))
              }}
              options={[{ label: 'All Statuses', value: 'all' }, ...uniqueStatuses.map((status) => ({ label: status, value: status }))]}
            />
            <SelectInput
              label="Visibility"
              value={filters.visibility || 'all'}
              onChange={(value) => {
                setPage(1)
                setFilters((prev) => ({ ...prev, visibility: value === 'all' ? undefined : value as CoachListFilters['visibility'] }))
              }}
              options={[
                { label: 'All Visibility', value: 'all' },
                { label: 'Public', value: 'PUBLIC' },
                { label: 'Private', value: 'PRIVATE' },
                { label: 'Unlisted', value: 'UNLISTED' },
              ]}
            />
          </ActionToolbar>
        )}
        bulkActions={selectedIds.length ? (
          <ActionToolbar>
            <span className="text-sm text-(--color-text-secondary)">{selectedIds.length} selected</span>
            <SecondaryButton onClick={handleBulkActivate} disabled={mutating}>Bulk Activate</SecondaryButton>
            <SecondaryButton onClick={handleBulkDeactivate} disabled={mutating}>Bulk Deactivate</SecondaryButton>
            <SecondaryButton onClick={handleBulkPublish} disabled={mutating}>Bulk Publish</SecondaryButton>
            <SecondaryButton onClick={handleBulkDraft} disabled={mutating}>Bulk Draft</SecondaryButton>
            <SecondaryButton onClick={handleBulkFeature} disabled={mutating}>Bulk Feature</SecondaryButton>
            <SecondaryButton onClick={handleBulkDelete} disabled={mutating}>Bulk Delete</SecondaryButton>
          </ActionToolbar>
        ) : undefined}
      >
        {error ? <p className="rounded-xl border border-rose-300/40 bg-rose-300/15 px-3 py-2 text-sm text-rose-100">{error}</p> : null}
        {loading ? <p className="text-sm text-(--color-text-secondary)">Loading coaches...</p> : null}
        {!loading && !items.length ? <EmptyState title="No coaches found" description="Create your first coach profile to power public team sections." /> : null}

        {!loading && items.length ? (
          <>
            <GenericDataTable<CoachEntity>
              rows={items}
              rowKey={(row) => String(row.id)}
              searchTerm={search}
              searchableText={(row) => `${row.fullName} ${row.slug} ${row.jobTitle}`}
              selectable
              pageSize={pageSize}
              onSelectionChange={setSelectedIds}
              rowActions={(row) => (
                <div className="flex flex-wrap gap-1">
                  <Link className="rounded-lg border border-white/15 px-2 py-1 text-xs" to={`/coaches/${row.id}/view`}>View</Link>
                  <Link className="rounded-lg border border-white/15 px-2 py-1 text-xs" to={`/coaches/${row.id}/edit`}>Edit</Link>
                  <button type="button" className="rounded-lg border border-white/15 px-2 py-1 text-xs" onClick={() => window.open(buildPreviewUrl(row.slug), '_blank', 'noopener,noreferrer')}>Preview</button>
                  <button type="button" className="rounded-lg border border-white/15 px-2 py-1 text-xs" onClick={() => handleDuplicate(row.id)} disabled={mutating}>Duplicate</button>
                  {row.status === 'active'
                    ? <button type="button" className="rounded-lg border border-amber-300/40 px-2 py-1 text-xs text-amber-200" onClick={() => handleDeactivate(row.id)} disabled={mutating}>Deactivate</button>
                    : <button type="button" className="rounded-lg border border-emerald-300/40 px-2 py-1 text-xs text-emerald-200" onClick={() => handleActivate(row.id)} disabled={mutating}>Activate</button>}
                  <button type="button" className="rounded-lg border border-rose-300/40 px-2 py-1 text-xs text-rose-200" onClick={() => setDeleteTarget(row)} disabled={mutating}>Delete</button>
                </div>
              )}
              columns={[
                { key: 'fullName', header: 'Coach', sortable: true, render: (row) => row.fullName },
                { key: 'jobTitle', header: 'Title', sortable: true, render: (row) => row.jobTitle },
                { key: 'yearsOfExperience', header: 'Years', sortable: true, render: (row) => row.yearsOfExperience ?? '-' },
                {
                  key: 'publishStatus',
                  header: 'Publish',
                  sortable: true,
                  render: (row) => <StatusBadge tone={row.publishStatus === 'PUBLISHED' ? 'positive' : 'warning'} label={row.publishStatus} />,
                },
                {
                  key: 'isFeatured',
                  header: 'Featured',
                  sortable: true,
                  render: (row) => <StatusBadge tone={row.isFeatured ? 'positive' : 'neutral'} label={row.isFeatured ? 'Yes' : 'No'} />,
                },
                {
                  key: 'status',
                  header: 'Active',
                  sortable: true,
                  render: (row) => <StatusBadge tone={row.status === 'active' ? 'positive' : 'warning'} label={row.status === 'active' ? 'Active' : 'Inactive'} />,
                },
              ]}
            />

            <div className="text-xs text-(--color-text-secondary)">Server pagination: page {page} of {totalPages}, total {totalItems} coaches</div>
            <div className="flex items-center justify-end gap-2">
              <SecondaryButton onClick={() => setPage((prev) => Math.max(1, prev - 1))} disabled={page <= 1}>Previous</SecondaryButton>
              <SecondaryButton onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))} disabled={page >= totalPages}>Next</SecondaryButton>
            </div>
          </>
        ) : null}

        <DeleteConfirmationDialog
          isOpen={Boolean(deleteTarget)}
          resourceName={deleteTarget?.fullName || 'coach'}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      </GenericListPage>
    </div>
  )
}
