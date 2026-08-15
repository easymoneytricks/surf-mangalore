import Card from '../Card'
import type { BookingSelectableItem, BookingFormData } from '../../types/booking'

type BookingSummaryProps = {
  formData: BookingFormData
  options: BookingSelectableItem[]
}

export default function BookingSummary({ formData, options }: BookingSummaryProps) {
  const selectedItem = options.find((option) => option.bookingType === formData.bookingType && String(option.id) === formData.selectedItemId)

  return (
    <div>
      <h2 className="text-xl font-semibold text-(--color-text)">Review your booking request</h2>
      <p className="mt-2 text-sm leading-7 text-(--color-text-secondary)">Check the summary below before submitting. You can always go back to edit a step.</p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Card variant="glass" className="border-white/12 p-5">
          <p className="text-[0.68rem] uppercase tracking-[0.26em] text-(--color-primary)">Booking Type</p>
          <p className="mt-2 text-base font-semibold text-white">{formData.bookingType || 'Not selected'}</p>
          <p className="mt-2 text-sm leading-7 text-(--color-text-secondary)">{selectedItem?.title ?? 'Choose an item before submitting.'}</p>
        </Card>

        <Card variant="glass" className="border-white/12 p-5">
          <p className="text-[0.68rem] uppercase tracking-[0.26em] text-(--color-primary)">Schedule</p>
          <p className="mt-2 text-base font-semibold text-white">{formData.preferredDate || 'No date selected'}</p>
          <p className="mt-2 text-sm leading-7 text-(--color-text-secondary)">{formData.preferredTime || 'No time selected'}</p>
        </Card>

        <Card variant="glass" className="border-white/12 p-5">
          <p className="text-[0.68rem] uppercase tracking-[0.26em] text-(--color-primary)">Participants</p>
          <p className="mt-2 text-base font-semibold text-white">{formData.participants} guests</p>
        </Card>

        <Card variant="glass" className="border-white/12 p-5">
          <p className="text-[0.68rem] uppercase tracking-[0.26em] text-(--color-primary)">Contact</p>
          <p className="mt-2 text-sm leading-7 text-(--color-text-secondary)">{formData.name || 'Name missing'}</p>
          <p className="text-sm leading-7 text-(--color-text-secondary)">{formData.email || 'Email missing'}</p>
          <p className="text-sm leading-7 text-(--color-text-secondary)">{formData.phone || 'Phone missing'}</p>
          <p className="text-sm leading-7 text-(--color-text-secondary)">{formData.emergencyContact || 'No emergency contact provided'}</p>
        </Card>

        <Card variant="glass" className="border-white/12 p-5 md:col-span-2">
          <p className="text-[0.68rem] uppercase tracking-[0.26em] text-(--color-primary)">Special notes</p>
          <p className="mt-2 text-sm leading-7 text-(--color-text-secondary)">{formData.specialNotes || 'No special notes provided.'}</p>
        </Card>
      </div>
    </div>
  )
}
