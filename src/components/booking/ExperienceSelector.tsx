import { motion } from 'framer-motion'
import Card from '../Card'
import type { BookingSelectableItem, PublicBookingType } from '../../types/booking'

type ExperienceSelectorProps = {
  options: BookingSelectableItem[]
  bookingType: PublicBookingType | ''
  value: string
  error?: string
  onBookingTypeChange: (value: PublicBookingType) => void
  onChange: (value: string) => void
}

export default function ExperienceSelector({ options, bookingType, value, error, onBookingTypeChange, onChange }: ExperienceSelectorProps) {
  const filteredOptions = bookingType ? options.filter((option) => option.bookingType === bookingType) : []

  return (
    <div>
      <fieldset>
        <legend className="text-xl font-semibold text-(--color-text)">Choose booking type and item</legend>
        <p className="mt-2 text-sm leading-7 text-(--color-text-secondary)">Select a booking type first, then pick the exact lesson, experience, or event.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {(['LESSON', 'EXPERIENCE', 'EVENT'] as const).map((type) => (
            <button
              key={type}
              type="button"
              className={`rounded-full border px-3 py-1 text-xs uppercase tracking-[0.2em] ${bookingType === type ? 'border-(--color-primary)/45 bg-(--color-primary)/12 text-(--color-primary)' : 'border-white/12 text-(--color-text-secondary)'}`}
              onClick={() => {
                onBookingTypeChange(type)
                onChange('')
              }}
            >
              {type}
            </button>
          ))}
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {filteredOptions.map((option, index) => {
            const selected = value === String(option.id)

            return (
              <motion.label key={option.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.04 }} className="cursor-pointer">
                <input type="radio" name="experience" value={option.id} checked={selected} onChange={() => onChange(String(option.id))} className="sr-only" />
                <Card variant="feature" className={`h-full border-white/12 p-5 transition ${selected ? 'ring-2 ring-(--color-primary)/45' : ''}`}>
                  <p className="text-[0.68rem] uppercase tracking-[0.28em] text-(--color-primary)">{option.badge}</p>
                  <h3 className="mt-2 text-xl font-semibold text-white">{option.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-(--color-text-secondary)">{option.description}</p>
                  <div className="mt-4 grid gap-2 border-t border-white/10 pt-4 text-sm text-(--color-text-secondary) sm:grid-cols-3">
                    <p>{option.duration}</p>
                    <p>{option.level}</p>
                    <p>{option.groupSize}</p>
                  </div>
                </Card>
              </motion.label>
            )
          })}
        </div>
        {bookingType && !filteredOptions.length ? <p className="mt-3 text-sm text-(--color-text-secondary)">No published options available for this booking type right now.</p> : null}
      </fieldset>
      {error ? <p role="alert" className="mt-3 text-sm text-rose-300">{error}</p> : null}
    </div>
  )
}
