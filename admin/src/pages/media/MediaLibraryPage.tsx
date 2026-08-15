import { useEffect, useMemo, useRef, useState } from 'react'

import {
  ActionToolbar,
  DeleteConfirmationDialog,
  GenericListPage,
  PrimaryButton,
  SearchBar,
  SecondaryButton,
  SelectInput,
  TextInput,
  TextareaInput,
} from '../../components/admin'
import { mediaService } from '../../services/media.service'
import { type MediaEntity, type MediaListFilters } from '../../types/media'

type ViewMode = 'grid' | 'list'
type UsageFilter = 'all' | 'used' | 'unused'

const ALLOWED_IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'] as const
const ALLOWED_IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'gif'] as const
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024
const MAX_FILES_PER_UPLOAD = 12

const SORT_OPTIONS: Array<{ label: string; value: string }> = [
  { label: 'Newest', value: 'createdAt:desc' },
  { label: 'Oldest', value: 'createdAt:asc' },
  { label: 'Title A-Z', value: 'title:asc' },
  { label: 'Title Z-A', value: 'title:desc' },
  { label: 'Largest', value: 'fileSizeBytes:desc' },
  { label: 'Smallest', value: 'fileSizeBytes:asc' },
]

const STATUS_FILTER_OPTIONS = [
  { label: 'All Status', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Archived', value: 'archived' },
]

const VISIBILITY_FILTER_OPTIONS = [
  { label: 'All Visibility', value: 'all' },
  { label: 'Public', value: 'PUBLIC' },
  { label: 'Private', value: 'PRIVATE' },
  { label: 'Unlisted', value: 'UNLISTED' },
]

const PUBLISH_STATUS_FILTER_OPTIONS = [
  { label: 'All Publish States', value: 'all' },
  { label: 'Draft', value: 'DRAFT' },
  { label: 'Review', value: 'REVIEW' },
  { label: 'Published', value: 'PUBLISHED' },
  { label: 'Unpublished', value: 'UNPUBLISHED' },
  { label: 'Archived', value: 'ARCHIVED' },
]

const USAGE_FILTER_OPTIONS = [
  { label: 'All Usage', value: 'all' },
  { label: 'Used', value: 'used' },
  { label: 'Unused', value: 'unused' },
]

function toReadableSize(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`
  }

  const kb = bytes / 1024
  if (kb < 1024) {
    return `${kb.toFixed(1)} KB`
  }

  const mb = kb / 1024
  return `${mb.toFixed(2)} MB`
}

export default function MediaLibraryPage() {
  const [items, setItems] = useState<MediaEntity[]>([])
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState<MediaListFilters>({})
  const [sort, setSort] = useState('createdAt:desc')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [activeMedia, setActiveMedia] = useState<MediaEntity | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<MediaEntity | null>(null)
  const [uploadFiles, setUploadFiles] = useState<File[]>([])
  const [uploadFolder, setUploadFolder] = useState('library/general')
  const [uploadTags, setUploadTags] = useState('')
  const [uploadAltText, setUploadAltText] = useState('')
  const [uploadCaption, setUploadCaption] = useState('')
  const [uploadDescription, setUploadDescription] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadValidationErrors, setUploadValidationErrors] = useState<string[]>([])
  const [isDraggingFiles, setIsDraggingFiles] = useState(false)
  const [usageFilter, setUsageFilter] = useState<UsageFilter>('all')

  const sentinelRef = useRef<HTMLDivElement | null>(null)

  const visibleItems = useMemo(() => {
    if (usageFilter === 'all') {
      return items
    }

    return items.filter((item) => {
      if (usageFilter === 'used') {
        return item.usageCount > 0
      }

      return item.usageCount === 0
    })
  }, [items, usageFilter])

  const folderOptions = useMemo(() => {
    const folders = new Set(items.map((item) => item.folder))
    return [{ label: 'All Folders', value: 'all' }, ...Array.from(folders).map((folder) => ({ label: folder, value: folder }))]
  }, [items])

  const tagOptions = useMemo(() => {
    const tags = new Set(items.flatMap((item) => item.tags))
    return [{ label: 'All Tags', value: 'all' }, ...Array.from(tags).map((tag) => ({ label: tag, value: tag }))]
  }, [items])

  const loadMediaPage = (nextPage: number, reset = false) => {
    const [sortBy, sortOrder] = sort.split(':') as [
      'createdAt' | 'updatedAt' | 'title' | 'fileSizeBytes' | 'width' | 'height',
      'asc' | 'desc',
    ]

    setLoading(true)
    setError(null)

    mediaService
      .list({
        page: nextPage,
        pageSize: 24,
        search,
        sortBy,
        sortOrder,
        filters,
      })
      .then((response) => {
        setPage(response.pagination.page)
        setTotalPages(response.pagination.totalPages)

        setItems((prev) => {
          if (reset) {
            return response.items
          }

          const map = new Map(prev.map((item) => [item.id, item]))
          response.items.forEach((item) => {
            map.set(item.id, item)
          })

          return Array.from(map.values())
        })
      })
      .catch((fetchError: Error) => {
        setError(fetchError.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    setItems([])
    setPage(1)
    setTotalPages(1)
    loadMediaPage(1, true)
  }, [search, filters, sort])

  useEffect(() => {
    if (!sentinelRef.current) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0]
        if (!first?.isIntersecting) {
          return
        }

        if (loading || page >= totalPages) {
          return
        }

        loadMediaPage(page + 1)
      },
      {
        rootMargin: '320px',
      },
    )

    observer.observe(sentinelRef.current)

    return () => observer.disconnect()
  }, [loading, page, totalPages])

  const toggleSelection = (id: number) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((value) => value !== id) : [...prev, id]))
  }

  const clearUploadForm = () => {
    setUploadFiles([])
    setUploadTags('')
    setUploadAltText('')
    setUploadCaption('')
    setUploadDescription('')
    setUploadValidationErrors([])
    setUploadProgress(0)
  }

  const validateUploadFiles = (files: File[]) => {
    const errors: string[] = []

    if (!files.length) {
      return { validFiles: [], errors }
    }

    if (files.length > MAX_FILES_PER_UPLOAD) {
      errors.push(`You can upload up to ${MAX_FILES_PER_UPLOAD} files at a time.`)
    }

    const validFiles = files.slice(0, MAX_FILES_PER_UPLOAD).filter((file) => {
      const extension = file.name.split('.').pop()?.toLowerCase() || ''
      const mimeAllowed = ALLOWED_IMAGE_MIME_TYPES.includes(file.type as (typeof ALLOWED_IMAGE_MIME_TYPES)[number])
      const extensionAllowed = ALLOWED_IMAGE_EXTENSIONS.includes(extension as (typeof ALLOWED_IMAGE_EXTENSIONS)[number])

      if (!mimeAllowed || !extensionAllowed) {
        errors.push(`${file.name}: unsupported file type. Allowed: JPG, PNG, WEBP, GIF.`)
        return false
      }

      if (file.size > MAX_FILE_SIZE_BYTES) {
        errors.push(`${file.name}: file exceeds 10MB limit.`)
        return false
      }

      return true
    })

    return { validFiles, errors }
  }

  const handleFilesSelected = (files: File[]) => {
    const { validFiles, errors } = validateUploadFiles(files)
    setUploadValidationErrors(errors)
    setUploadFiles(validFiles)
  }

  const handleUpload = async () => {
    if (!uploadFiles.length) {
      return
    }

    setUploading(true)
    setUploadProgress(0)
    setError(null)

    try {
      const uploaded = await mediaService.upload({
        files: uploadFiles,
        folder: uploadFolder,
        tags: uploadTags.split(',').map((item) => item.trim()).filter(Boolean),
        altText: uploadAltText || undefined,
        caption: uploadCaption || undefined,
        description: uploadDescription || undefined,
      }, setUploadProgress)

      setItems((prev) => [...uploaded, ...prev])
      clearUploadForm()
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleBulkDelete = async () => {
    if (!selectedIds.length) {
      return
    }

    const blockedItems = items.filter((item) => selectedIds.includes(item.id) && item.usageCount > 0)
    if (blockedItems.length) {
      setError(`Cannot delete ${blockedItems.length} in-use asset(s). Remove content references first.`)
      return
    }

    await Promise.all(selectedIds.map((id) => mediaService.remove(id)))
    setSelectedIds([])
    setItems((prev) => prev.filter((item) => !selectedIds.includes(item.id)))
  }

  const handleDeleteOne = async () => {
    if (!deleteTarget) {
      return
    }

    if (deleteTarget.usageCount > 0) {
      setDeleteTarget(null)
      setError('This media asset is in use and cannot be deleted until references are removed.')
      return
    }

    await mediaService.remove(deleteTarget.id)
    setItems((prev) => prev.filter((item) => item.id !== deleteTarget.id))
    setDeleteTarget(null)
    if (activeMedia?.id === deleteTarget.id) {
      setActiveMedia(null)
    }
  }

  const handleReplaceImage = async (mediaId: number, replacementFile: File) => {
    try {
      const updated = await mediaService.update(mediaId, { replacementFile })
      setItems((prev) => prev.map((item) => (item.id === updated.id ? updated : item)))
      if (activeMedia?.id === updated.id) {
        setActiveMedia(updated)
      }
    } catch (replaceError) {
      setError(replaceError instanceof Error ? replaceError.message : 'Replace failed')
    }
  }

  const handleCopy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value)
    } catch {
      setError('Clipboard permission denied in this browser context')
    }
  }

  return (
    <GenericListPage
      title="Media Library"
      description="Centralized media system for every current and future CMS module."
      actions={(
        <div className="flex flex-wrap items-center gap-2">
          <SecondaryButton onClick={() => setViewMode((prev) => (prev === 'grid' ? 'list' : 'grid'))}>
            Switch to {viewMode === 'grid' ? 'List' : 'Grid'}
          </SecondaryButton>
          <PrimaryButton onClick={handleUpload} disabled={!uploadFiles.length || uploading}>{uploading ? 'Uploading...' : 'Upload Images'}</PrimaryButton>
        </div>
      )}
      filters={(
        <ActionToolbar>
          <SearchBar value={search} onChange={setSearch} placeholder="Search by title, filename, tags, alt text..." />
          <SelectInput
            label="Sort"
            value={sort}
            onChange={setSort}
            options={SORT_OPTIONS}
          />
          <SelectInput
            label="Folder"
            value={filters.folder || 'all'}
            onChange={(value) => setFilters((prev) => ({ ...prev, folder: value === 'all' ? undefined : value }))}
            options={folderOptions}
          />
          <SelectInput
            label="Tag"
            value={filters.tag || 'all'}
            onChange={(value) => setFilters((prev) => ({ ...prev, tag: value === 'all' ? undefined : value }))}
            options={tagOptions}
          />
          <SelectInput
            label="Status"
            value={filters.status || 'all'}
            onChange={(value) => setFilters((prev) => ({ ...prev, status: value === 'all' ? undefined : value as MediaListFilters['status'] }))}
            options={STATUS_FILTER_OPTIONS}
          />
          <SelectInput
            label="Visibility"
            value={filters.visibility || 'all'}
            onChange={(value) => setFilters((prev) => ({ ...prev, visibility: value === 'all' ? undefined : value as MediaListFilters['visibility'] }))}
            options={VISIBILITY_FILTER_OPTIONS}
          />
          <SelectInput
            label="Publish"
            value={filters.publishStatus || 'all'}
            onChange={(value) => setFilters((prev) => ({ ...prev, publishStatus: value === 'all' ? undefined : value as MediaListFilters['publishStatus'] }))}
            options={PUBLISH_STATUS_FILTER_OPTIONS}
          />
          <SelectInput
            label="Usage"
            value={usageFilter}
            onChange={(value) => setUsageFilter(value as UsageFilter)}
            options={USAGE_FILTER_OPTIONS}
          />
        </ActionToolbar>
      )}
      bulkActions={selectedIds.length ? (
        <ActionToolbar>
          <span className="text-sm text-(--color-text-secondary)">{selectedIds.length} selected</span>
          <SecondaryButton onClick={() => setSelectedIds([])}>Clear</SecondaryButton>
          <SecondaryButton onClick={handleBulkDelete}>Bulk Delete</SecondaryButton>
        </ActionToolbar>
      ) : undefined}
    >
      <div className="grid gap-3 rounded-2xl border border-white/10 bg-white/3 p-3 lg:grid-cols-2">
        <TextInput label="Upload Folder" value={uploadFolder} onChange={(event) => setUploadFolder(event.target.value)} helpText="Logical path such as library/homepage or library/coaches." />
        <TextInput label="Tags (comma separated)" value={uploadTags} onChange={(event) => setUploadTags(event.target.value)} />
        <TextInput label="Alt Text (optional)" value={uploadAltText} onChange={(event) => setUploadAltText(event.target.value)} />
        <TextInput label="Caption (optional)" value={uploadCaption} onChange={(event) => setUploadCaption(event.target.value)} />
        <TextareaInput label="Description (optional)" value={uploadDescription} onChange={(event) => setUploadDescription(event.target.value)} className="lg:col-span-2" />
        <div className="lg:col-span-2">
          <label className="mb-2 block text-sm font-medium text-(--color-text)">Select Images</label>
          <div
            className={`rounded-xl border border-dashed p-4 transition ${isDraggingFiles ? 'border-cyan-300 bg-cyan-500/10' : 'border-white/20 bg-white/4'}`}
            onDragOver={(event) => {
              event.preventDefault()
              setIsDraggingFiles(true)
            }}
            onDragLeave={() => setIsDraggingFiles(false)}
            onDrop={(event) => {
              event.preventDefault()
              setIsDraggingFiles(false)
              handleFilesSelected(Array.from(event.dataTransfer.files || []))
            }}
          >
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              multiple
              onChange={(event) => handleFilesSelected(Array.from(event.target.files || []))}
              className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-(--color-text)"
            />
            <p className="mt-2 text-xs text-(--color-text-secondary)">Drag and drop files here, or browse. JPEG/PNG/WEBP/GIF supported. Max 12 files, 10MB each.</p>
          </div>
          <p className="mt-1 text-xs text-(--color-text-secondary)">{uploadFiles.length ? `${uploadFiles.length} file(s) ready` : 'Images are optimized to WebP + thumbnail during upload.'}</p>
          {uploading ? (
            <div className="mt-2">
              <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                <div className="h-full bg-cyan-400 transition-[width] duration-300" style={{ width: `${uploadProgress}%` }} />
              </div>
              <p className="mt-1 text-xs text-(--color-text-secondary)">{uploadProgress}% uploaded</p>
            </div>
          ) : null}
          {uploadValidationErrors.length ? (
            <div className="mt-2 rounded-xl border border-amber-300/35 bg-amber-300/10 px-3 py-2 text-xs text-amber-100">
              {uploadValidationErrors.map((message) => (
                <p key={message}>{message}</p>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      {error ? <p className="rounded-xl border border-rose-300/40 bg-rose-300/15 px-3 py-2 text-sm text-rose-100">{error}</p> : null}

      {viewMode === 'grid' ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {visibleItems.map((item) => (
            <article key={item.id} className="admin-card overflow-hidden rounded-2xl border border-white/12">
              <div className="relative">
                <img
                  src={item.thumbnailUrl || item.filePath}
                  alt={item.altText || item.title}
                  className="h-40 w-full cursor-pointer object-cover"
                  loading="lazy"
                  onClick={() => setActiveMedia(item)}
                />
                <label className="absolute left-2 top-2 rounded-full bg-black/60 px-2 py-1 text-xs text-white">
                  <input
                    type="checkbox"
                    className="mr-1"
                    checked={selectedIds.includes(item.id)}
                    onChange={() => toggleSelection(item.id)}
                  />
                  Select
                </label>
              </div>

              <div className="space-y-2 p-3">
                <p className="truncate text-sm font-semibold text-(--color-text)">{item.title}</p>
                <p className="truncate text-xs text-(--color-text-secondary)">{item.folder}</p>
                <p className="text-xs text-(--color-text-secondary)">{item.width}x{item.height} • {toReadableSize(item.fileSizeBytes)} • used {item.usageCount}x</p>

                <div className="flex flex-wrap gap-1">
                  <SecondaryButton className="px-3 py-1 text-xs" onClick={() => setActiveMedia(item)}>Details</SecondaryButton>
                  <SecondaryButton className="px-3 py-1 text-xs" onClick={() => handleCopy(item.filePath)}>Copy URL</SecondaryButton>
                  <SecondaryButton className="px-3 py-1 text-xs" onClick={() => handleCopy(String(item.id))}>Copy ID</SecondaryButton>
                  <SecondaryButton className="px-3 py-1 text-xs" onClick={() => setDeleteTarget(item)} disabled={item.usageCount > 0}>Delete</SecondaryButton>
                </div>

                <label className="block rounded-xl border border-dashed border-white/20 px-2 py-1 text-xs text-(--color-text-secondary)">
                  Replace Image
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(event) => {
                      const replacementFile = event.target.files?.[0]
                      if (replacementFile) {
                        void handleReplaceImage(item.id, replacementFile)
                      }
                    }}
                  />
                </label>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/12">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-white/8 text-xs uppercase tracking-[0.08em] text-(--color-text-secondary)">
              <tr>
                <th className="px-3 py-2">Select</th>
                <th className="px-3 py-2">Preview</th>
                <th className="px-3 py-2">Title</th>
                <th className="px-3 py-2">Folder</th>
                <th className="px-3 py-2">Size</th>
                <th className="px-3 py-2">Usage</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {visibleItems.map((item) => (
                <tr key={item.id} className="hover:bg-white/6">
                  <td className="px-3 py-2">
                    <input type="checkbox" checked={selectedIds.includes(item.id)} onChange={() => toggleSelection(item.id)} />
                  </td>
                  <td className="px-3 py-2">
                    <img src={item.thumbnailUrl || item.filePath} alt={item.altText || item.title} className="h-12 w-16 rounded-lg object-cover" loading="lazy" />
                  </td>
                  <td className="px-3 py-2 text-(--color-text)">{item.title}</td>
                  <td className="px-3 py-2 text-(--color-text-secondary)">{item.folder}</td>
                  <td className="px-3 py-2 text-(--color-text-secondary)">{toReadableSize(item.fileSizeBytes)}</td>
                  <td className="px-3 py-2 text-(--color-text-secondary)">{item.usageCount}</td>
                  <td className="px-3 py-2">
                    <div className="flex flex-wrap gap-1">
                      <SecondaryButton className="px-3 py-1 text-xs" onClick={() => setActiveMedia(item)}>Preview</SecondaryButton>
                      <SecondaryButton className="px-3 py-1 text-xs" onClick={() => handleCopy(item.filePath)}>Copy URL</SecondaryButton>
                      <SecondaryButton className="px-3 py-1 text-xs" onClick={() => setDeleteTarget(item)} disabled={item.usageCount > 0}>Delete</SecondaryButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {loading ? <p className="text-sm text-(--color-text-secondary)">Loading media...</p> : null}
      <div ref={sentinelRef} className="h-6" />
      {page < totalPages ? <p className="text-center text-xs text-(--color-text-secondary)">Scroll to load more</p> : <p className="text-center text-xs text-(--color-text-secondary)">All media loaded</p>}

      {activeMedia ? (
        <aside className="fixed right-0 top-0 z-40 h-full w-full max-w-md overflow-y-auto border-l border-white/15 bg-[#071b27]/96 p-4 shadow-2xl backdrop-blur md:max-w-lg">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-(--color-text)">Media Details</h3>
            <SecondaryButton onClick={() => setActiveMedia(null)}>Close</SecondaryButton>
          </div>

          <img src={activeMedia.filePath} alt={activeMedia.altText || activeMedia.title} className="h-56 w-full rounded-xl border border-white/10 object-cover" />
          <div className="mt-4 space-y-2 text-sm">
            <p className="text-(--color-text)"><span className="text-(--color-text-secondary)">Title:</span> {activeMedia.title}</p>
            <p className="text-(--color-text)"><span className="text-(--color-text-secondary)">ID:</span> {activeMedia.id}</p>
            <p className="text-(--color-text)"><span className="text-(--color-text-secondary)">Filename:</span> {activeMedia.fileName}</p>
            <p className="text-(--color-text)"><span className="text-(--color-text-secondary)">Folder:</span> {activeMedia.folder}</p>
            <p className="text-(--color-text)"><span className="text-(--color-text-secondary)">Dimensions:</span> {activeMedia.width} x {activeMedia.height}</p>
            <p className="text-(--color-text)"><span className="text-(--color-text-secondary)">Size:</span> {toReadableSize(activeMedia.fileSizeBytes)}</p>
            <p className="text-(--color-text)"><span className="text-(--color-text-secondary)">Usage Count:</span> {activeMedia.usageCount}</p>
            <p className="text-(--color-text)"><span className="text-(--color-text-secondary)">Uploaded:</span> {new Date(activeMedia.createdAt).toLocaleString()}</p>
            <p className="text-(--color-text)"><span className="text-(--color-text-secondary)">Created By:</span> {activeMedia.createdBy?.name || 'System'}</p>
            <p className="text-(--color-text)"><span className="text-(--color-text-secondary)">Alt Text:</span> {activeMedia.altText || '-'}</p>
            <p className="text-(--color-text)"><span className="text-(--color-text-secondary)">Caption:</span> {activeMedia.caption || '-'}</p>
            <p className="text-(--color-text)"><span className="text-(--color-text-secondary)">Description:</span> {activeMedia.description || '-'}</p>
            <p className="text-(--color-text)"><span className="text-(--color-text-secondary)">Tags:</span> {activeMedia.tags.join(', ') || '-'}</p>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <SecondaryButton onClick={() => handleCopy(activeMedia.filePath)}>Copy Public URL</SecondaryButton>
            <SecondaryButton onClick={() => handleCopy(String(activeMedia.id))}>Copy Image ID</SecondaryButton>
          </div>
        </aside>
      ) : null}

      <DeleteConfirmationDialog
        isOpen={Boolean(deleteTarget)}
        resourceName={deleteTarget?.title || 'media asset'}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDeleteOne}
      />
    </GenericListPage>
  )
}
