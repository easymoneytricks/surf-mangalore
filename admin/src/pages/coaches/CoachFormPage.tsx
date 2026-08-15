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
  TextInput,
  TextareaInput,
} from '../../components/admin'
import { coachesService } from '../../services/coaches.service'
import { type MediaEntity } from '../../types/media'
import { type CoachMutationInput } from '../../types/coaches'
import { slugify } from '../../utils/slug'

type CoachFormPageProps = {
  mode: 'create' | 'edit'
}

const DEFAULT_FORM: CoachMutationInput = {
  fullName: '',
  slug: '',
  profilePhotoUrl: '',
  coverPhotoUrl: '',
  jobTitle: '',
  shortBio: '',
  fullBio: '',
  yearsOfExperience: undefined,
  specialization: [],
  languages: [],
  certifications: [],
  phone: '',
  email: '',
  instagramUrl: '',
  facebookUrl: '',
  linkedinUrl: '',
  websiteUrl: '',
  status: 'active',
  publishStatus: 'DRAFT',
  visibility: 'PUBLIC',
  isFeatured: false,
  displayOrder: 0,
  seoTitle: '',
  seoDescription: '',
}

function csvToList(value: string) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

function listToCsv(value: string[]) {
  return value.join(', ')
}

export default function CoachFormPage({ mode }: CoachFormPageProps) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState<CoachMutationInput>(DEFAULT_FORM)
  const [loading, setLoading] = useState(mode === 'edit')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [slugTouched, setSlugTouched] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [lastAutosave, setLastAutosave] = useState<string | null>(null)
  const [scheduledPublishAt, setScheduledPublishAt] = useState('')

  const handleSelectProfilePhoto = (items: MediaEntity[]) => {
    const selected = items[0]
    if (!selected) {
      return
    }

    setField('profilePhotoUrl', selected.filePath)
  }

  const handleSelectCoverPhoto = (items: MediaEntity[]) => {
    const selected = items[0]
    if (!selected) {
      return
    }

    setField('coverPhotoUrl', selected.filePath)
  }

  const draftStorageKey = mode === 'edit' && id ? `coach-form-draft-${id}` : 'coach-form-draft-new'

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
        const parsed = JSON.parse(draft) as CoachMutationInput
        setForm(parsed)
        setHasUnsavedChanges(true)
      } catch {
        localStorage.removeItem(draftStorageKey)
      }
    }
  }, [draftStorageKey])

  useEffect(() => {
    if (mode !== 'edit' || !id) {
      setLoading(false)
      return
    }

    let cancelled = false

    coachesService
      .getById(Number(id))
      .then((coach) => {
        if (cancelled) {
          return
        }

        setForm({
          fullName: coach.fullName,
          slug: coach.slug,
          profilePhotoUrl: coach.profilePhotoUrl || '',
          coverPhotoUrl: coach.coverPhotoUrl || '',
          jobTitle: coach.jobTitle,
          shortBio: coach.shortBio || '',
          fullBio: coach.fullBio || '',
          yearsOfExperience: coach.yearsOfExperience,
          specialization: coach.specialization || [],
          languages: coach.languages || [],
          certifications: coach.certifications || [],
          phone: coach.phone || '',
          email: coach.email || '',
          instagramUrl: coach.socialLinks.instagram || '',
          facebookUrl: coach.socialLinks.facebook || '',
          linkedinUrl: coach.socialLinks.linkedin || '',
          websiteUrl: coach.socialLinks.website || coach.website || '',
          status: coach.status,
          publishStatus: coach.publishStatus,
          visibility: coach.visibility,
          isFeatured: coach.isFeatured,
          displayOrder: coach.displayOrder,
          seoTitle: coach.seoTitle || '',
          seoDescription: coach.seoDescription || '',
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

  const specializationText = useMemo(() => listToCsv(form.specialization), [form.specialization])
  const languagesText = useMemo(() => listToCsv(form.languages), [form.languages])
  const certificationsText = useMemo(() => listToCsv(form.certifications), [form.certifications])

  const setField = <K extends keyof CoachMutationInput>(field: K, value: CoachMutationInput[K]) => {
    setHasUnsavedChanges(true)
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleCancel = () => {
    if (hasUnsavedChanges && !window.confirm('You have unsaved changes. Leave this page?')) {
      return
    }

    navigate('/coaches')
  }

  const handleSubmit = async () => {
    setSaving(true)
    setError(null)
    setSuccessMessage(null)

    try {
      if (mode === 'create') {
        await coachesService.create(form)
        setSuccessMessage('Coach created successfully')
      } else if (id) {
        await coachesService.update(Number(id), form)
        setSuccessMessage('Coach updated successfully')
      }

      localStorage.removeItem(draftStorageKey)
      setHasUnsavedChanges(false)
      setTimeout(() => navigate('/coaches'), 700)
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Failed to save coach')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <p className="text-sm text-(--color-text-secondary)">Loading coach details...</p>
  }

  return (
    <GenericEditorPage
      title={mode === 'create' ? 'Create Coach' : 'Edit Coach'}
      description="Create and manage coach profiles used across the public website."
      actions={<Link className="text-sm text-(--color-primary)" to="/coaches">Back to Coaches</Link>}
      main={(
        <>
          {error ? <p className="mb-4 rounded-xl border border-rose-300/40 bg-rose-300/15 px-3 py-2 text-sm text-rose-100">{error}</p> : null}
          {successMessage ? <p className="mb-4 rounded-xl border border-emerald-300/40 bg-emerald-300/15 px-3 py-2 text-sm text-emerald-100">{successMessage}</p> : null}

          <FormCard>
            <div className="space-y-5">
              <FormSection title="Coach Identity" description="Core public profile details and teaching role.">
                <TextInput
                  label="Full Name"
                  value={form.fullName}
                  onChange={(event) => {
                    const fullName = event.target.value
                    setField('fullName', fullName)
                    if (!slugTouched) {
                      setField('slug', slugify(fullName))
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
                  helpText="Auto generated from full name until manually edited."
                />
                <TextInput label="Job Title" value={form.jobTitle} onChange={(event) => setField('jobTitle', event.target.value)} />
                <TextInput label="Years of Experience" type="number" value={form.yearsOfExperience || ''} onChange={(event) => setField('yearsOfExperience', event.target.value ? Number(event.target.value) : undefined)} />
                <TextareaInput
                  label="Short Bio"
                  value={form.shortBio || ''}
                  onChange={(event) => setField('shortBio', event.target.value)}
                  className="sm:col-span-2"
                  helpText={`${(form.shortBio || '').length}/280 characters`}
                />
                <TextareaInput
                  label="Full Bio"
                  value={form.fullBio || ''}
                  onChange={(event) => setField('fullBio', event.target.value)}
                  className="sm:col-span-2"
                />
              </FormSection>

              <FormSection title="Skills and Credentials" description="Comma-separated lists to keep entries structured.">
                <TextareaInput
                  label="Specialization"
                  value={specializationText}
                  onChange={(event) => setField('specialization', csvToList(event.target.value))}
                  className="sm:col-span-2"
                  helpText="Example: Beginner coaching, Longboard technique, Ocean safety"
                />
                <TextareaInput
                  label="Languages"
                  value={languagesText}
                  onChange={(event) => setField('languages', csvToList(event.target.value))}
                  helpText="Example: English, Hindi, Kannada"
                />
                <TextareaInput
                  label="Certifications"
                  value={certificationsText}
                  onChange={(event) => setField('certifications', csvToList(event.target.value))}
                />
              </FormSection>

              <FormSection title="Contact and Media" description="Public image and social links for profile sections.">
                <TextInput label="Profile Photo URL" value={form.profilePhotoUrl || ''} onChange={(event) => setField('profilePhotoUrl', event.target.value)} className="sm:col-span-2" />
                <MediaSelectorPlaceholder onSelect={handleSelectProfilePhoto} allowMultiple={false} />
                {form.profilePhotoUrl ? <img src={form.profilePhotoUrl} alt="Coach profile preview" className="h-40 w-full rounded-xl object-cover sm:col-span-2" /> : null}
                <TextInput label="Cover Photo URL" value={form.coverPhotoUrl || ''} onChange={(event) => setField('coverPhotoUrl', event.target.value)} className="sm:col-span-2" />
                <MediaSelectorPlaceholder onSelect={handleSelectCoverPhoto} allowMultiple={false} />
                {form.coverPhotoUrl ? <img src={form.coverPhotoUrl} alt="Coach cover preview" className="h-40 w-full rounded-xl object-cover sm:col-span-2" /> : null}
                <TextInput label="Email" value={form.email || ''} onChange={(event) => setField('email', event.target.value)} />
                <TextInput label="Phone" value={form.phone || ''} onChange={(event) => setField('phone', event.target.value)} />
                <TextInput label="Website URL" value={form.websiteUrl || ''} onChange={(event) => setField('websiteUrl', event.target.value)} className="sm:col-span-2" />
                <TextInput label="Instagram URL" value={form.instagramUrl || ''} onChange={(event) => setField('instagramUrl', event.target.value)} />
                <TextInput label="Facebook URL" value={form.facebookUrl || ''} onChange={(event) => setField('facebookUrl', event.target.value)} />
                <TextInput label="LinkedIn URL" value={form.linkedinUrl || ''} onChange={(event) => setField('linkedinUrl', event.target.value)} />
              </FormSection>

              <FormSection title="Publishing and SEO" description="Visibility and discoverability controls.">
                <TextInput label="Display Order" type="number" value={form.displayOrder} onChange={(event) => setField('displayOrder', Number(event.target.value))} />
                <SelectInput
                  label="Status"
                  value={form.status}
                  onChange={(value) => setField('status', value as CoachMutationInput['status'])}
                  options={[
                    { label: 'Active', value: 'active' },
                    { label: 'Inactive', value: 'inactive' },
                  ]}
                />
                <TextInput label="SEO Title" value={form.seoTitle || ''} onChange={(event) => setField('seoTitle', event.target.value)} />
                <TextareaInput label="SEO Description" value={form.seoDescription || ''} onChange={(event) => setField('seoDescription', event.target.value)} className="sm:col-span-2" />
              </FormSection>

              <FormActions>
                {lastAutosave ? <p className="text-xs text-(--color-text-secondary)">Last autosave: {lastAutosave}</p> : null}
                <SecondaryButton onClick={handleCancel}>Cancel</SecondaryButton>
                <PrimaryButton onClick={handleSubmit} disabled={saving}>{saving ? 'Saving...' : 'Save Coach'}</PrimaryButton>
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
            onPublishStatusChange={(value) => setField('publishStatus', value as CoachMutationInput['publishStatus'])}
            onVisibilityChange={(value) => setField('visibility', value as CoachMutationInput['visibility'])}
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
          <MediaSelectorPlaceholder allowMultiple={false} />
          <RevisionInfoCard
            author="Coach Manager"
            createdAt={mode === 'create' ? undefined : new Date().toISOString()}
            updatedAt={new Date().toISOString()}
          />
          <ActivityTimelinePlaceholder />
        </>
      )}
    />
  )
}
