import { useEffect, useMemo, useRef, useState } from 'react'
import BookingHero from '../components/booking/BookingHero'
import BookingStepper from '../components/booking/BookingStepper'
import ExperienceSelector from '../components/booking/ExperienceSelector'
import DatePicker from '../components/booking/DatePicker'
import TimeSelector from '../components/booking/TimeSelector'
import ParticipantSelector from '../components/booking/ParticipantSelector'
import PersonalDetailsForm from '../components/booking/PersonalDetailsForm'
import BookingSummary from '../components/booking/BookingSummary'
import BookingSuccess from '../components/booking/BookingSuccess'
import Button from '../components/Button'
import Card from '../components/Card'
import { bookingParticipantConfig, bookingStepsForType } from '../data/bookingOptions'
import { createBooking, fetchBookableOptions } from '../services/bookings.service'
import type { BookingCreatePayload, BookingFieldError, BookingFormData, BookingSelectableItem, BookingStep, PublicBookingType } from '../types/booking'

const STORAGE_KEY = 'surfmangalore.booking.draft'

const initialFormData: BookingFormData = {
  bookingType: '',
  selectedItemId: '',
  preferredDate: '',
  preferredTime: '',
  participants: bookingParticipantConfig.defaultValue,
  name: '',
  email: '',
  phone: '',
  emergencyContact: '',
  specialNotes: '',
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function isValidPhone(value: string) {
  return /^[+]?[-()\s\d]{8,20}$/.test(value)
}

function parseBookingType(value: string | null): PublicBookingType | '' {
  if (value === 'LESSON' || value === 'EXPERIENCE' || value === 'EVENT') {
    return value
  }

  return ''
}

export default function BookingPage() {
  const [formData, setFormData] = useState<BookingFormData>(initialFormData)
  const [currentStep, setCurrentStep] = useState<Exclude<BookingStep, 'success'>>('offering')
  const [fieldErrors, setFieldErrors] = useState<BookingFieldError>({})
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoadingOptions, setIsLoadingOptions] = useState(true)
  const [optionsError, setOptionsError] = useState<string | null>(null)
  const [bookableOptions, setBookableOptions] = useState<BookingSelectableItem[]>([])
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [confirmation, setConfirmation] = useState<{
    reference: string
    activity: string
    date: string
    time: string
    participants: number
    location: string
    paymentNotice: string
    support: string
    bookingType?: PublicBookingType
  } | null>(null)
  const [lastSubmissionSignature, setLastSubmissionSignature] = useState<string | null>(null)
  const [lastSubmittedAt, setLastSubmittedAt] = useState<number | null>(null)
  const stepHeadingRef = useRef<HTMLHeadingElement | null>(null)

  const activeSteps = useMemo(() => bookingStepsForType(formData.bookingType), [formData.bookingType])
  const stepIndex = useMemo(() => activeSteps.findIndex((step) => step.id === currentStep), [activeSteps, currentStep])
  const stepConfig = activeSteps[stepIndex] || activeSteps[0]

  useEffect(() => {
    if (!activeSteps.some((step) => step.id === currentStep)) setCurrentStep(activeSteps[0]?.id || 'offering')
  }, [activeSteps, currentStep])

  useEffect(() => {
    let cancelled = false

    fetchBookableOptions()
      .then((options) => {
        if (!cancelled) {
          setBookableOptions(options)
        }
      })
      .catch((fetchError: Error) => {
        if (!cancelled) {
          setOptionsError(fetchError.message)
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoadingOptions(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return
    }

    try {
      const parsed = JSON.parse(raw) as { formData?: BookingFormData; currentStep?: Exclude<BookingStep, 'success'> }
      if (parsed.formData) {
        setFormData(parsed.formData)
      }
      if (parsed.currentStep && bookingStepsForType(parsed.formData?.bookingType || '').some((step) => step.id === parsed.currentStep)) {
        setCurrentStep(parsed.currentStep)
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY)
    }
  }, [])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const bookingType = parseBookingType(params.get('bookingType'))
    const selectedItemId = params.get('selectedItemId') || ''
    const preferredDate = params.get('preferredDate') || ''
    const preferredTime = params.get('preferredTime') || ''
    const participantsRaw = params.get('participants')
    const participantsValue = participantsRaw ? Number(participantsRaw) : undefined

    if (!bookingType && !selectedItemId && !preferredDate && !preferredTime && participantsValue === undefined) {
      return
    }

    setFormData((previous) => ({
      ...previous,
      bookingType: bookingType || previous.bookingType,
      selectedItemId: selectedItemId || previous.selectedItemId,
      preferredDate: preferredDate || previous.preferredDate,
      preferredTime: preferredTime || previous.preferredTime,
      participants:
        participantsValue && Number.isFinite(participantsValue)
          ? Math.min(bookingParticipantConfig.max, Math.max(bookingParticipantConfig.min, participantsValue))
          : previous.participants,
    }))
  }, [])

  useEffect(() => {
    if (isLoadingOptions || !formData.bookingType || !formData.selectedItemId) {
      return
    }

    const selectedExists = bookableOptions.some((item) => (
      item.bookingType === formData.bookingType
      && String(item.id) === formData.selectedItemId
    ))

    if (!selectedExists) {
      setSubmitError('The preselected booking option is no longer available. Please choose another item.')
      setFormData((previous) => ({
        ...previous,
        selectedItemId: '',
      }))
    }
  }, [bookableOptions, formData.bookingType, formData.selectedItemId, isLoadingOptions])

  useEffect(() => {
    if (isSubmitted) {
      return
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ formData, currentStep }))
  }, [formData, currentStep, isSubmitted])

  useEffect(() => {
    const hasProgress = JSON.stringify(formData) !== JSON.stringify(initialFormData)

    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      if (isSubmitted || !hasProgress) {
        return
      }

      event.preventDefault()
      event.returnValue = ''
    }

    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [formData, isSubmitted])

  useEffect(() => {
    stepHeadingRef.current?.focus()
  }, [currentStep])

  const setField = (field: keyof BookingFormData, value: string | number) => {
    setFormData((previous) => ({ ...previous, [field]: value }))
    setFieldErrors((previous) => ({ ...previous, [field]: undefined }))
    setSubmitError(null)
  }

  const validateStep = (step: Exclude<BookingStep, 'success'>) => {
    const nextErrors: BookingFieldError = {}

    if (step === 'offering') {
      if (!formData.bookingType) {
        nextErrors.bookingType = 'Choose booking type to continue.'
      }

      if (!formData.selectedItemId) {
        nextErrors.selectedItemId = 'Choose an item to continue.'
      }
    }

    if (step === 'date' && !formData.preferredDate) {
      nextErrors.preferredDate = 'Choose a preferred date so we can plan your session.'
    }

    if (step === 'time' && !formData.preferredTime) {
      nextErrors.preferredTime = 'Select a preferred time slot to continue.'
    }

    if (step === 'participants') {
      if (formData.participants < bookingParticipantConfig.min || formData.participants > bookingParticipantConfig.max) {
        nextErrors.participants = `Participants must be between ${bookingParticipantConfig.min} and ${bookingParticipantConfig.max}.`
      }
    }

    if (step === 'details' || step === 'review') {
      if (!formData.name.trim()) {
        nextErrors.name = 'Please share your name.'
      }
      if (!formData.email.trim()) {
        nextErrors.email = 'Please share your email address.'
      } else if (!isValidEmail(formData.email.trim())) {
        nextErrors.email = 'Please enter a valid email address.'
      }
      if (!formData.phone.trim()) {
        nextErrors.phone = 'Please share your phone number.'
      } else if (!isValidPhone(formData.phone.trim())) {
        nextErrors.phone = 'Please enter a valid phone number with country code if needed.'
      }
    }

    setFieldErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const goNext = () => {
    if (!validateStep(currentStep)) {
      return
    }

    const nextStep = activeSteps[stepIndex + 1]
    if (nextStep) {
      setCurrentStep(nextStep.id)
    }
  }

  const goPrevious = () => {
    const previousStep = activeSteps[stepIndex - 1]
    if (previousStep) {
      setCurrentStep(previousStep.id)
    }
  }

  const handleSubmit = () => {
    if (!validateStep('review')) {
      return
    }

    if (!formData.bookingType || !formData.selectedItemId) {
      return
    }

    const payload: BookingCreatePayload = {
      bookingType: formData.bookingType,
      selectedItemId: Number(formData.selectedItemId),
      preferredDate: formData.preferredDate || undefined,
      preferredTime: formData.preferredTime || undefined,
      participants: formData.participants,
      customerName: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      emergencyContact: formData.emergencyContact.trim() || undefined,
      specialNotes: formData.specialNotes.trim() || undefined,
    }

    const signature = JSON.stringify(payload)
    if (isSubmitting) {
      return
    }

    if (lastSubmissionSignature === signature && lastSubmittedAt && Date.now() - lastSubmittedAt < 60_000) {
      setSubmitError('Duplicate submission detected. Please wait before trying again.')
      return
    }

    setSubmitError(null)
    setIsSubmitting(true)

    createBooking(payload)
      .then((result) => {
        setConfirmation({
          reference: result.bookingReference,
          activity: result.activity || selectedItem?.title || 'Surf session',
          date: new Date(result.bookingDate).toLocaleDateString(),
          time: result.preferredTime || 'Flexible',
          participants: result.participants,
          location: result.location || 'Surf Mangalore venue details will be shared by support',
          paymentNotice: result.paymentNotice || 'Pay at venue on arrival.',
          support: import.meta.env.VITE_SUPPORT_WHATSAPP || import.meta.env.VITE_PUBLIC_PHONE || '+91 00000 00000',
          bookingType: result.bookingType,
        })
        setIsSubmitted(true)
        setLastSubmissionSignature(signature)
        setLastSubmittedAt(Date.now())
        window.localStorage.removeItem(STORAGE_KEY)
      })
      .catch((submitErr: Error) => {
        setSubmitError(submitErr.message)
      })
      .finally(() => {
        setIsSubmitting(false)
      })
  }

  const resetBooking = () => {
    setFormData(initialFormData)
    setCurrentStep('offering')
    setFieldErrors({})
    setSubmitError(null)
    setIsSubmitted(false)
    setConfirmation(null)
    window.localStorage.removeItem(STORAGE_KEY)
  }

  const selectedItem = useMemo(
    () => bookableOptions.find((item) => String(item.id) === formData.selectedItemId && item.bookingType === formData.bookingType),
    [bookableOptions, formData.selectedItemId, formData.bookingType],
  )

  return (
    <main className="w-full">
      <BookingHero />

      <section className="mx-auto w-full max-w-[var(--container-lg)] px-6 py-16 sm:px-8 lg:px-12 lg:py-24">
        {isSubmitted ? (
          <BookingSuccess guestName={formData.name} confirmation={confirmation} onCreateAnother={resetBooking} />
        ) : (
          <div className="space-y-6">
            <BookingStepper steps={activeSteps} currentStep={currentStep} />

            <Card variant="feature" className="border-white/12 p-6 sm:p-8">
              <div className="border-b border-white/10 pb-5">
                <h2 ref={stepHeadingRef} tabIndex={-1} className="text-2xl font-semibold text-white outline-none">
                  {stepConfig.label}
                </h2>
                <p className="mt-2 text-sm leading-7 text-(--color-text-secondary)">{stepConfig.helper}</p>
              </div>

              <div className="pt-6">
                {currentStep === 'offering' ? (
                  <>
                    {isLoadingOptions ? <p className="text-sm text-(--color-text-secondary)">Loading booking options...</p> : null}
                    {optionsError ? <p className="rounded-xl border border-rose-300/40 bg-rose-300/15 px-3 py-2 text-sm text-rose-100">{optionsError}</p> : null}
                    {!isLoadingOptions && !optionsError ? (
                      <ExperienceSelector
                        options={bookableOptions}
                        bookingType={formData.bookingType}
                        value={formData.selectedItemId}
                        onBookingTypeChange={(value) => setField('bookingType', value)}
                        onChange={(value) => setField('selectedItemId', value)}
                        error={fieldErrors.bookingType || fieldErrors.selectedItemId}
                      />
                    ) : null}
                  </>
                ) : null}

                {currentStep === 'date' ? <DatePicker value={formData.preferredDate} availableDates={formData.bookingType === 'EXPERIENCE' ? (selectedItem?.availability || []).map((date) => date.date) : undefined} onChange={(value) => { setField('preferredDate', value); setField('preferredTime', '') }} error={fieldErrors.preferredDate} /> : null}

                {currentStep === 'time' ? <TimeSelector slots={(selectedItem?.availability?.find((date) => date.date === formData.preferredDate)?.slots || [])} value={formData.preferredTime} onChange={(value) => setField('preferredTime', value)} error={fieldErrors.preferredTime} /> : null}

                {currentStep === 'participants' ? (
                  <>
                    {formData.bookingType === 'EVENT' && selectedItem?.eventStart ? <p className="mb-5 rounded-2xl border border-white/12 bg-white/6 px-4 py-3 text-sm text-(--color-text-secondary)">Fixed event schedule: {new Date(selectedItem.eventStart).toLocaleString()}{selectedItem.eventEnd ? ` – ${new Date(selectedItem.eventEnd).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}` : ''}</p> : null}
                    <ParticipantSelector value={formData.participants} config={bookingParticipantConfig} onChange={(value) => setField('participants', value)} error={fieldErrors.participants} />
                  </>
                ) : null}

                {currentStep === 'details' ? (
                  <PersonalDetailsForm
                    values={formData}
                    errors={fieldErrors}
                    onChange={(field, value) => setField(field, value)}
                  />
                ) : null}

                {currentStep === 'review' ? <BookingSummary formData={formData} options={bookableOptions} /> : null}
              </div>

              {submitError ? <p className="mt-4 rounded-xl border border-rose-300/40 bg-rose-300/15 px-3 py-2 text-sm text-rose-100">{submitError}</p> : null}

              <div className="mt-8 flex flex-col-reverse gap-3 border-t border-white/10 pt-6 sm:flex-row sm:justify-between">
                <Button variant="ghost" size="md" onClick={goPrevious} disabled={stepIndex === 0}>
                  Previous
                </Button>

                {currentStep === 'review' ? (
                  <Button variant="primary" size="md" onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit booking request'}
                  </Button>
                ) : (
                  <Button variant="primary" size="md" onClick={goNext}>
                    Next step
                  </Button>
                )}
              </div>
            </Card>
          </div>
        )}
      </section>
    </main>
  )
}
