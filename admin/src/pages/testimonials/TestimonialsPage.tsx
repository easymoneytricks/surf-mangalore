import { useEffect, useMemo, useState } from 'react'

import {
  ActionToolbar,
  DeleteConfirmationDialog,
  EmptyState,
  GenericDataTable,
  GenericListPage,
  LoadingState,
  Modal,
  Pagination,
  PrimaryButton,
  SearchBar,
  SecondaryButton,
  SelectInput,
  StatusBadge,
  TextInput,
} from '../../components/admin'
import { useToast } from '../../contexts/ui/ToastContext'
import { testimonialsService } from '../../services/testimonials.service'
import { type TestimonialEntity, type TestimonialListFilters, type TestimonialMutationInput } from '../../types/testimonials'

type TestimonialFormState = Partial<TestimonialEntity> & { isNew?: boolean }

const QUICK_FILTERS: Array<{ label: string; value: TestimonialListFilters['quickFilter'] }> = [
  { label: 'All', value: 'all' },
  { label: 'Published', value: 'published' },
  { label: 'Draft', value: 'draft' },
  { label: 'Recent', value: 'recent' },
]

export default function TestimonialsPage() {
  const { pushToast } = useToast()
  const [items, setItems] = useState<TestimonialEntity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [quickFilter, setQuickFilter] = useState<TestimonialListFilters['quickFilter']>('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [featuredFilter, setFeaturedFilter] = useState<'all' | 'true' | 'false'>('all')
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [deleteTarget, setDeleteTarget] = useState<TestimonialEntity | null>(null)
  const [viewTarget, setViewTarget] = useState<TestimonialEntity | null>(null)
  const [editTarget, setEditTarget] = useState<TestimonialFormState | null>(null)
  const [saving, setSaving] = useState(false)

  const loadTestimonials = async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await testimonialsService.list({
        page,
        pageSize,
        search,
        sortBy: 'authorName',
        sortOrder: 'asc',
        filters: {
          quickFilter,
          status: statusFilter === 'all' ? undefined : statusFilter,
          visibility: undefined,
        },
      })

      setItems(result.items)
      setTotalPages(result.pagination.totalPages)
      setTotalItems(result.pagination.totalItems)
    } catch (fetchError) {
      setError((fetchError as Error).message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(loadTestimonials, 250)
    return () => window.clearTimeout(timer)
  }, [page, pageSize, search, quickFilter, statusFilter])

  const handleCreate = () => {
    setEditTarget({
      authorName: '',
      quote: '',
      authorLocation: '',
      rating: 5,
      publishStatus: 'DRAFT',
      visibility: 'PUBLIC',
      isFeatured: false,
      status: 'active',
      isNew: true,
    })
  }

  const handleSave = async () => {
    if (!editTarget) {
      return
    }

    setSaving(true)
    try {
      const payload: TestimonialMutationInput = {
        authorName: editTarget.authorName ?? '',
        authorLocation: editTarget.authorLocation,
        authorEmail: editTarget.authorEmail,
        quote: editTarget.quote ?? '',
        rating: editTarget.rating,
        status: (editTarget.status ?? 'active') as TestimonialMutationInput['status'],
        publishStatus: (editTarget.publishStatus as TestimonialMutationInput['publishStatus']) ?? 'DRAFT',
        visibility: (editTarget.visibility as TestimonialMutationInput['visibility']) ?? 'PUBLIC',
        isFeatured: editTarget.isFeatured ?? false,
      }

      if (editTarget.id) {
        await testimonialsService.update(editTarget.id, payload)
        pushToast('Testimonial updated successfully', 'success')
      } else {
        await testimonialsService.create(payload)
        pushToast('Testimonial created successfully', 'success')
      }

      setEditTarget(null)
      loadTestimonials()
    } catch (saveError) {
      pushToast((saveError as Error).message || 'Unable to save testimonial', 'danger')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) {
      return
    }

    try {
      await testimonialsService.remove(deleteTarget.id)
      setDeleteTarget(null)
      loadTestimonials()
      pushToast('Testimonial deleted', 'danger')
    } catch (deleteError) {
      pushToast((deleteError as Error).message || 'Unable to delete testimonial', 'danger')
    }
  }

  const handleDuplicate = async (item: TestimonialEntity) => {
    try {
      await testimonialsService.duplicate(item.id)
      loadTestimonials()
      pushToast('Testimonial duplicated', 'success')
    } catch (duplicateError) {
      pushToast((duplicateError as Error).message || 'Unable to duplicate testimonial', 'danger')
    }
  }

  const toggleStatus = async (item: TestimonialEntity) => {
    try {
      await testimonialsService.update(item.id, { status: item.status === 'active' ? 'inactive' : 'active' })
      loadTestimonials()
      pushToast(`Testimonial ${item.status === 'active' ? 'deactivated' : 'activated'}`, 'success')
    } catch (statusError) {
      pushToast((statusError as Error).message || 'Unable to update testimonial status', 'danger')
    }
  }

  const toggleFeatured = async (item: TestimonialEntity) => {
    try {
      await testimonialsService.update(item.id, { isFeatured: !item.isFeatured })
      loadTestimonials()
      pushToast(`Testimonial ${item.isFeatured ? 'unfeatured' : 'featured'}`, 'success')
    } catch (featuredError) {
      pushToast((featuredError as Error).message || 'Unable to update featured state', 'danger')
    }
  }

  const filteredItems = useMemo(
    () => items.filter((item) => {
      const matchesSearch = `${item.authorName} ${item.authorLocation ?? ''}`.toLowerCase().includes(search.toLowerCase())
      const matchesStatus = statusFilter === 'all' || item.status.toLowerCase() === statusFilter
      const matchesFeatured = featuredFilter === 'all' || String(item.isFeatured) === featuredFilter
      return matchesSearch && matchesStatus && matchesFeatured
    }),
    [items, search, statusFilter, featuredFilter],
  )

  return (
    <GenericListPage
      title="Testimonials"
      description="Curate customer testimonials, publishing visibility, and featured placements across the website."
      actions={(
        <div className="flex flex-wrap items-center gap-2">
          <SecondaryButton onClick={loadTestimonials}>Refresh</SecondaryButton>
          <PrimaryButton onClick={handleCreate}>Add Testimonial</PrimaryButton>
        </div>
      )}
      filters={(
        <ActionToolbar>
          <SearchBar value={search} onChange={(value) => { setSearch(value); setPage(1) }} placeholder="Search customer or source" />
          <SelectInput label="Quick Filter" value={quickFilter} onChange={(value) => { setQuickFilter(value as TestimonialListFilters['quickFilter']); setPage(1) }} options={QUICK_FILTERS} />
          <SelectInput label="Status" value={statusFilter} onChange={(value) => { setStatusFilter(value); setPage(1) }} options={[{ label: 'All', value: 'all' }, { label: 'Active', value: 'active' }, { label: 'Inactive', value: 'inactive' }]} />
          <SelectInput label="Featured" value={featuredFilter} onChange={(value) => { setFeaturedFilter(value as 'all' | 'true' | 'false'); setPage(1) }} options={[{ label: 'All', value: 'all' }, { label: 'Featured only', value: 'true' }, { label: 'Not featured', value: 'false' }]} />
        </ActionToolbar>
      )}
    >
      {loading ? <LoadingState mode="table" /> : null}
      {error ? <p className="rounded-xl border border-rose-300/40 bg-rose-300/15 px-3 py-2 text-sm text-rose-100">{error}</p> : null}
      {!loading && !filteredItems.length ? <EmptyState title="No testimonials matched" description="Try changing filters or add a testimonial to start social proof management." /> : null}

      {!loading && filteredItems.length ? (
        <>
          <GenericDataTable<TestimonialEntity>
            rows={filteredItems}
            rowKey={(row) => String(row.id)}
            columns={[
              {
                key: 'customer',
                header: 'Customer',
                render: (row) => (
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/8 text-xs font-semibold text-(--color-text)">
                      {row.authorName.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p>{row.authorName}</p>
                      <p className="text-xs text-(--color-text-secondary)">{row.authorLocation || row.authorEmail || 'Website'}</p>
                    </div>
                  </div>
                ),
              },
              { key: 'rating', header: 'Rating', render: (row) => `${'★'.repeat(row.rating ?? 0)}${'☆'.repeat(5 - (row.rating ?? 0))}` },
              {
                key: 'featured',
                header: 'Featured',
                render: (row) => <StatusBadge tone={row.isFeatured ? 'info' : 'neutral'} label={row.isFeatured ? 'Featured' : 'Standard'} />,
              },
              {
                key: 'status',
                header: 'Status',
                render: (row) => <StatusBadge tone={row.status === 'active' ? 'positive' : 'warning'} label={row.status} />,
              },
            ]}
            rowActions={(row) => (
              <div className="flex flex-wrap gap-1">
                <SecondaryButton className="px-3 py-1 text-xs" onClick={() => setViewTarget(row)}>View</SecondaryButton>
                <SecondaryButton className="px-3 py-1 text-xs" onClick={() => setEditTarget(row)}>Edit</SecondaryButton>
                <SecondaryButton className="px-3 py-1 text-xs" onClick={() => handleDuplicate(row)}>Duplicate</SecondaryButton>
                <SecondaryButton className="px-3 py-1 text-xs" onClick={() => toggleStatus(row)}>{row.status === 'active' ? 'Deactivate' : 'Activate'}</SecondaryButton>
                <SecondaryButton className="px-3 py-1 text-xs" onClick={() => toggleFeatured(row)}>{row.isFeatured ? 'Unfeature' : 'Feature'}</SecondaryButton>
                <SecondaryButton className="px-3 py-1 text-xs" onClick={() => setDeleteTarget(row)}>Delete</SecondaryButton>
              </div>
            )}
          />

          <div className="text-xs text-(--color-text-secondary)">Server pagination: page {page} of {totalPages}, total {totalItems} testimonials</div>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      ) : null}

      <DeleteConfirmationDialog
        isOpen={Boolean(deleteTarget)}
        resourceName={deleteTarget?.authorName || 'testimonial'}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />

      <Modal
        isOpen={Boolean(viewTarget)}
        title="Testimonial Details"
        onClose={() => setViewTarget(null)}
        footer={<div className="flex justify-end"><SecondaryButton onClick={() => setViewTarget(null)}>Close</SecondaryButton></div>}
      >
        {viewTarget ? (
          <div className="space-y-2 text-sm text-(--color-text-secondary)">
            <p><span className="font-medium text-(--color-text)">Customer:</span> {viewTarget.authorName}</p>
            <p><span className="font-medium text-(--color-text)">Source:</span> {viewTarget.authorLocation || viewTarget.authorEmail || 'Website'}</p>
            <p><span className="font-medium text-(--color-text)">Rating:</span> {viewTarget.rating ?? 0}/5</p>
            <p><span className="font-medium text-(--color-text)">Publish Status:</span> {viewTarget.publishStatus}</p>
          </div>
        ) : null}
      </Modal>

      <Modal
        isOpen={Boolean(editTarget)}
        title={editTarget?.id ? 'Edit Testimonial' : 'Create Testimonial'}
        onClose={() => setEditTarget(null)}
        footer={(
          <div className="flex justify-end gap-2">
            <SecondaryButton onClick={() => setEditTarget(null)}>Cancel</SecondaryButton>
            <PrimaryButton onClick={handleSave} disabled={saving}>{saving ? 'Saving…' : 'Save'}</PrimaryButton>
          </div>
        )}
      >
        {editTarget ? (
          <div className="space-y-3">
            <TextInput label="Customer Name" value={editTarget.authorName ?? ''} onChange={(event) => setEditTarget({ ...editTarget, authorName: event.target.value })} />
            <TextInput label="Location" value={editTarget.authorLocation ?? ''} onChange={(event) => setEditTarget({ ...editTarget, authorLocation: event.target.value })} />
            <SelectInput label="Rating" value={String(editTarget.rating ?? 5)} onChange={(value) => setEditTarget({ ...editTarget, rating: Number(value) })} options={[{ label: '5', value: '5' }, { label: '4', value: '4' }, { label: '3', value: '3' }, { label: '2', value: '2' }, { label: '1', value: '1' }]} />
            <TextInput label="Quote" value={editTarget.quote ?? ''} onChange={(event) => setEditTarget({ ...editTarget, quote: event.target.value })} />
            <SelectInput label="Status" value={editTarget.status ?? 'active'} onChange={(value) => setEditTarget({ ...editTarget, status: value })} options={[{ label: 'Active', value: 'active' }, { label: 'Inactive', value: 'inactive' }]} />
            <SelectInput label="Publish Status" value={editTarget.publishStatus ?? 'DRAFT'} onChange={(value) => setEditTarget({ ...editTarget, publishStatus: value })} options={[{ label: 'Published', value: 'PUBLISHED' }, { label: 'Draft', value: 'DRAFT' }, { label: 'Review', value: 'REVIEW' }, { label: 'Archived', value: 'ARCHIVED' }]} />
            <label className="flex items-center justify-between rounded-xl border border-white/12 bg-white/4 px-3 py-2 text-sm text-(--color-text)">
              Featured
              <input type="checkbox" checked={editTarget.isFeatured ?? false} onChange={(event) => setEditTarget({ ...editTarget, isFeatured: event.target.checked })} />
            </label>
          </div>
        ) : null}
      </Modal>
    </GenericListPage>
  )
}
