import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import {
  FormActions,
  FormCard,
  FormSection,
  GenericEditorPage,
  MediaPickerModal,
  PrimaryButton,
  PublishPanel,
  SecondaryButton,
  SelectInput,
  TextInput,
  TextareaInput,
} from '../../components/admin'
import { galleryService } from '../../services/gallery.service'
import { type GalleryAlbumEntity, type GalleryImageMutationInput } from '../../types/gallery'
import { type MediaEntity } from '../../types/media'
import { slugify } from '../../utils/slug'

type GalleryFormPageProps = {
  mode: 'create' | 'edit'
}

const DEFAULT_FORM: GalleryImageMutationInput = {
  title: '',
  slug: '',
  altText: '',
  caption: '',
  description: '',
  albumId: undefined,
  mediaId: undefined,
  tags: [],
  photographer: '',
  isFeatured: false,
  displayOrder: 0,
  status: 'active',
  publishStatus: 'DRAFT',
  visibility: 'PUBLIC',
}

function csvToTags(value: string) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

export default function GalleryFormPage({ mode }: GalleryFormPageProps) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState<GalleryImageMutationInput>(DEFAULT_FORM)
  const [albums, setAlbums] = useState<GalleryAlbumEntity[]>([])
  const [selectedMedia, setSelectedMedia] = useState<MediaEntity | null>(null)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [loading, setLoading] = useState(mode === 'edit')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [slugTouched, setSlugTouched] = useState(false)
  const [scheduledPublishAt, setScheduledPublishAt] = useState('')

  useEffect(() => {
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
  }, [])

  useEffect(() => {
    if (mode !== 'edit' || !id) {
      setLoading(false)
      return
    }

    let cancelled = false

    galleryService
      .getById(Number(id))
      .then((item) => {
        if (cancelled) {
          return
        }

        setForm({
          title: item.title,
          slug: item.slug,
          altText: item.altText || '',
          caption: item.caption || '',
          description: item.description || '',
          albumId: item.album?.id,
          mediaId: item.media.id,
          tags: item.tags || [],
          photographer: item.photographer || '',
          isFeatured: item.isFeatured,
          displayOrder: item.displayOrder,
          status: item.status,
          publishStatus: item.publishStatus,
          visibility: item.visibility,
        })

        setSelectedMedia({
          id: item.media.id,
          uuid: '',
          slug: '',
          title: item.media.title,
          description: '',
          status: 'active',
          publishStatus: item.publishStatus,
          visibility: item.visibility,
          mediaType: 'IMAGE',
          mimeType: 'image/webp',
          fileName: '',
          filePath: item.media.imageUrl,
          fileSizeBytes: 0,
          width: item.media.width || 0,
          height: item.media.height || 0,
          altText: item.altText,
          caption: item.caption,
          tags: item.tags,
          folder: 'gallery',
          thumbnailUrl: item.media.thumbnailUrl,
          usageCount: 0,
          createdAt: item.audit.createdAt,
          updatedAt: item.audit.updatedAt,
        })
        setLoading(false)
      })
      .catch((fetchError: Error) => {
        if (!cancelled) {
          setError(fetchError.message)
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [id, mode])

  const tagsInput = useMemo(() => form.tags.join(', '), [form.tags])

  const setField = <K extends keyof GalleryImageMutationInput>(field: K, value: GalleryImageMutationInput[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    setSaving(true)
    setError(null)
    setSuccessMessage(null)

    try {
      if (!form.mediaId) {
        throw new Error('Select an image from the media library')
      }

      if (mode === 'create') {
        await galleryService.create(form)
        setSuccessMessage('Gallery image created successfully')
      } else if (id) {
        await galleryService.update(Number(id), form)
        setSuccessMessage('Gallery image updated successfully')
      }

      setTimeout(() => navigate('/gallery'), 700)
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Failed to save gallery image')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <p className="text-sm text-(--color-text-secondary)">Loading gallery image details...</p>
  }

  return (
    <GenericEditorPage
      title={mode === 'create' ? 'Create Gallery Image' : 'Edit Gallery Image'}
      description="Manage metadata, album assignment, and publish visibility for gallery images."
      actions={<Link className="text-sm text-(--color-primary)" to="/gallery">Back to Gallery</Link>}
      main={(
        <>
          {error ? <p className="mb-4 rounded-xl border border-rose-300/40 bg-rose-300/15 px-3 py-2 text-sm text-rose-100">{error}</p> : null}
          {successMessage ? <p className="mb-4 rounded-xl border border-emerald-300/40 bg-emerald-300/15 px-3 py-2 text-sm text-emerald-100">{successMessage}</p> : null}

          <FormCard>
            <div className="space-y-5">
              <FormSection title="Image Details" description="Primary gallery content fields.">
                <TextInput
                  label="Title"
                  value={form.title}
                  onChange={(event) => {
                    const title = event.target.value
                    setField('title', title)
                    if (!slugTouched) {
                      setField('slug', slugify(title))
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
                <SelectInput
                  label="Album"
                  value={form.albumId ? String(form.albumId) : 'none'}
                  onChange={(value) => setField('albumId', value === 'none' ? undefined : Number(value))}
                  options={[{ label: 'No Album', value: 'none' }, ...albums.map((album) => ({ label: album.name, value: String(album.id) }))]}
                />
                <TextInput label="Photographer" value={form.photographer || ''} onChange={(event) => setField('photographer', event.target.value)} />
                <TextInput label="Alt Text" value={form.altText || ''} onChange={(event) => setField('altText', event.target.value)} className="sm:col-span-2" />
                <TextareaInput label="Caption" value={form.caption || ''} onChange={(event) => setField('caption', event.target.value)} className="sm:col-span-2" />
                <TextareaInput label="Description" value={form.description || ''} onChange={(event) => setField('description', event.target.value)} className="sm:col-span-2" />
                <TextInput
                  label="Tags"
                  value={tagsInput}
                  onChange={(event) => setField('tags', csvToTags(event.target.value))}
                  className="sm:col-span-2"
                  helpText="Comma-separated tags"
                />
                <TextInput label="Display Order" type="number" value={form.displayOrder} onChange={(event) => setField('displayOrder', Number(event.target.value))} />
                <SelectInput
                  label="Status"
                  value={form.status}
                  onChange={(value) => setField('status', value as GalleryImageMutationInput['status'])}
                  options={[
                    { label: 'Active', value: 'active' },
                    { label: 'Inactive', value: 'inactive' },
                  ]}
                />
              </FormSection>

              <FormSection title="Media Library" description="Select image from existing Media Library.">
                <div className="sm:col-span-2 flex flex-wrap items-center gap-3">
                  <SecondaryButton onClick={() => setPickerOpen(true)}>{selectedMedia ? 'Change Image' : 'Select Image'}</SecondaryButton>
                  {selectedMedia ? <span className="text-sm text-(--color-text-secondary)">Selected: {selectedMedia.title}</span> : null}
                </div>
                {selectedMedia ? <img src={selectedMedia.thumbnailUrl || selectedMedia.filePath} alt={selectedMedia.altText || selectedMedia.title} className="h-48 w-full rounded-xl object-cover sm:col-span-2" loading="lazy" /> : null}
              </FormSection>

              <FormActions>
                <SecondaryButton onClick={() => navigate('/gallery')}>Cancel</SecondaryButton>
                <PrimaryButton onClick={handleSubmit} disabled={saving}>{saving ? 'Saving...' : 'Save Gallery Image'}</PrimaryButton>
              </FormActions>
            </div>
          </FormCard>

          <MediaPickerModal
            isOpen={pickerOpen}
            onClose={() => setPickerOpen(false)}
            allowMultiple={false}
            onSelect={(mediaItems) => {
              const item = mediaItems[0]
              if (!item) {
                return
              }

              setSelectedMedia(item)
              setField('mediaId', item.id)
              if (!form.altText) {
                setField('altText', item.altText || item.title)
              }
            }}
            title="Select Gallery Image"
          />
        </>
      )}
      sidebar={(
        <PublishPanel
          publishStatus={form.publishStatus}
          visibility={form.visibility}
          featured={form.isFeatured}
          scheduledPublishAt={scheduledPublishAt}
          onPublishStatusChange={(value) => setField('publishStatus', value as GalleryImageMutationInput['publishStatus'])}
          onVisibilityChange={(value) => setField('visibility', value as GalleryImageMutationInput['visibility'])}
          onFeaturedChange={(checked) => setField('isFeatured', checked)}
          onScheduledPublishAtChange={setScheduledPublishAt}
        />
      )}
    />
  )
}
