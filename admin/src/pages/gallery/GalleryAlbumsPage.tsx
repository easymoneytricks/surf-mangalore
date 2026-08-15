import { useEffect, useMemo, useState } from 'react'

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
  TextInput,
  TextareaInput,
} from '../../components/admin'
import { galleryService } from '../../services/gallery.service'
import { type GalleryAlbumEntity, type GalleryAlbumListFilters, type GalleryAlbumMutationInput } from '../../types/gallery'
import { slugify } from '../../utils/slug'

const QUICK_FILTERS: Array<{ label: string; value: GalleryAlbumListFilters['quickFilter'] }> = [
  { label: 'All', value: 'all' },
  { label: 'Published', value: 'published' },
  { label: 'Draft', value: 'draft' },
  { label: 'Featured', value: 'featured' },
  { label: 'Recently Added', value: 'recent' },
]

const DEFAULT_FORM: GalleryAlbumMutationInput = {
  name: '',
  slug: '',
  shortDescription: '',
  coverImageUrl: '',
  displayOrder: 0,
  status: 'active',
  publishStatus: 'DRAFT',
  visibility: 'PUBLIC',
  isFeatured: false,
  seoTitle: '',
  seoDescription: '',
}

export default function GalleryAlbumsPage() {
  const [items, setItems] = useState<GalleryAlbumEntity[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [pageSize] = useState(12)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [filters, setFilters] = useState<GalleryAlbumListFilters>({ quickFilter: 'all' })
  const [editing, setEditing] = useState<GalleryAlbumEntity | null>(null)
  const [form, setForm] = useState<GalleryAlbumMutationInput>(DEFAULT_FORM)
  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<GalleryAlbumEntity | null>(null)
  const [slugTouched, setSlugTouched] = useState(false)

  const loadAlbums = () => {
    setLoading(true)
    setError(null)

    galleryService
      .listAlbums({
        page,
        pageSize,
        search,
        sortBy: 'displayOrder',
        sortOrder: 'asc',
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
    const timer = window.setTimeout(loadAlbums, 250)
    return () => window.clearTimeout(timer)
  }, [page, pageSize, search, filters])

  const visibilityOptions = useMemo(
    () => [
      { label: 'Public', value: 'PUBLIC' },
      { label: 'Private', value: 'PRIVATE' },
      { label: 'Unlisted', value: 'UNLISTED' },
    ],
    [],
  )

  const setField = <K extends keyof GalleryAlbumMutationInput>(field: K, value: GalleryAlbumMutationInput[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const resetForm = () => {
    setEditing(null)
    setForm(DEFAULT_FORM)
    setSlugTouched(false)
  }

  const startEdit = (album: GalleryAlbumEntity) => {
    setEditing(album)
    setForm({
      name: album.name,
      slug: album.slug,
      shortDescription: album.shortDescription || '',
      coverImageUrl: album.coverImageUrl || '',
      displayOrder: album.displayOrder,
      status: album.status,
      publishStatus: album.publishStatus,
      visibility: album.visibility,
      isFeatured: album.isFeatured,
      seoTitle: album.seoTitle || '',
      seoDescription: album.seoDescription || '',
    })
    setSlugTouched(true)
  }

  const handleSave = async () => {
    setSaving(true)
    setError(null)

    try {
      if (editing) {
        await galleryService.updateAlbum(editing.id, form)
      } else {
        await galleryService.createAlbum(form)
      }

      resetForm()
      loadAlbums()
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Failed to save album')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) {
      return
    }

    await galleryService.removeAlbum(deleteTarget.id)
    setDeleteTarget(null)
    loadAlbums()
  }

  return (
    <div className="space-y-6">
      <GenericListPage
        title="Gallery Albums"
        description="Create and organize albums for public gallery filtering."
        actions={<SecondaryButton onClick={resetForm}>{editing ? 'New Album' : 'Reset Form'}</SecondaryButton>}
        filters={(
          <ActionToolbar>
            <SearchBar value={search} onChange={setSearch} placeholder="Search album name or slug..." />
            <SelectInput
              label="Quick Filter"
              value={filters.quickFilter}
              onChange={(value) => {
                setPage(1)
                setFilters((prev) => ({ ...prev, quickFilter: value as GalleryAlbumListFilters['quickFilter'] }))
              }}
              options={QUICK_FILTERS}
            />
          </ActionToolbar>
        )}
      >
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <TextInput
              label="Album Name"
              value={form.name}
              onChange={(event) => {
                const next = event.target.value
                setField('name', next)
                if (!slugTouched) {
                  setField('slug', slugify(next))
                }
              }}
            />
            <TextInput
              label="Slug"
              value={form.slug}
              onChange={(event) => {
                setSlugTouched(true)
                setField('slug', slugify(event.target.value))
              }}
            />
            <TextInput
              label="Cover Image URL"
              value={form.coverImageUrl || ''}
              onChange={(event) => setField('coverImageUrl', event.target.value)}
            />
            <TextInput
              label="Display Order"
              type="number"
              value={form.displayOrder}
              onChange={(event) => setField('displayOrder', Number(event.target.value))}
            />
            <SelectInput
              label="Status"
              value={form.status}
              onChange={(value) => setField('status', value as GalleryAlbumMutationInput['status'])}
              options={[
                { label: 'Active', value: 'active' },
                { label: 'Inactive', value: 'inactive' },
              ]}
            />
            <SelectInput
              label="Publish Status"
              value={form.publishStatus}
              onChange={(value) => setField('publishStatus', value as GalleryAlbumMutationInput['publishStatus'])}
              options={[
                { label: 'Draft', value: 'DRAFT' },
                { label: 'Review', value: 'REVIEW' },
                { label: 'Published', value: 'PUBLISHED' },
                { label: 'Unpublished', value: 'UNPUBLISHED' },
                { label: 'Archived', value: 'ARCHIVED' },
              ]}
            />
            <SelectInput
              label="Visibility"
              value={form.visibility}
              onChange={(value) => setField('visibility', value as GalleryAlbumMutationInput['visibility'])}
              options={visibilityOptions}
            />
            <SelectInput
              label="Featured"
              value={form.isFeatured ? 'yes' : 'no'}
              onChange={(value) => setField('isFeatured', value === 'yes')}
              options={[
                { label: 'Yes', value: 'yes' },
                { label: 'No', value: 'no' },
              ]}
            />
            <TextareaInput
              label="Short Description"
              value={form.shortDescription || ''}
              onChange={(event) => setField('shortDescription', event.target.value)}
              className="sm:col-span-2"
            />
            <TextInput
              label="SEO Title"
              value={form.seoTitle || ''}
              onChange={(event) => setField('seoTitle', event.target.value)}
            />
            <TextareaInput
              label="SEO Description"
              value={form.seoDescription || ''}
              onChange={(event) => setField('seoDescription', event.target.value)}
              className="sm:col-span-2"
            />
          </div>

          <div className="mt-3 flex flex-wrap justify-end gap-2">
            <SecondaryButton onClick={resetForm}>Cancel</SecondaryButton>
            <PrimaryButton onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : editing ? 'Update Album' : 'Create Album'}</PrimaryButton>
          </div>
        </div>

        {error ? <p className="rounded-xl border border-rose-300/40 bg-rose-300/15 px-3 py-2 text-sm text-rose-100">{error}</p> : null}
        {loading ? <p className="text-sm text-(--color-text-secondary)">Loading albums...</p> : null}
        {!loading && !items.length ? <EmptyState title="No albums found" description="Create your first gallery album to organize images." /> : null}

        {!loading && items.length ? (
          <>
            <GenericDataTable<GalleryAlbumEntity>
              rows={items}
              rowKey={(row) => String(row.id)}
              searchTerm={search}
              searchableText={(row) => `${row.name} ${row.slug} ${row.shortDescription || ''}`}
              pageSize={pageSize}
              rowActions={(row) => (
                <div className="flex flex-wrap gap-1">
                  <button type="button" className="rounded-lg border border-white/15 px-2 py-1 text-xs" onClick={() => startEdit(row)}>Edit</button>
                  <button type="button" className="rounded-lg border border-rose-300/40 px-2 py-1 text-xs text-rose-200" onClick={() => setDeleteTarget(row)}>Delete</button>
                </div>
              )}
              columns={[
                { key: 'name', header: 'Album Name', sortable: true, render: (row) => row.name },
                { key: 'slug', header: 'Slug', sortable: true, render: (row) => row.slug },
                { key: 'imagesCount', header: 'Images', sortable: true, render: (row) => row.imagesCount },
                {
                  key: 'publishStatus',
                  header: 'Publish',
                  sortable: true,
                  render: (row) => <StatusBadge tone={row.publishStatus === 'PUBLISHED' ? 'positive' : 'warning'} label={row.publishStatus} />,
                },
                {
                  key: 'featured',
                  header: 'Featured',
                  sortable: true,
                  render: (row) => <StatusBadge tone={row.isFeatured ? 'positive' : 'neutral'} label={row.isFeatured ? 'Yes' : 'No'} />,
                },
              ]}
            />

            <div className="text-xs text-(--color-text-secondary)">Server pagination: page {page} of {totalPages}, total {totalItems} albums</div>
            <div className="flex items-center justify-end gap-2">
              <SecondaryButton onClick={() => setPage((prev) => Math.max(1, prev - 1))} disabled={page <= 1}>Previous</SecondaryButton>
              <SecondaryButton onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))} disabled={page >= totalPages}>Next</SecondaryButton>
            </div>
          </>
        ) : null}

        <DeleteConfirmationDialog
          isOpen={Boolean(deleteTarget)}
          resourceName={deleteTarget?.name || 'gallery album'}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      </GenericListPage>
    </div>
  )
}
