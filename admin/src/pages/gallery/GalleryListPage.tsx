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
import { galleryService } from '../../services/gallery.service'
import { mediaService } from '../../services/media.service'
import { type GalleryAlbumEntity, type GalleryImageEntity, type GalleryListFilters } from '../../types/gallery'
import { slugify } from '../../utils/slug'

const QUICK_FILTERS: Array<{ label: string; value: GalleryListFilters['quickFilter'] }> = [
  { label: 'All', value: 'all' },
  { label: 'Published', value: 'published' },
  { label: 'Draft', value: 'draft' },
  { label: 'Featured', value: 'featured' },
  { label: 'Recently Added', value: 'recent' },
]

export default function GalleryListPage() {
  const navigate = useNavigate()
  const [items, setItems] = useState<GalleryImageEntity[]>([])
  const [albums, setAlbums] = useState<GalleryAlbumEntity[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [pageSize] = useState(12)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [filters, setFilters] = useState<GalleryListFilters>({ quickFilter: 'all' })
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [deleteTarget, setDeleteTarget] = useState<GalleryImageEntity | null>(null)
  const [bulkAlbumId, setBulkAlbumId] = useState('none')
  const [uploadAlbumId, setUploadAlbumId] = useState('none')
  const [uploadFiles, setUploadFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)

  const loadAlbums = () => {
    galleryService
      .listAlbums({
        page: 1,
        pageSize: 100,
        search: '',
        sortBy: 'displayOrder',
        sortOrder: 'asc',
        filters: { quickFilter: 'all' },
      })
      .then((result) => setAlbums(result.items))
      .catch((fetchError: Error) => {
        setAlbums([])
        setError(fetchError.message)
      })
  }

  const loadGallery = () => {
    setLoading(true)
    setError(null)

    galleryService
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
    loadAlbums()
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(loadGallery, 250)
    return () => window.clearTimeout(timer)
  }, [page, pageSize, search, filters])

  const albumOptions = useMemo(
    () => [{ label: 'All Albums', value: 'all' }, ...albums.map((album) => ({ label: album.name, value: String(album.id) }))],
    [albums],
  )

  const selectedNumericIds = selectedIds.map(Number).filter(Number.isFinite)

  const handleBulkDelete = async () => {
    if (!selectedNumericIds.length) {
      return
    }

    await Promise.all(selectedNumericIds.map((id) => galleryService.remove(id)))
    setSelectedIds([])
    loadGallery()
  }

  const handleBulkMove = async () => {
    if (!selectedNumericIds.length) {
      return
    }

    await galleryService.moveImages(selectedNumericIds, bulkAlbumId === 'none' ? undefined : Number(bulkAlbumId))
    setSelectedIds([])
    loadGallery()
  }

  const handleSetFeatured = async () => {
    if (!selectedNumericIds.length) {
      return
    }

    await Promise.all(selectedNumericIds.map((id) => galleryService.update(id, { isFeatured: true })))
    setSelectedIds([])
    loadGallery()
  }

  const handleDelete = async () => {
    if (!deleteTarget) {
      return
    }

    await galleryService.remove(deleteTarget.id)
    setDeleteTarget(null)
    loadGallery()
  }

  const handleBulkUpload = async () => {
    if (!uploadFiles.length) {
      return
    }

    setUploading(true)
    setError(null)

    try {
      const uploadedMedia = await mediaService.upload({
        files: uploadFiles,
        folder: 'gallery/uploads',
      })

      await Promise.all(
        uploadedMedia.map((media) =>
          galleryService.create({
            title: media.title,
            slug: slugify(`${media.title}-${media.id}`),
            albumId: uploadAlbumId === 'none' ? undefined : Number(uploadAlbumId),
            mediaId: media.id,
            tags: media.tags || [],
            isFeatured: false,
            displayOrder: 0,
            status: 'active',
            publishStatus: 'DRAFT',
            visibility: 'PUBLIC',
          }),
        ),
      )

      setUploadFiles([])
      loadGallery()
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Bulk upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      <GenericListPage
        title="Gallery Images"
        description="Manage gallery images, metadata, and album assignment for the public gallery page."
        actions={(
          <div className="flex flex-wrap gap-2">
            <SecondaryButton onClick={() => navigate('/gallery/albums')}>Manage Albums</SecondaryButton>
            <PrimaryButton onClick={() => navigate('/gallery/create')}>Add Gallery Image</PrimaryButton>
          </div>
        )}
        filters={(
          <ActionToolbar>
            <SearchBar value={search} onChange={setSearch} placeholder="Search title, caption, tags, photographer..." />
            <SelectInput
              label="Quick Filter"
              value={filters.quickFilter}
              onChange={(value) => {
                setPage(1)
                setFilters((prev) => ({ ...prev, quickFilter: value as GalleryListFilters['quickFilter'] }))
              }}
              options={QUICK_FILTERS}
            />
            <SelectInput
              label="Album"
              value={filters.albumId ? String(filters.albumId) : 'all'}
              onChange={(value) => {
                setPage(1)
                setFilters((prev) => ({ ...prev, albumId: value === 'all' ? undefined : Number(value) }))
              }}
              options={albumOptions}
            />
          </ActionToolbar>
        )}
        bulkActions={selectedIds.length ? (
          <ActionToolbar>
            <span className="text-sm text-(--color-text-secondary)">{selectedIds.length} selected</span>
            <SelectInput
              label="Move to Album"
              value={bulkAlbumId}
              onChange={setBulkAlbumId}
              options={[{ label: 'No Album', value: 'none' }, ...albums.map((album) => ({ label: album.name, value: String(album.id) }))]}
            />
            <SecondaryButton onClick={handleBulkMove}>Move</SecondaryButton>
            <SecondaryButton onClick={handleSetFeatured}>Set Featured</SecondaryButton>
            <SecondaryButton onClick={handleBulkDelete}>Bulk Delete</SecondaryButton>
          </ActionToolbar>
        ) : undefined}
      >
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="grid gap-3 md:grid-cols-[1fr_220px_auto] md:items-end">
            <label className="space-y-1">
              <span className="text-xs uppercase tracking-[0.12em] text-(--color-text-secondary)">Bulk Upload Files</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(event) => setUploadFiles(Array.from(event.target.files || []))}
                className="w-full rounded-lg border border-white/15 bg-(--color-surface-soft) px-3 py-2 text-sm text-(--color-text)"
              />
            </label>
            <SelectInput
              label="Target Album"
              value={uploadAlbumId}
              onChange={setUploadAlbumId}
              options={[{ label: 'No Album', value: 'none' }, ...albums.map((album) => ({ label: album.name, value: String(album.id) }))]}
            />
            <PrimaryButton onClick={handleBulkUpload} disabled={!uploadFiles.length || uploading}>{uploading ? 'Uploading...' : 'Bulk Upload'}</PrimaryButton>
          </div>
        </div>

        {error ? <p className="rounded-xl border border-rose-300/40 bg-rose-300/15 px-3 py-2 text-sm text-rose-100">{error}</p> : null}
        {loading ? <p className="text-sm text-(--color-text-secondary)">Loading gallery images...</p> : null}
        {!loading && !items.length ? <EmptyState title="No gallery images found" description="Add your first image to populate the public gallery." /> : null}

        {!loading && items.length ? (
          <>
            <GenericDataTable<GalleryImageEntity>
              rows={items}
              rowKey={(row) => String(row.id)}
              searchTerm={search}
              searchableText={(row) => `${row.title} ${row.slug} ${row.caption || ''} ${row.photographer || ''} ${(row.tags || []).join(' ')}`}
              selectable
              pageSize={pageSize}
              onSelectionChange={setSelectedIds}
              rowActions={(row) => (
                <div className="flex flex-wrap gap-1">
                  <Link className="rounded-lg border border-white/15 px-2 py-1 text-xs" to={`/gallery/${row.id}/view`}>View</Link>
                  <Link className="rounded-lg border border-white/15 px-2 py-1 text-xs" to={`/gallery/${row.id}/edit`}>Edit</Link>
                  <button type="button" className="rounded-lg border border-white/15 px-2 py-1 text-xs" onClick={() => galleryService.update(row.id, { isFeatured: true }).then(loadGallery)}>Feature</button>
                  <button type="button" className="rounded-lg border border-rose-300/40 px-2 py-1 text-xs text-rose-200" onClick={() => setDeleteTarget(row)}>Delete</button>
                </div>
              )}
              columns={[
                {
                  key: 'preview',
                  header: 'Preview',
                  render: (row) => <img src={row.media.thumbnailUrl} alt={row.altText || row.title} className="h-12 w-16 rounded-md object-cover" loading="lazy" />,
                },
                { key: 'title', header: 'Title', sortable: true, render: (row) => row.title },
                { key: 'album', header: 'Album', sortable: true, render: (row) => row.album?.name || '-' },
                { key: 'photographer', header: 'Photographer', sortable: true, render: (row) => row.photographer || '-' },
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

            <div className="text-xs text-(--color-text-secondary)">Server pagination: page {page} of {totalPages}, total {totalItems} images</div>
            <div className="flex items-center justify-end gap-2">
              <SecondaryButton onClick={() => setPage((prev) => Math.max(1, prev - 1))} disabled={page <= 1}>Previous</SecondaryButton>
              <SecondaryButton onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))} disabled={page >= totalPages}>Next</SecondaryButton>
            </div>
          </>
        ) : null}

        <DeleteConfirmationDialog
          isOpen={Boolean(deleteTarget)}
          resourceName={deleteTarget?.title || 'gallery image'}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      </GenericListPage>
    </div>
  )
}
