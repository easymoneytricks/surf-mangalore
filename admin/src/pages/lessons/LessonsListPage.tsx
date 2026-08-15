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
import { lessonsService } from '../../services/lessons.service'
import { type LessonEntity, type LessonListFilters } from '../../types/lessons'

const QUICK_FILTERS: Array<{ label: string; value: LessonListFilters['quickFilter'] }> = [
  { label: 'All', value: 'all' },
  { label: 'Featured', value: 'featured' },
  { label: 'Draft', value: 'draft' },
  { label: 'Published', value: 'published' },
]

export default function LessonsListPage() {
  const navigate = useNavigate()
  const [items, setItems] = useState<LessonEntity[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [filters, setFilters] = useState<LessonListFilters>({ quickFilter: 'all' })
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [deleteTarget, setDeleteTarget] = useState<LessonEntity | null>(null)

  const loadLessons = () => {
    setLoading(true)
    setError(null)

    lessonsService
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
    const timer = window.setTimeout(loadLessons, 250)
    return () => window.clearTimeout(timer)
  }, [page, pageSize, search, filters])

  const uniqueDifficulties = useMemo(
    () => [...new Set(items.map((lesson) => lesson.difficulty).filter(Boolean) as string[])],
    [items],
  )

  const uniqueInstructors = useMemo(
    () => [...new Set(items.map((lesson) => lesson.instructor).filter(Boolean) as string[])],
    [items],
  )

  const selectedNumericIds = selectedIds.map(Number).filter(Number.isFinite)

  const handleBulkPublish = async () => {
    if (!selectedNumericIds.length) {
      return
    }

    await lessonsService.patchStatus(selectedNumericIds, 'PUBLISHED')
    setSelectedIds([])
    loadLessons()
  }

  const handleBulkDelete = async () => {
    if (!selectedNumericIds.length) {
      return
    }

    await Promise.all(selectedNumericIds.map((id) => lessonsService.remove(id)))
    setSelectedIds([])
    loadLessons()
  }

  const handleDelete = async () => {
    if (!deleteTarget) {
      return
    }

    await lessonsService.remove(deleteTarget.id)
    setDeleteTarget(null)
    loadLessons()
  }

  return (
    <div className="space-y-6">
      <GenericListPage
        title="Lessons"
        description="Manage lesson content, visibility, and publishing workflows."
        actions={<PrimaryButton onClick={() => navigate('/lessons/create')}>Create Lesson</PrimaryButton>}
        filters={(
          <ActionToolbar>
            <SearchBar value={search} onChange={setSearch} placeholder="Search lessons, slugs, instructors..." />
            <SelectInput
              label="Quick Filter"
              value={filters.quickFilter}
              onChange={(value) => {
                setPage(1)
                setFilters((prev) => ({ ...prev, quickFilter: value as LessonListFilters['quickFilter'] }))
              }}
              options={QUICK_FILTERS}
            />
            <SelectInput
              label="Difficulty"
              value={filters.difficulty || 'all'}
              onChange={(value) => {
                setPage(1)
                setFilters((prev) => ({ ...prev, difficulty: value === 'all' ? undefined : value }))
              }}
              options={[{ label: 'All Difficulties', value: 'all' }, ...uniqueDifficulties.map((difficulty) => ({ label: difficulty, value: difficulty }))]}
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
            <SecondaryButton onClick={handleBulkDelete}>Bulk Delete</SecondaryButton>
          </ActionToolbar>
        ) : undefined}
      >
        {error ? <p className="rounded-xl border border-rose-300/40 bg-rose-300/15 px-3 py-2 text-sm text-rose-100">{error}</p> : null}
        {loading ? <p className="text-sm text-(--color-text-secondary)">Loading lessons...</p> : null}
        {!loading && !items.length ? <EmptyState title="No lessons found" description="Create your first lesson to start managing content lifecycle." /> : null}

        {!loading && items.length ? (
          <>
            <GenericDataTable<LessonEntity>
              rows={items}
              rowKey={(row) => String(row.id)}
              searchTerm={search}
              searchableText={(row) => `${row.title} ${row.slug} ${row.instructor || ''}`}
              selectable
              pageSize={pageSize}
              onSelectionChange={setSelectedIds}
              rowActions={(row) => (
                <div className="flex flex-wrap gap-1">
                  <Link className="rounded-lg border border-white/15 px-2 py-1 text-xs" to={`/lessons/${row.id}/view`}>View</Link>
                  <Link className="rounded-lg border border-white/15 px-2 py-1 text-xs" to={`/lessons/${row.id}/edit`}>Edit</Link>
                  <button type="button" className="rounded-lg border border-rose-300/40 px-2 py-1 text-xs text-rose-200" onClick={() => setDeleteTarget(row)}>Delete</button>
                </div>
              )}
              columns={[
                { key: 'title', header: 'Title', sortable: true, render: (row) => row.title },
                { key: 'difficulty', header: 'Difficulty', sortable: true, render: (row) => row.difficulty },
                { key: 'instructor', header: 'Instructor', sortable: true, render: (row) => row.instructor || '-' },
                {
                  key: 'status',
                  header: 'Status',
                  sortable: true,
                  render: (row) => <StatusBadge tone={row.publishStatus === 'PUBLISHED' ? 'positive' : 'warning'} label={row.publishStatus} />,
                },
                { key: 'displayOrder', header: 'Order', sortable: true, render: (row) => row.displayOrder },
              ]}
            />

            <div className="text-xs text-(--color-text-secondary)">Server pagination: page {page} of {totalPages}, total {totalItems} lessons</div>
            <div className="flex items-center justify-end gap-2">
              <SecondaryButton onClick={() => setPage((prev) => Math.max(1, prev - 1))} disabled={page <= 1}>Previous</SecondaryButton>
              <SecondaryButton onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))} disabled={page >= totalPages}>Next</SecondaryButton>
            </div>
          </>
        ) : null}

        <DeleteConfirmationDialog
          isOpen={Boolean(deleteTarget)}
          resourceName={deleteTarget?.title || 'lesson'}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      </GenericListPage>
    </div>
  )
}
