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
  TextareaInput,
} from '../../components/admin'
import { useToast } from '../../contexts/ui/ToastContext'
import { faqsService } from '../../services/faqs.service'
import { type FaqEntity, type FaqListFilters, type FaqMutationInput } from '../../types/faqs'

type FaqFormState = Partial<FaqEntity> & { isNew?: boolean }

const QUICK_FILTERS: Array<{ label: string; value: FaqListFilters['quickFilter'] }> = [
  { label: 'All', value: 'all' },
  { label: 'Published', value: 'published' },
  { label: 'Draft', value: 'draft' },
  { label: 'Recent', value: 'recent' },
]

export default function FAQsPage() {
  const { pushToast } = useToast()
  const [items, setItems] = useState<FaqEntity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [quickFilter, setQuickFilter] = useState<FaqListFilters['quickFilter']>('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [publishStatusFilter, setPublishStatusFilter] = useState('all')
  const [visibilityFilter, setVisibilityFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [deleteTarget, setDeleteTarget] = useState<FaqEntity | null>(null)
  const [editTarget, setEditTarget] = useState<FaqFormState | null>(null)
  const [saving, setSaving] = useState(false)

  const loadFaqs = async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await faqsService.list({
        page,
        pageSize,
        search,
        sortBy: 'sortOrder',
        sortOrder: 'asc',
        filters: {
          quickFilter,
          status: statusFilter === 'all' ? undefined : statusFilter,
          publishStatus: publishStatusFilter === 'all' ? undefined : publishStatusFilter,
          visibility: visibilityFilter === 'all' ? undefined : visibilityFilter,
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
    const timer = window.setTimeout(loadFaqs, 250)
    return () => window.clearTimeout(timer)
  }, [page, pageSize, search, quickFilter, statusFilter, publishStatusFilter, visibilityFilter])

  const handleCreate = () => {
    setEditTarget({
      question: '',
      answer: '',
      status: 'active',
      publishStatus: 'DRAFT',
      visibility: 'PUBLIC',
      sortOrder: totalItems + 1,
      isFeatured: false,
      isNew: true,
    })
  }

  const handleSave = async () => {
    if (!editTarget) {
      return
    }

    setSaving(true)
    try {
      const payload: FaqMutationInput = {
        question: editTarget.question ?? '',
        answer: editTarget.answer ?? '',
        status: (editTarget.status ?? 'active') as FaqMutationInput['status'],
        publishStatus: (editTarget.publishStatus as FaqMutationInput['publishStatus']) ?? 'DRAFT',
        visibility: (editTarget.visibility as FaqMutationInput['visibility']) ?? 'PUBLIC',
        sortOrder: editTarget.sortOrder ?? totalItems + 1,
        slug: editTarget.slug,
        isFeatured: editTarget.isFeatured ?? false,
      }

      if (editTarget.id) {
        await faqsService.update(editTarget.id, payload)
        pushToast('FAQ updated successfully', 'success')
      } else {
        await faqsService.create(payload)
        pushToast('FAQ created successfully', 'success')
      }

      setEditTarget(null)
      loadFaqs()
    } catch (saveError) {
      pushToast((saveError as Error).message || 'Unable to save FAQ', 'danger')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) {
      return
    }

    try {
      await faqsService.remove(deleteTarget.id)
      setDeleteTarget(null)
      loadFaqs()
      pushToast('FAQ deleted', 'danger')
    } catch (deleteError) {
      pushToast((deleteError as Error).message || 'Unable to delete FAQ', 'danger')
    }
  }

  const handleDuplicate = async (item: FaqEntity) => {
    try {
      await faqsService.duplicate(item.id)
      loadFaqs()
      pushToast('FAQ duplicated', 'success')
    } catch (duplicateError) {
      pushToast((duplicateError as Error).message || 'Unable to duplicate FAQ', 'danger')
    }
  }

  const toggleStatus = async (item: FaqEntity) => {
    try {
      await faqsService.update(item.id, { status: item.status === 'active' ? 'inactive' : 'active' })
      loadFaqs()
      pushToast(`FAQ ${item.status === 'active' ? 'deactivated' : 'activated'}`, 'success')
    } catch (statusError) {
      pushToast((statusError as Error).message || 'Unable to update FAQ status', 'danger')
    }
  }

  const filteredItems = useMemo(
    () => items.filter((item) => {
      const matchesSearch = `${item.question} ${item.answer}`.toLowerCase().includes(search.toLowerCase())
      return matchesSearch
    }),
    [items, search],
  )

  return (
    <GenericListPage
      title="FAQs"
      description="Maintain frequently asked questions with category grouping, ordering, and publication control."
      actions={(
        <div className="flex flex-wrap items-center gap-2">
          <SecondaryButton onClick={loadFaqs}>Refresh</SecondaryButton>
          <PrimaryButton onClick={handleCreate}>Add FAQ</PrimaryButton>
        </div>
      )}
      filters={(
        <ActionToolbar>
          <SearchBar value={search} onChange={(value) => { setSearch(value); setPage(1) }} placeholder="Search question or answer" />
          <SelectInput label="Quick Filter" value={quickFilter} onChange={(value) => { setQuickFilter(value as FaqListFilters['quickFilter']); setPage(1) }} options={QUICK_FILTERS} />
          <SelectInput
            label="Status"
            value={statusFilter}
            onChange={(value) => { setStatusFilter(value); setPage(1) }}
            options={[
              { label: 'All', value: 'all' },
              { label: 'Active', value: 'active' },
              { label: 'Inactive', value: 'inactive' },
            ]}
          />
          <SelectInput
            label="Publish Status"
            value={publishStatusFilter}
            onChange={(value) => { setPublishStatusFilter(value); setPage(1) }}
            options={[
              { label: 'All', value: 'all' },
              { label: 'Draft', value: 'DRAFT' },
              { label: 'Review', value: 'REVIEW' },
              { label: 'Published', value: 'PUBLISHED' },
              { label: 'Unpublished', value: 'UNPUBLISHED' },
              { label: 'Archived', value: 'ARCHIVED' },
            ]}
          />
          <SelectInput
            label="Visibility"
            value={visibilityFilter}
            onChange={(value) => { setVisibilityFilter(value); setPage(1) }}
            options={[
              { label: 'All', value: 'all' },
              { label: 'Public', value: 'PUBLIC' },
              { label: 'Private', value: 'PRIVATE' },
              { label: 'Unlisted', value: 'UNLISTED' },
            ]}
          />
        </ActionToolbar>
      )}
    >
      {loading ? <LoadingState mode="table" /> : null}
      {error ? <p className="rounded-xl border border-rose-300/40 bg-rose-300/15 px-3 py-2 text-sm text-rose-100">{error}</p> : null}
      {!loading && !filteredItems.length ? <EmptyState title="No FAQs found" description="Adjust filters or create a new FAQ entry." /> : null}

      {!loading && filteredItems.length ? (
        <>
          <GenericDataTable<FaqEntity>
            rows={filteredItems}
            rowKey={(row) => String(row.id)}
            columns={[
              { key: 'question', header: 'Question', sortable: true, render: (row) => row.question },
              { key: 'answer', header: 'Answer Preview', render: (row) => `${row.answer.slice(0, 80)}${row.answer.length > 80 ? '...' : ''}` },
              { key: 'status', header: 'Status', render: (row) => <StatusBadge tone={row.status === 'active' ? 'positive' : 'warning'} label={row.status} /> },
              { key: 'featured', header: 'Featured', render: (row) => <StatusBadge tone={row.isFeatured ? 'info' : 'neutral'} label={row.isFeatured ? 'Featured' : 'Standard'} /> },
              { key: 'publishStatus', header: 'Publish Status', render: (row) => <StatusBadge tone={row.publishStatus === 'PUBLISHED' ? 'positive' : 'warning'} label={row.publishStatus} /> },
              { key: 'visibility', header: 'Visibility', render: (row) => row.visibility },
              { key: 'sortOrder', header: 'Order', sortable: true, render: (row) => row.sortOrder },
            ]}
            rowActions={(row) => (
              <div className="flex flex-wrap gap-1">
                <SecondaryButton className="px-3 py-1 text-xs" onClick={() => setEditTarget(row)}>Edit</SecondaryButton>
                <SecondaryButton className="px-3 py-1 text-xs" onClick={() => handleDuplicate(row)}>Duplicate</SecondaryButton>
                <SecondaryButton className="px-3 py-1 text-xs" onClick={() => toggleStatus(row)}>{row.status === 'active' ? 'Deactivate' : 'Activate'}</SecondaryButton>
                <SecondaryButton className="px-3 py-1 text-xs" onClick={async () => { await faqsService.update(row.id, { isFeatured: !row.isFeatured }); loadFaqs(); pushToast(`FAQ ${row.isFeatured ? 'unfeatured' : 'featured'}`, 'success') }}>{row.isFeatured ? 'Unfeature' : 'Feature'}</SecondaryButton>
                <SecondaryButton className="px-3 py-1 text-xs" onClick={() => setDeleteTarget(row)}>Delete</SecondaryButton>
              </div>
            )}
          />

          <div className="text-xs text-(--color-text-secondary)">Server pagination: page {page} of {totalPages}, total {totalItems} FAQs</div>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      ) : null}

      <DeleteConfirmationDialog
        isOpen={Boolean(deleteTarget)}
        resourceName={deleteTarget?.question || 'FAQ'}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />

      <Modal
        isOpen={Boolean(editTarget)}
        title={editTarget?.id ? 'Edit FAQ' : 'Create FAQ'}
        onClose={() => setEditTarget(null)}
        footer={(
          <div className="flex justify-end gap-2">
            <SecondaryButton onClick={() => setEditTarget(null)}>Cancel</SecondaryButton>
            <PrimaryButton onClick={handleSave} disabled={saving}>{saving ? 'Saving…' : 'Save FAQ'}</PrimaryButton>
          </div>
        )}
      >
        {editTarget ? (
          <div className="space-y-3">
            <TextInput label="Question" value={editTarget.question ?? ''} onChange={(event) => setEditTarget({ ...editTarget, question: event.target.value })} />
            <TextareaInput label="Answer" value={editTarget.answer ?? ''} onChange={(event) => setEditTarget({ ...editTarget, answer: event.target.value })} />
            <SelectInput label="Status" value={editTarget.status ?? 'active'} onChange={(value) => setEditTarget({ ...editTarget, status: value })} options={[{ label: 'Active', value: 'active' }, { label: 'Inactive', value: 'inactive' }]} />
            <SelectInput label="Publish Status" value={editTarget.publishStatus ?? 'DRAFT'} onChange={(value) => setEditTarget({ ...editTarget, publishStatus: value })} options={[{ label: 'Draft', value: 'DRAFT' }, { label: 'Review', value: 'REVIEW' }, { label: 'Published', value: 'PUBLISHED' }, { label: 'Unpublished', value: 'UNPUBLISHED' }, { label: 'Archived', value: 'ARCHIVED' }]} />
            <SelectInput label="Visibility" value={editTarget.visibility ?? 'PUBLIC'} onChange={(value) => setEditTarget({ ...editTarget, visibility: value })} options={[{ label: 'Public', value: 'PUBLIC' }, { label: 'Private', value: 'PRIVATE' }, { label: 'Unlisted', value: 'UNLISTED' }]} />
            <TextInput label="Sort Order" type="number" value={String(editTarget.sortOrder ?? 0)} onChange={(event) => setEditTarget({ ...editTarget, sortOrder: Number(event.target.value) })} />
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
