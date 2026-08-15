import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import {
  FormActions,
  FormCard,
  FormSection,
  GenericEditorPage,
  PrimaryButton,
  PublishPanel,
  SecondaryButton,
  SelectInput,
  TextInput,
  TextareaInput,
} from '../../components/admin'
import { lessonsService } from '../../services/lessons.service'
import { type LessonMutationInput } from '../../types/lessons'
import { slugify } from '../../utils/slug'

type LessonFormPageProps = {
  mode: 'create' | 'edit'
}

const DEFAULT_FORM: LessonMutationInput = {
  title: '',
  slug: '',
  shortDescription: '',
  fullDescription: '',
  coverImageUrl: '',
  difficulty: 'ALL_LEVELS',
  duration: '',
  price: undefined,
  maxParticipants: undefined,
  instructor: '',
  publishStatus: 'DRAFT',
  visibility: 'PUBLIC',
  isFeatured: false,
  displayOrder: 0,
  seoTitle: '',
  seoDescription: '',
}

export default function LessonFormPage({ mode }: LessonFormPageProps) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState<LessonMutationInput>(DEFAULT_FORM)
  const [loading, setLoading] = useState(mode === 'edit')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [slugTouched, setSlugTouched] = useState(false)

  useEffect(() => {
    if (mode !== 'edit' || !id) {
      return
    }

    let cancelled = false

    lessonsService
      .getById(Number(id))
      .then((lesson) => {
        if (cancelled) {
          return
        }

        setForm({
          title: lesson.title,
          slug: lesson.slug,
          shortDescription: lesson.shortDescription || '',
          fullDescription: lesson.fullDescription || '',
          coverImageUrl: lesson.coverImageUrl || '',
          difficulty: lesson.difficulty,
          duration: lesson.duration || '',
          price: lesson.price,
          maxParticipants: lesson.maxParticipants,
          instructor: lesson.instructor || '',
          publishStatus: lesson.publishStatus,
          visibility: lesson.visibility,
          isFeatured: lesson.isFeatured,
          displayOrder: lesson.displayOrder,
          seoTitle: lesson.seoTitle || '',
          seoDescription: lesson.seoDescription || '',
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

  const setField = <K extends keyof LessonMutationInput>(field: K, value: LessonMutationInput[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    setSaving(true)
    setError(null)
    setSuccessMessage(null)

    try {
      if (mode === 'create') {
        await lessonsService.create(form)
        setSuccessMessage('Lesson created successfully')
      } else if (id) {
        await lessonsService.update(Number(id), form)
        setSuccessMessage('Lesson updated successfully')
      }

      setTimeout(() => navigate('/lessons'), 700)
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Failed to save lesson')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <p className="text-sm text-(--color-text-secondary)">Loading lesson details...</p>
  }

  return (
    <GenericEditorPage
      title={mode === 'create' ? 'Create Lesson' : 'Edit Lesson'}
      description="Create and refine lesson offerings for your public site."
      actions={<Link className="text-sm text-(--color-primary)" to="/lessons">Back to Lessons</Link>}
      main={(
        <>
          {error ? <p className="mb-4 rounded-xl border border-rose-300/40 bg-rose-300/15 px-3 py-2 text-sm text-rose-100">{error}</p> : null}
          {successMessage ? <p className="mb-4 rounded-xl border border-emerald-300/40 bg-emerald-300/15 px-3 py-2 text-sm text-emerald-100">{successMessage}</p> : null}

          <FormCard>
            <div className="space-y-5">
              <FormSection title="Core Lesson Information" description="Primary lesson identity and overview.">
                <TextInput
                  label="Title"
                  value={form.title}
                  onChange={(event) => {
                    const title = event.target.value
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
                  label="Full Description"
                  value={form.fullDescription || ''}
                  onChange={(event) => setField('fullDescription', event.target.value)}
                  className="sm:col-span-2"
                />
                <SelectInput
                  label="Difficulty"
                  value={form.difficulty}
                  onChange={(value) => setField('difficulty', value as LessonMutationInput['difficulty'])}
                  options={[
                    { label: 'All Levels', value: 'ALL_LEVELS' },
                    { label: 'Beginner', value: 'BEGINNER' },
                    { label: 'Intermediate', value: 'INTERMEDIATE' },
                    { label: 'Advanced', value: 'ADVANCED' },
                  ]}
                />
                <TextInput label="Duration" value={form.duration || ''} onChange={(event) => setField('duration', event.target.value)} />
                <TextInput label="Price" type="number" value={form.price || ''} onChange={(event) => setField('price', event.target.value ? Number(event.target.value) : undefined)} />
                <TextInput label="Maximum Participants" type="number" value={form.maxParticipants || ''} onChange={(event) => setField('maxParticipants', event.target.value ? Number(event.target.value) : undefined)} />
                <TextInput label="Instructor" value={form.instructor || ''} onChange={(event) => setField('instructor', event.target.value)} />
                <TextInput label="Display Order" type="number" value={form.displayOrder} onChange={(event) => setField('displayOrder', Number(event.target.value))} />
              </FormSection>

              <FormSection title="Media and SEO" description="Cover image and SEO metadata for public presentation.">
                <TextInput label="Cover Image URL" value={form.coverImageUrl || ''} onChange={(event) => setField('coverImageUrl', event.target.value)} />
                {form.coverImageUrl ? <img src={form.coverImageUrl} alt="Cover preview" className="h-40 w-full rounded-xl object-cover sm:col-span-2" /> : null}
                <TextInput label="SEO Title" value={form.seoTitle || ''} onChange={(event) => setField('seoTitle', event.target.value)} />
                <TextareaInput label="SEO Description" value={form.seoDescription || ''} onChange={(event) => setField('seoDescription', event.target.value)} className="sm:col-span-2" />
              </FormSection>

              <FormActions>
                <SecondaryButton onClick={() => navigate('/lessons')}>Cancel</SecondaryButton>
                <PrimaryButton onClick={handleSubmit} disabled={saving}>{saving ? 'Saving...' : 'Save Lesson'}</PrimaryButton>
              </FormActions>
            </div>
          </FormCard>
        </>
      )}
      sidebar={(
        <PublishPanel
          publishStatus={form.publishStatus}
          visibility={form.visibility}
          featured={form.isFeatured}
          scheduledPublishAt=""
          onPublishStatusChange={(value) => setField('publishStatus', value as LessonMutationInput['publishStatus'])}
          onVisibilityChange={(value) => setField('visibility', value as LessonMutationInput['visibility'])}
          onFeaturedChange={(checked) => setField('isFeatured', checked)}
          onScheduledPublishAtChange={() => {}}
        />
      )}
    />
  )
}
