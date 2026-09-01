import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import {
  ActivityTimelinePlaceholder,
  FormActions,
  FormCard,
  FormSection,
  GenericEditorPage,
  MediaSelectorPlaceholder,
  MultiSelectInput,
  PrimaryButton,
  PublishPanel,
  RevisionInfoCard,
  SEOSettingsPanel,
  SecondaryButton,
  SelectInput,
  TextInput,
  TextareaInput,
} from '../../components/admin'
import { lessonsService } from '../../services/lessons.service'
import { experiencesService } from '../../services/experiences.service'
import { type LessonEntity } from '../../types/lessons'
import { type ExperienceMutationInput, type ExperienceAvailability } from '../../types/experiences'
import { slugify } from '../../utils/slug'

type ExperienceFormPageProps = {
  mode: 'create' | 'edit'
}

const DEFAULT_FORM: ExperienceMutationInput = {
  title: '',
  slug: '',
  shortDescription: '',
  fullDescription: '',
  coverImageUrl: '',
  galleryImageUrls: [],
  category: '',
  difficulty: 'ALL_LEVELS',
  recommendedAge: '',
  duration: '',
  maxParticipants: undefined,
  basePrice: undefined,
  discountPrice: undefined,
  instructor: '',
  linkedLessonIds: [],
  status: 'active',
  publishStatus: 'DRAFT',
  visibility: 'PUBLIC',
  isFeatured: false,
  displayOrder: 0,
  seoTitle: '',
  seoDescription: '',
  availability: [],
}

export default function ExperienceFormPage({ mode }: ExperienceFormPageProps) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState<ExperienceMutationInput>(DEFAULT_FORM)
  const [loading, setLoading] = useState(mode === 'edit')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [slugTouched, setSlugTouched] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [lastAutosave, setLastAutosave] = useState<string | null>(null)
  const [scheduledPublishAt, setScheduledPublishAt] = useState('')
  const [lessonOptions, setLessonOptions] = useState<LessonEntity[]>([])

  const draftStorageKey = mode === 'edit' && id ? `experience-form-draft-${id}` : 'experience-form-draft-new'

  useEffect(() => {
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!hasUnsavedChanges) {
        return
      }

      event.preventDefault()
      event.returnValue = ''
    }

    window.addEventListener('beforeunload', onBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', onBeforeUnload)
    }
  }, [hasUnsavedChanges])

  useEffect(() => {
    const draft = localStorage.getItem(draftStorageKey)
    if (draft) {
      try {
        const parsed = JSON.parse(draft) as ExperienceMutationInput
        setForm(parsed)
        setHasUnsavedChanges(true)
      } catch {
        localStorage.removeItem(draftStorageKey)
      }
    }
  }, [draftStorageKey])

  useEffect(() => {
    lessonsService
      .list({
        page: 1,
        pageSize: 100,
        search: '',
        sortBy: 'title',
        sortOrder: 'asc',
        filters: { quickFilter: 'all' },
      })
      .then((result) => setLessonOptions(result.items))
      .catch((fetchError: Error) => {
        setLessonOptions([])
        setError(fetchError.message)
      })
  }, [])

  useEffect(() => {
    if (mode !== 'edit' || !id) {
      setLoading(false)
      return
    }

    let cancelled = false

    experiencesService
      .getById(Number(id))
      .then((experience) => {
        if (cancelled) {
          return
        }

        setForm({
          title: experience.title,
          slug: experience.slug,
          shortDescription: experience.shortDescription || '',
          fullDescription: experience.fullDescription || '',
          coverImageUrl: experience.coverImageUrl || '',
          galleryImageUrls: experience.galleryImageUrls || [],
          category: experience.category || '',
          difficulty: experience.difficulty,
          recommendedAge: experience.recommendedAge || '',
          duration: experience.duration || '',
          maxParticipants: experience.maxParticipants,
          basePrice: experience.basePrice,
          discountPrice: experience.discountPrice,
          instructor: experience.instructor || '',
          linkedLessonIds: experience.linkedLessonIds || [],
          status: experience.status,
          publishStatus: experience.publishStatus,
          visibility: experience.visibility,
          isFeatured: experience.isFeatured,
          displayOrder: experience.displayOrder,
          seoTitle: experience.seoTitle || '',
          seoDescription: experience.seoDescription || '',
          availability: experience.availability || [],
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

  useEffect(() => {
    if (!hasUnsavedChanges) {
      return
    }

    const handle = window.setTimeout(() => {
      localStorage.setItem(draftStorageKey, JSON.stringify(form))
      setLastAutosave(new Date().toLocaleTimeString())
    }, 900)

    return () => window.clearTimeout(handle)
  }, [form, draftStorageKey, hasUnsavedChanges])

  const galleryInput = useMemo(() => form.galleryImageUrls.join('\n'), [form.galleryImageUrls])
  const availabilityInput = useMemo(() => (form.availability || []).flatMap((day) => day.slots.map((slot) => `${day.date}|${slot.startTime}|${slot.endTime || ''}|${slot.capacity || ''}|${day.isActive === false || slot.isActive === false ? 'inactive' : 'active'}`)).join('\n'), [form.availability])

  const setField = <K extends keyof ExperienceMutationInput>(field: K, value: ExperienceMutationInput[K]) => {
    setHasUnsavedChanges(true)
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleCancel = () => {
    if (hasUnsavedChanges && !window.confirm('You have unsaved changes. Leave this page?')) {
      return
    }

    navigate('/experiences')
  }

  const handleSubmit = async () => {
    setSaving(true)
    setError(null)
    setSuccessMessage(null)

    try {
      if (mode === 'create') {
        await experiencesService.create(form)
        setSuccessMessage('Experience created successfully')
      } else if (id) {
        await experiencesService.update(Number(id), form)
        setSuccessMessage('Experience updated successfully')
      }

      localStorage.removeItem(draftStorageKey)
      setHasUnsavedChanges(false)
      setTimeout(() => navigate('/experiences'), 700)
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Failed to save experience')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <p className="text-sm text-(--color-text-secondary)">Loading experience details...</p>
  }

  return (
    <GenericEditorPage
      title={mode === 'create' ? 'Create Experience' : 'Edit Experience'}
      description="Create and manage surf experiences while linking multiple lessons."
      actions={<Link className="text-sm text-(--color-primary)" to="/experiences">Back to Experiences</Link>}
      main={(
        <>
          {error ? <p className="mb-4 rounded-xl border border-rose-300/40 bg-rose-300/15 px-3 py-2 text-sm text-rose-100">{error}</p> : null}
          {successMessage ? <p className="mb-4 rounded-xl border border-emerald-300/40 bg-emerald-300/15 px-3 py-2 text-sm text-emerald-100">{successMessage}</p> : null}

          <FormCard>
            <div className="space-y-5">
              <FormSection title="Core Experience Information" description="Primary experience identity and guest-facing overview.">
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
                  helpText="Auto generated from title until manually edited."
                />
                <TextareaInput
                  label="Short Description"
                  value={form.shortDescription || ''}
                  onChange={(event) => setField('shortDescription', event.target.value)}
                  className="sm:col-span-2"
                  helpText={`${(form.shortDescription || '').length}/240 characters`}
                />
                <TextareaInput
                  label="Full Description"
                  value={form.fullDescription || ''}
                  onChange={(event) => setField('fullDescription', event.target.value)}
                  className="sm:col-span-2"
                />

                <TextInput label="Category" value={form.category || ''} onChange={(event) => setField('category', event.target.value)} />
                <SelectInput
                  label="Difficulty"
                  value={form.difficulty}
                  onChange={(value) => setField('difficulty', value as ExperienceMutationInput['difficulty'])}
                  options={[
                    { label: 'All Levels', value: 'ALL_LEVELS' },
                    { label: 'Beginner', value: 'BEGINNER' },
                    { label: 'Intermediate', value: 'INTERMEDIATE' },
                    { label: 'Advanced', value: 'ADVANCED' },
                  ]}
                />
                <TextInput label="Recommended Age" value={form.recommendedAge || ''} onChange={(event) => setField('recommendedAge', event.target.value)} />
                <TextInput label="Duration" value={form.duration || ''} onChange={(event) => setField('duration', event.target.value)} />
                <TextInput label="Maximum Participants" type="number" value={form.maxParticipants || ''} onChange={(event) => setField('maxParticipants', event.target.value ? Number(event.target.value) : undefined)} />
                <TextInput label="Base Price" type="number" value={form.basePrice || ''} onChange={(event) => setField('basePrice', event.target.value ? Number(event.target.value) : undefined)} />
                <TextInput label="Discount Price" type="number" value={form.discountPrice || ''} onChange={(event) => setField('discountPrice', event.target.value ? Number(event.target.value) : undefined)} />
                <TextInput label="Instructor" value={form.instructor || ''} onChange={(event) => setField('instructor', event.target.value)} />
                <TextInput label="Display Order" type="number" value={form.displayOrder} onChange={(event) => setField('displayOrder', Number(event.target.value))} />
                <SelectInput
                  label="Status"
                  value={form.status}
                  onChange={(value) => setField('status', value as ExperienceMutationInput['status'])}
                  options={[
                    { label: 'Active', value: 'active' },
                    { label: 'Inactive', value: 'inactive' },
                  ]}
                />
              </FormSection>

              <FormSection title="Linked Lessons" description="Associate one or more lessons with this experience.">
                <MultiSelectInput
                  label="Linked Lessons"
                  values={form.linkedLessonIds.map(String)}
                  options={lessonOptions.map((lesson) => ({
                    label: `${lesson.title} (${lesson.difficulty})`,
                    value: String(lesson.id),
                  }))}
                  onChange={(values) => setField('linkedLessonIds', values.map((value) => Number(value)).filter(Number.isFinite))}
                />
              </FormSection>

              <FormSection title="Availability and Time Slots" description="One slot per line: YYYY-MM-DD|start|end|capacity|active. Only active configured slots are bookable.">
                <TextareaInput label="Available Dates and Slots" value={availabilityInput} className="sm:col-span-2" onChange={(event) => {
                  const grouped = new Map<string, ExperienceAvailability>()
                  event.target.value.split('\n').map((line) => line.trim()).filter(Boolean).forEach((line) => {
                    const [date, startTime, endTime, capacity, status] = line.split('|').map((part) => part.trim())
                    if (!date || !startTime) return
                    const day = grouped.get(date) || { date, isActive: status !== 'inactive', slots: [] }
                    day.slots.push({ startTime, endTime: endTime || undefined, capacity: capacity ? Number(capacity) : undefined, isActive: status !== 'inactive' })
                    grouped.set(date, day)
                  })
                  setField('availability', Array.from(grouped.values()))
                }} />
              </FormSection>

              <FormSection title="Media and SEO" description="Cover image, gallery image URLs, and SEO metadata.">
                <TextInput label="Cover Image URL" value={form.coverImageUrl || ''} onChange={(event) => setField('coverImageUrl', event.target.value)} />
                {form.coverImageUrl ? <img src={form.coverImageUrl} alt="Cover preview" className="h-40 w-full rounded-xl object-cover sm:col-span-2" /> : null}
                <TextareaInput
                  label="Gallery Image URLs"
                  value={galleryInput}
                  onChange={(event) => {
                    const urls = event.target.value
                      .split('\n')
                      .map((line) => line.trim())
                      .filter(Boolean)
                    setField('galleryImageUrls', urls)
                  }}
                  className="sm:col-span-2"
                  helpText="One URL per line. This keeps the module future-ready for richer image workflows."
                />
                <TextInput label="SEO Title" value={form.seoTitle || ''} onChange={(event) => setField('seoTitle', event.target.value)} />
                <TextareaInput label="SEO Description" value={form.seoDescription || ''} onChange={(event) => setField('seoDescription', event.target.value)} className="sm:col-span-2" />
              </FormSection>

              <FormActions>
                {lastAutosave ? <p className="text-xs text-(--color-text-secondary)">Last autosave: {lastAutosave}</p> : null}
                <SecondaryButton onClick={handleCancel}>Cancel</SecondaryButton>
                <PrimaryButton onClick={handleSubmit} disabled={saving}>{saving ? 'Saving...' : 'Save Experience'}</PrimaryButton>
              </FormActions>
            </div>
          </FormCard>
        </>
      )}
      sidebar={(
        <>
          <PublishPanel
            publishStatus={form.publishStatus}
            visibility={form.visibility}
            featured={form.isFeatured}
            scheduledPublishAt={scheduledPublishAt}
            onPublishStatusChange={(value) => setField('publishStatus', value as ExperienceMutationInput['publishStatus'])}
            onVisibilityChange={(value) => setField('visibility', value as ExperienceMutationInput['visibility'])}
            onFeaturedChange={(checked) => setField('isFeatured', checked)}
            onScheduledPublishAtChange={setScheduledPublishAt}
          />
          <SEOSettingsPanel
            seoTitle={form.seoTitle || ''}
            seoDescription={form.seoDescription || ''}
            metaKeywords=""
            onSeoTitleChange={(value) => setField('seoTitle', value)}
            onSeoDescriptionChange={(value) => setField('seoDescription', value)}
            onMetaKeywordsChange={() => {}}
          />
          <MediaSelectorPlaceholder allowMultiple />
          <RevisionInfoCard
            author="Experience Manager"
            createdAt={mode === 'create' ? undefined : new Date().toISOString()}
            updatedAt={new Date().toISOString()}
          />
          <ActivityTimelinePlaceholder />
        </>
      )}
    />
  )
}
