import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import {
  ActivityTimelinePlaceholder,
  FormActions,
  FormCard,
  FormSection,
  GenericEditorPage,
  MediaSelectorPlaceholder,
  PrimaryButton,
  PublishPanel,
  RevisionInfoCard,
  SEOSettingsPanel,
  SecondaryButton,
  SelectInput,
  SwitchInput,
  TextInput,
  TextareaInput,
} from '../../components/admin'
import { eventsService } from '../../services/events.service'
import { type EventMutationInput } from '../../types/events'
import { slugify } from '../../utils/slug'

type EventFormPageProps = {
  mode: 'create' | 'edit'
}

const DEFAULT_FORM: EventMutationInput = {
  title: '',
  slug: '',
  shortDescription: '',
  fullDescription: '',
  coverImageUrl: '',
  galleryImageUrls: [],
  category: '',
  difficulty: 'ALL_LEVELS',
  eventType: 'WORKSHOP',
  locationName: '',
  googleMapsUrl: '',
  startDate: new Date().toISOString(),
  endDate: undefined,
  registrationDeadline: undefined,
  startTimeLabel: '',
  endTimeLabel: '',
  maxParticipants: undefined,
  price: undefined,
  discountPrice: undefined,
  currencyCode: 'INR',
  instructorName: '',
  eventStatus: 'DRAFT',
  publishStatus: 'DRAFT',
  visibility: 'PUBLIC',
  isFeatured: false,
  seoTitle: '',
  seoDescription: '',
  metaKeywords: [],
}

function toDateTimeInput(value?: string) {
  if (!value) {
    return ''
  }

  return new Date(value).toISOString().slice(0, 16)
}

function fromDateTimeInput(value: string) {
  return value ? new Date(value).toISOString() : undefined
}

export default function EventFormPage({ mode }: EventFormPageProps) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState<EventMutationInput>(DEFAULT_FORM)
  const [loading, setLoading] = useState(mode === 'edit')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [slugTouched, setSlugTouched] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [lastAutosave, setLastAutosave] = useState<string | null>(null)
  const [scheduledPublishAt, setScheduledPublishAt] = useState('')

  const draftStorageKey = mode === 'edit' && id ? `event-form-draft-${id}` : 'event-form-draft-new'

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
        const parsed = JSON.parse(draft) as EventMutationInput
        setForm(parsed)
        setHasUnsavedChanges(true)
      } catch {
        localStorage.removeItem(draftStorageKey)
      }
    }
  }, [draftStorageKey])

  useEffect(() => {
    if (mode !== 'edit' || !id) {
      return
    }

    let cancelled = false

    eventsService
      .getById(Number(id))
      .then((event) => {
        if (cancelled) {
          return
        }

        setForm({
          title: event.title,
          slug: event.slug,
          shortDescription: event.shortDescription || '',
          fullDescription: event.fullDescription || '',
          coverImageUrl: event.coverImageUrl || '',
          galleryImageUrls: event.galleryImageUrls || [],
          category: event.category || '',
          difficulty: event.difficulty,
          eventType: event.eventType,
          locationName: event.location || '',
          googleMapsUrl: event.googleMapsUrl || '',
          startDate: event.startDate,
          endDate: event.endDate,
          registrationDeadline: event.registrationDeadline,
          startTimeLabel: event.startTime || '',
          endTimeLabel: event.endTime || '',
          maxParticipants: event.maxParticipants,
          price: event.price,
          discountPrice: event.discountPrice,
          currencyCode: event.currency,
          instructorName: event.instructor || '',
          eventStatus: event.status,
          publishStatus: event.publishStatus,
          visibility: event.visibility,
          isFeatured: event.featuredEvent,
          seoTitle: event.seoTitle || '',
          seoDescription: event.seoDescription || '',
          metaKeywords: event.metaKeywords || [],
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

  const keywordInput = useMemo(() => form.metaKeywords.join(', '), [form.metaKeywords])
  const galleryInput = useMemo(() => form.galleryImageUrls.join('\n'), [form.galleryImageUrls])

  const setField = <K extends keyof EventMutationInput>(field: K, value: EventMutationInput[K]) => {
    setHasUnsavedChanges(true)
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleCancel = () => {
    if (hasUnsavedChanges && !window.confirm('You have unsaved changes. Leave this page?')) {
      return
    }

    navigate('/events')
  }

  const handleSubmit = async () => {
    setSaving(true)
    setError(null)
    setSuccessMessage(null)

    try {
      if (mode === 'create') {
        await eventsService.create(form)
        setSuccessMessage('Event created successfully')
      } else if (id) {
        await eventsService.update(Number(id), form)
        setSuccessMessage('Event updated successfully')
      }

      localStorage.removeItem(draftStorageKey)
      setHasUnsavedChanges(false)
      setTimeout(() => navigate('/events'), 700)
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Failed to save event')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <p className="text-sm text-(--color-text-secondary)">Loading event details...</p>
  }

  return (
    <GenericEditorPage
      title={mode === 'create' ? 'Create Event' : 'Edit Event'}
      description="Production event form built using reusable content-engine components."
      actions={<Link className="text-sm text-(--color-primary)" to="/events">Back to Events</Link>}
      main={(
        <>
          {error ? <p className="mb-4 rounded-xl border border-rose-300/40 bg-rose-300/15 px-3 py-2 text-sm text-rose-100">{error}</p> : null}
          {successMessage ? <p className="mb-4 rounded-xl border border-emerald-300/40 bg-emerald-300/15 px-3 py-2 text-sm text-emerald-100">{successMessage}</p> : null}

          <FormCard>
            <div className="space-y-5">
              <FormSection title="Core Information" description="Primary event identity and classification fields.">
                <TextInput
                  label="Title"
                  value={form.title}
                  onChange={(event) => {
                    const title = event.target.value
                    setHasUnsavedChanges(true)
                    setForm((prev) => ({
                      ...prev,
                      title,
                      slug: slugTouched ? prev.slug : slugify(title),
                    }))
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
                  label="Full Description (Rich Text Ready)"
                  value={form.fullDescription || ''}
                  onChange={(event) => setField('fullDescription', event.target.value)}
                  className="sm:col-span-2"
                />
                <SelectInput
                  label="Category"
                  value={form.category || 'General'}
                  onChange={(value) => setField('category', value)}
                  options={[
                    { label: 'General', value: 'General' },
                    { label: 'Surf Clinic', value: 'Surf Clinic' },
                    { label: 'Community', value: 'Community' },
                    { label: 'Training Camp', value: 'Training Camp' },
                  ]}
                />
                <SelectInput
                  label="Difficulty"
                  value={form.difficulty}
                  onChange={(value) => setField('difficulty', value as EventMutationInput['difficulty'])}
                  options={[
                    { label: 'All Levels', value: 'ALL_LEVELS' },
                    { label: 'Beginner', value: 'BEGINNER' },
                    { label: 'Intermediate', value: 'INTERMEDIATE' },
                    { label: 'Advanced', value: 'ADVANCED' },
                  ]}
                />
                <SelectInput
                  label="Event Type"
                  value={form.eventType}
                  onChange={(value) => setField('eventType', value as EventMutationInput['eventType'])}
                  options={[
                    { label: 'Workshop', value: 'WORKSHOP' },
                    { label: 'Camp', value: 'CAMP' },
                    { label: 'Retreat', value: 'RETREAT' },
                    { label: 'Competition', value: 'COMPETITION' },
                    { label: 'Community', value: 'COMMUNITY' },
                    { label: 'Private Session', value: 'PRIVATE_SESSION' },
                    { label: 'Other', value: 'OTHER' },
                  ]}
                />
              </FormSection>

              <FormSection title="Media" description="Image architecture ready for media library integration.">
                <TextInput label="Cover Image URL" value={form.coverImageUrl || ''} onChange={(event) => setField('coverImageUrl', event.target.value)} />
                <TextareaInput
                  label="Gallery Images URLs (one per line)"
                  value={galleryInput}
                  onChange={(event) => setField('galleryImageUrls', event.target.value.split('\n').map((line) => line.trim()).filter(Boolean))}
                />
                {form.coverImageUrl ? (
                  <div className="sm:col-span-2 overflow-hidden rounded-xl border border-white/10">
                    <img src={form.coverImageUrl} alt="Cover preview" className="h-56 w-full object-cover" />
                  </div>
                ) : null}
              </FormSection>

              <FormSection title="Schedule and Location" description="Date/time and location controls.">
                <TextInput
                  label="Start Date"
                  type="datetime-local"
                  value={toDateTimeInput(form.startDate)}
                  onChange={(event) => setField('startDate', fromDateTimeInput(event.target.value) || new Date().toISOString())}
                />
                <TextInput
                  label="End Date"
                  type="datetime-local"
                  value={toDateTimeInput(form.endDate)}
                  onChange={(event) => setField('endDate', fromDateTimeInput(event.target.value))}
                />
                <TextInput
                  label="Registration Deadline"
                  type="datetime-local"
                  value={toDateTimeInput(form.registrationDeadline)}
                  onChange={(event) => setField('registrationDeadline', fromDateTimeInput(event.target.value))}
                />
                <TextInput label="Start Time" value={form.startTimeLabel || ''} onChange={(event) => setField('startTimeLabel', event.target.value)} />
                <TextInput label="End Time" value={form.endTimeLabel || ''} onChange={(event) => setField('endTimeLabel', event.target.value)} />
                <TextInput label="Location" value={form.locationName || ''} onChange={(event) => setField('locationName', event.target.value)} />
                <TextInput label="Google Maps URL" value={form.googleMapsUrl || ''} onChange={(event) => setField('googleMapsUrl', event.target.value)} className="sm:col-span-2" />
              </FormSection>

              <FormSection title="Capacity and Commercial" description="Capacity and pricing controls.">
                <TextInput
                  label="Maximum Participants"
                  type="number"
                  value={form.maxParticipants || ''}
                  onChange={(event) => setField('maxParticipants', event.target.value ? Number(event.target.value) : undefined)}
                />
                <TextInput label="Current Participants (Read Only)" value="System managed" disabled />
                <TextInput label="Price" type="number" value={form.price || ''} onChange={(event) => setField('price', event.target.value ? Number(event.target.value) : undefined)} />
                <TextInput label="Discount Price" type="number" value={form.discountPrice || ''} onChange={(event) => setField('discountPrice', event.target.value ? Number(event.target.value) : undefined)} />
                <SelectInput
                  label="Currency"
                  value={form.currencyCode}
                  onChange={(value) => setField('currencyCode', value as EventMutationInput['currencyCode'])}
                  options={[{ label: 'INR', value: 'INR' }, { label: 'USD', value: 'USD' }, { label: 'EUR', value: 'EUR' }, { label: 'GBP', value: 'GBP' }]}
                />
                <TextInput label="Instructor" value={form.instructorName || ''} onChange={(event) => setField('instructorName', event.target.value)} />
                <SelectInput
                  label="Status"
                  value={form.eventStatus}
                  onChange={(value) => setField('eventStatus', value as EventMutationInput['eventStatus'])}
                  options={[
                    { label: 'Draft', value: 'DRAFT' },
                    { label: 'Scheduled', value: 'SCHEDULED' },
                    { label: 'Live', value: 'LIVE' },
                    { label: 'Completed', value: 'COMPLETED' },
                    { label: 'Cancelled', value: 'CANCELLED' },
                  ]}
                />
                <SwitchInput label="Featured Event" checked={form.isFeatured} onChange={(checked) => setField('isFeatured', checked)} />
              </FormSection>

              <FormActions>
                <span className="mr-auto text-xs text-(--color-text-secondary)">
                  {lastAutosave ? `Autosaved at ${lastAutosave}` : 'Autosave ready'}
                </span>
                <SecondaryButton onClick={handleCancel}>Cancel</SecondaryButton>
                <PrimaryButton onClick={handleSubmit} disabled={saving}>{saving ? 'Saving...' : 'Save Event'}</PrimaryButton>
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
            onPublishStatusChange={(value) => setField('publishStatus', value as EventMutationInput['publishStatus'])}
            onVisibilityChange={(value) => setField('visibility', value as EventMutationInput['visibility'])}
            onFeaturedChange={(checked) => setField('isFeatured', checked)}
            onScheduledPublishAtChange={setScheduledPublishAt}
          />

          <SEOSettingsPanel
            seoTitle={form.seoTitle || ''}
            seoDescription={form.seoDescription || ''}
            metaKeywords={keywordInput}
            onSeoTitleChange={(value) => setField('seoTitle', value)}
            onSeoDescriptionChange={(value) => setField('seoDescription', value)}
            onMetaKeywordsChange={(value) => setField('metaKeywords', value.split(',').map((item) => item.trim()).filter(Boolean))}
          />

          <MediaSelectorPlaceholder />
          <RevisionInfoCard />
          <ActivityTimelinePlaceholder />
        </>
      )}
    />
  )
}
