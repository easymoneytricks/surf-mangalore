import { useState } from 'react'
import { type FormEvent } from 'react'
import { motion } from 'framer-motion'
import Badge from '../Badge'
import Button from '../Button'
import Card from '../Card'
import { sendContactMessage } from '../../services/contact.service'

type ContactFormValues = {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}

type ContactFormErrors = Partial<Record<keyof ContactFormValues, string>>

const initialValues: ContactFormValues = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function isValidPhone(value: string) {
  return /^[+]?[-()\s\d]{8,20}$/.test(value)
}

export default function ContactForm() {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState<ContactFormErrors>({})
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const setField = (field: keyof ContactFormValues, value: string) => {
    setValues((previous) => ({ ...previous, [field]: value }))
    setErrors((previous) => ({ ...previous, [field]: undefined }))
  }

  const validate = () => {
    const nextErrors: ContactFormErrors = {}

    if (!values.name.trim()) nextErrors.name = 'Please share your name.'
    if (!values.email.trim()) nextErrors.email = 'Please share your email address.'
    else if (!isValidEmail(values.email.trim())) nextErrors.email = 'Please enter a valid email address.'
    if (values.phone.trim() && !isValidPhone(values.phone.trim())) nextErrors.phone = 'Please enter a valid phone number.'
    if (!values.subject.trim()) nextErrors.subject = 'Please add a short subject.'
    if (!values.message.trim()) nextErrors.message = 'Tell us a little about what you are planning.'

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitError(null)

    if (!validate()) return

    setIsSubmitting(true)
    try {
      await sendContactMessage({
        name: values.name.trim(),
        email: values.email.trim(),
        phone: values.phone.trim() || undefined,
        subject: values.subject.trim(),
        message: values.message.trim(),
        source: 'Website contact form',
      })

      setSubmitted(true)
      setValues(initialValues)
    } catch (error) {
      setSubmitError((error as Error).message || 'Unable to send your message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="mx-auto w-full max-w-lg px-6 py-16 sm:px-8 lg:px-12 lg:py-24">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div>
          <Badge tone="accent">Write to us</Badge>
          <h2 className="mt-4 font-(--font-heading) text-[clamp(1.8rem,3.2vw,2.5rem)] leading-[1.08] tracking-(--letter-tight) text-(--color-text)">
            A direct message for more tailored questions.
          </h2>
          <p className="mt-4 text-base leading-8 text-(--color-text-secondary)">
            Use this form if you want help planning a private session, a group surf day, or a more personalized experience.
          </p>
        </div>

        <Card variant="feature" className="border-white/12 p-6 sm:p-8">
          {submitted ? (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <p className="text-[0.72rem] uppercase tracking-[0.3em] text-(--color-primary)">Message received</p>
              <h3 className="mt-3 text-2xl font-semibold text-white">Thanks. We will get back to you shortly.</h3>
              <p className="mt-3 text-sm leading-7 text-(--color-text-secondary)">
                Your enquiry was sent successfully. We will follow up with a personalized response soon.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="grid gap-4 md:grid-cols-2">
              <label className="flex flex-col gap-2">
                <span className="text-sm text-(--color-text-secondary)">Name</span>
                <input type="text" value={values.name} onChange={(event) => setField('name', event.target.value)} aria-invalid={errors.name ? 'true' : 'false'} className="rounded-2xl border border-white/12 bg-white/8 px-4 py-3 text-(--color-text) outline-none transition focus:border-(--color-primary) focus:ring-2 focus:ring-(--color-primary)/25" />
                {errors.name ? <span role="alert" className="text-sm text-rose-300">{errors.name}</span> : null}
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-sm text-(--color-text-secondary)">Email</span>
                <input type="email" value={values.email} onChange={(event) => setField('email', event.target.value)} aria-invalid={errors.email ? 'true' : 'false'} className="rounded-2xl border border-white/12 bg-white/8 px-4 py-3 text-(--color-text) outline-none transition focus:border-(--color-primary) focus:ring-2 focus:ring-(--color-primary)/25" />
                {errors.email ? <span role="alert" className="text-sm text-rose-300">{errors.email}</span> : null}
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-sm text-(--color-text-secondary)">Phone</span>
                <input type="tel" value={values.phone} onChange={(event) => setField('phone', event.target.value)} aria-invalid={errors.phone ? 'true' : 'false'} className="rounded-2xl border border-white/12 bg-white/8 px-4 py-3 text-(--color-text) outline-none transition focus:border-(--color-primary) focus:ring-2 focus:ring-(--color-primary)/25" />
                {errors.phone ? <span role="alert" className="text-sm text-rose-300">{errors.phone}</span> : null}
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-sm text-(--color-text-secondary)">Subject</span>
                <input type="text" value={values.subject} onChange={(event) => setField('subject', event.target.value)} aria-invalid={errors.subject ? 'true' : 'false'} className="rounded-2xl border border-white/12 bg-white/8 px-4 py-3 text-(--color-text) outline-none transition focus:border-(--color-primary) focus:ring-2 focus:ring-(--color-primary)/25" />
                {errors.subject ? <span role="alert" className="text-sm text-rose-300">{errors.subject}</span> : null}
              </label>

              <label className="flex flex-col gap-2 md:col-span-2">
                <span className="text-sm text-(--color-text-secondary)">Message</span>
                <textarea rows={5} value={values.message} onChange={(event) => setField('message', event.target.value)} aria-invalid={errors.message ? 'true' : 'false'} className="rounded-2xl border border-white/12 bg-white/8 px-4 py-3 text-(--color-text) outline-none transition focus:border-(--color-primary) focus:ring-2 focus:ring-(--color-primary)/25" placeholder="Tell us about your preferred date, group size, experience level, or anything else that would help us guide you." />
                {errors.message ? <span role="alert" className="text-sm text-rose-300">{errors.message}</span> : null}
              </label>

              {submitError ? <p className="col-span-2 rounded-xl border border-rose-300/40 bg-rose-300/15 px-4 py-3 text-sm text-rose-100">{submitError}</p> : null}

              <div className="md:col-span-2">
                <Button variant="primary" size="lg" className="w-full sm:w-auto" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Sending…' : 'Send enquiry'}
                </Button>
              </div>
            </form>
          )}
        </Card>
      </div>
    </section>
  )
}
