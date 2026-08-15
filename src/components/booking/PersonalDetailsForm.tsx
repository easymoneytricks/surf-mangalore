import type { BookingFieldError, BookingFormData } from '../../types/booking'

type PersonalDetailsFormProps = {
  values: BookingFormData
  errors: BookingFieldError
  onChange: (field: keyof BookingFormData, value: string) => void
}

export default function PersonalDetailsForm({ values, errors, onChange }: PersonalDetailsFormProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-(--color-text)">Personal details</h2>
      <p className="mt-2 text-sm leading-7 text-(--color-text-secondary)">Share your contact details so we can confirm your booking and support your session planning.</p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="text-sm text-(--color-text-secondary)">Name</span>
          <input
            type="text"
            value={values.name}
            onChange={(event) => onChange('name', event.target.value)}
            aria-invalid={errors.name ? 'true' : 'false'}
            className="rounded-2xl border border-white/12 bg-white/8 px-4 py-3 text-(--color-text) outline-none transition focus:border-(--color-primary) focus:ring-2 focus:ring-(--color-primary)/25"
          />
          {errors.name ? <span role="alert" className="text-sm text-rose-300">{errors.name}</span> : null}
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm text-(--color-text-secondary)">Email</span>
          <input
            type="email"
            value={values.email}
            onChange={(event) => onChange('email', event.target.value)}
            aria-invalid={errors.email ? 'true' : 'false'}
            className="rounded-2xl border border-white/12 bg-white/8 px-4 py-3 text-(--color-text) outline-none transition focus:border-(--color-primary) focus:ring-2 focus:ring-(--color-primary)/25"
          />
          {errors.email ? <span role="alert" className="text-sm text-rose-300">{errors.email}</span> : null}
        </label>

        <label className="flex flex-col gap-2 md:col-span-2">
          <span className="text-sm text-(--color-text-secondary)">Phone</span>
          <input
            type="tel"
            value={values.phone}
            onChange={(event) => onChange('phone', event.target.value)}
            aria-invalid={errors.phone ? 'true' : 'false'}
            className="rounded-2xl border border-white/12 bg-white/8 px-4 py-3 text-(--color-text) outline-none transition focus:border-(--color-primary) focus:ring-2 focus:ring-(--color-primary)/25"
          />
          {errors.phone ? <span role="alert" className="text-sm text-rose-300">{errors.phone}</span> : null}
        </label>

        <label className="flex flex-col gap-2 md:col-span-2">
          <span className="text-sm text-(--color-text-secondary)">Emergency contact (optional)</span>
          <input
            type="text"
            value={values.emergencyContact}
            onChange={(event) => onChange('emergencyContact', event.target.value)}
            className="rounded-2xl border border-white/12 bg-white/8 px-4 py-3 text-(--color-text) outline-none transition focus:border-(--color-primary) focus:ring-2 focus:ring-(--color-primary)/25"
          />
        </label>

        <label className="flex flex-col gap-2 md:col-span-2">
          <span className="text-sm text-(--color-text-secondary)">Special notes</span>
          <textarea
            rows={4}
            value={values.specialNotes}
            onChange={(event) => onChange('specialNotes', event.target.value)}
            className="rounded-2xl border border-white/12 bg-white/8 px-4 py-3 text-(--color-text) outline-none transition focus:border-(--color-primary) focus:ring-2 focus:ring-(--color-primary)/25"
            placeholder="Tell us if you are a first-time surfer, have a preferred coach, or need help planning for a group."
          />
        </label>
      </div>
    </div>
  )
}
