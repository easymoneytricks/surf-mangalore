import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import {
  FormActions,
  FormCard,
  FormSection,
  GenericEditorPage,
  PrimaryButton,
  SecondaryButton,
  SelectInput,
  TextInput,
  TextareaInput,
} from '../../components/admin'
import { bookingsService } from '../../services/bookings.service'
import { type BookableOption, type BookingCreateInput, type BookingType } from '../../types/bookings'

type BookingFormState = BookingCreateInput

const DEFAULT_FORM: BookingFormState = {
  bookingType: 'LESSON',
  selectedItemId: 0,
  preferredDate: new Date().toISOString().slice(0, 10),
  preferredTime: '09:00 AM',
  participants: 1,
  customerName: '',
  email: '',
  phone: '',
  emergencyContact: '',
  specialNotes: '',
}

const BOOKING_TYPE_OPTIONS: Array<{ label: string; value: BookingType }> = [
  { label: 'Lesson', value: 'LESSON' },
  { label: 'Experience', value: 'EXPERIENCE' },
  { label: 'Event', value: 'EVENT' },
]

function formatDateOnly(value?: string) {
  if (!value) {
    return ''
  }

  return new Date(value).toISOString().slice(0, 10)
}

function groupOptions(options: { lessons: BookableOption[]; experiences: BookableOption[]; events: BookableOption[] }, bookingType: BookingType) {
  if (bookingType === 'LESSON') {
    return options.lessons
  }

  if (bookingType === 'EXPERIENCE') {
    return options.experiences
  }

  return options.events
}

export default function BookingCreatePage() {
  const navigate = useNavigate()
  const [form, setForm] = useState<BookingFormState>(DEFAULT_FORM)
  const [bookableOptions, setBookableOptions] = useState<{ lessons: BookableOption[]; experiences: BookableOption[]; events: BookableOption[] } | null>(null)
  const [loadingOptions, setLoadingOptions] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    bookingsService
      .listOptions()
      .then((result) => {
        if (!cancelled) {
          setBookableOptions(result)
          setLoadingOptions(false)
        }
      })
      .catch((fetchError: Error) => {
        if (!cancelled) {
          setError(fetchError.message)
          setLoadingOptions(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  const selectedOptions = useMemo(() => {
    if (!bookableOptions) {
      return []
    }

    return groupOptions(bookableOptions, form.bookingType)
  }, [bookableOptions, form.bookingType])

  useEffect(() => {
    if (!selectedOptions.length) {
      return
    }

    const selectedItem = selectedOptions.find((item) => item.id === form.selectedItemId) ?? selectedOptions[0]
    if (!selectedItem) {
      return
    }

    const preferredDate = form.bookingType === 'EVENT' && selectedItem.eventStartsAt
      ? formatDateOnly(selectedItem.eventStartsAt)
      : form.preferredDate
    const preferredTime = form.bookingType === 'EVENT' && selectedItem.startTimeLabel
      ? selectedItem.startTimeLabel
      : form.preferredTime

    if (selectedItem.id === form.selectedItemId && preferredDate === form.preferredDate && preferredTime === form.preferredTime) {
      return
    }

    setForm((prev) => {
      const nextForm: BookingFormState = {
        ...prev,
        selectedItemId: selectedItem.id,
      }

      if (prev.bookingType === 'EVENT' && selectedItem.eventStartsAt) {
        nextForm.preferredDate = formatDateOnly(selectedItem.eventStartsAt)
        nextForm.preferredTime = selectedItem.startTimeLabel || prev.preferredTime
      }

      return nextForm
    })
  }, [form.bookingType, form.selectedItemId, selectedOptions])

  const selectedItem = selectedOptions.find((item) => item.id === form.selectedItemId) || selectedOptions[0] || null

  const setField = <K extends keyof BookingFormState>(field: K, value: BookingFormState[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleTypeChange = (value: BookingType) => {
    const nextOptions = bookableOptions ? groupOptions(bookableOptions, value) : []
    const firstOption = nextOptions[0]

    setForm((prev) => ({
      ...prev,
      bookingType: value,
      selectedItemId: firstOption?.id || 0,
      preferredDate: value === 'EVENT' && firstOption?.eventStartsAt ? formatDateOnly(firstOption.eventStartsAt) : prev.preferredDate,
      preferredTime: value === 'EVENT' ? firstOption?.startTimeLabel || prev.preferredTime : prev.preferredTime,
    }))
  }

  const handleSubmit = async () => {
    setSaving(true)
    setError(null)
    setSuccessMessage(null)

    try {
      const booking = await bookingsService.create({
        ...form,
        selectedItemId: Number(form.selectedItemId),
        participants: Number(form.participants),
        emergencyContact: form.emergencyContact || undefined,
        specialNotes: form.specialNotes || undefined,
      })

      setSuccessMessage(`Booking created successfully: ${booking.bookingReference}`)
      setTimeout(() => navigate(`/bookings/${booking.id}/view`), 700)
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Failed to create booking')
    } finally {
      setSaving(false)
    }
  }

  if (loadingOptions) {
    return <p className="text-sm text-(--color-text-secondary)">Loading booking options...</p>
  }

  return (
    <GenericEditorPage
      title="Create Booking"
      description="Create a manual booking using the live booking validation and capacity checks."
      actions={<Link className="text-sm text-(--color-primary)" to="/bookings">Back to Bookings</Link>}
      main={(
        <FormCard>
          <div className="space-y-5">
            {error ? <p className="rounded-xl border border-rose-300/40 bg-rose-300/15 px-3 py-2 text-sm text-rose-100">{error}</p> : null}
            {successMessage ? <p className="rounded-xl border border-emerald-300/40 bg-emerald-300/15 px-3 py-2 text-sm text-emerald-100">{successMessage}</p> : null}

            <FormSection title="Booking Details" description="Choose the bookable item and the customer details to attach to the booking.">
              <SelectInput
                label="Booking Type"
                value={form.bookingType}
                onChange={(value) => handleTypeChange(value as BookingType)}
                options={BOOKING_TYPE_OPTIONS}
              />
              <SelectInput
                label="Bookable Item"
                value={form.selectedItemId ? String(form.selectedItemId) : ''}
                onChange={(value) => setField('selectedItemId', Number(value))}
                options={selectedOptions.map((item) => ({ label: item.title, value: String(item.id) }))}
                helpText={selectedItem ? `${selectedItem.slug}${selectedItem.duration ? ` · ${selectedItem.duration}` : ''}` : 'No published items available for this type.'}
              />
              <TextInput
                label="Preferred Date"
                type="date"
                value={form.preferredDate}
                onChange={(event) => setField('preferredDate', event.target.value)}
              />
              <TextInput
                label="Preferred Time"
                value={form.preferredTime || ''}
                onChange={(event) => setField('preferredTime', event.target.value)}
                helpText={form.bookingType === 'EVENT' && selectedItem?.startTimeLabel ? `Suggested from event schedule: ${selectedItem.startTimeLabel}` : undefined}
              />
              <TextInput
                label="Participants"
                type="number"
                value={String(form.participants)}
                onChange={(event) => setField('participants', event.target.value ? Number(event.target.value) : 1)}
              />
              <TextInput label="Customer Name" value={form.customerName} onChange={(event) => setField('customerName', event.target.value)} />
              <TextInput label="Email" type="email" value={form.email} onChange={(event) => setField('email', event.target.value)} />
              <TextInput label="Phone" value={form.phone} onChange={(event) => setField('phone', event.target.value)} />
              <TextInput label="Emergency Contact" value={form.emergencyContact || ''} onChange={(event) => setField('emergencyContact', event.target.value)} />
              <TextareaInput label="Special Notes" value={form.specialNotes || ''} onChange={(event) => setField('specialNotes', event.target.value)} className="sm:col-span-2" />
            </FormSection>

            <FormActions>
              <SecondaryButton onClick={() => navigate('/bookings')}>Cancel</SecondaryButton>
              <PrimaryButton onClick={handleSubmit} disabled={saving || !selectedItem}>
                {saving ? 'Creating...' : 'Create Booking'}
              </PrimaryButton>
            </FormActions>
          </div>
        </FormCard>
      )}
      sidebar={(
        <div className="space-y-4 text-sm text-(--color-text-secondary)">
          <div className="rounded-2xl border border-white/12 bg-white/6 p-4">
            <p className="text-xs uppercase tracking-[0.12em] text-(--color-text-secondary)">Selected Item</p>
            <p className="mt-2 text-base text-(--color-text)">{selectedItem?.title || 'No item selected'}</p>
            <p className="mt-1">{selectedItem?.shortDescription || 'Choose a live published item to continue.'}</p>
          </div>
          <div className="rounded-2xl border border-white/12 bg-white/6 p-4">
            <p className="text-xs uppercase tracking-[0.12em] text-(--color-text-secondary)">Validation</p>
            <p className="mt-2">This form posts to the same booking create endpoint used by the public site, so duplicates, capacity, and date checks all stay live.</p>
          </div>
        </div>
      )}
    />
  )
}