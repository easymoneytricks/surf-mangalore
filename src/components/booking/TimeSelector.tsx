import type { BookingTimeSlot } from '../../data/bookingOptions'

type TimeSelectorProps = {
  slots: BookingTimeSlot[]
  value: string
  error?: string
  onChange: (value: string) => void
}

export default function TimeSelector({ slots, value, error, onChange }: TimeSelectorProps) {
  return (
    <div>
      <fieldset>
        <legend className="text-xl font-semibold text-[var(--color-text)]">Choose preferred time</legend>
        <p className="mt-2 text-sm leading-7 text-[var(--color-text-secondary)]">Choose an available slot for this experience.</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {slots.map((slot) => {
            const selected = value === slot.id

            return (
              <label key={slot.id} className="cursor-pointer">
                <input type="radio" name="preferred-time" value={slot.id} checked={selected} onChange={() => onChange(slot.id)} className="sr-only" />
                <div className={`rounded-2xl border px-4 py-4 transition ${selected ? 'border-[var(--color-primary)]/45 bg-[var(--color-primary)]/12' : 'border-white/12 bg-white/6 hover:border-white/20'}`}>
                  <p className="text-base font-semibold text-[var(--color-text)]">{slot.label}</p>
                  <p className="mt-1 text-sm text-[var(--color-text-secondary)]">{slot.period}</p>
                </div>
              </label>
            )
          })}
        </div>
      </fieldset>
      {!slots.length ? <p className="mt-3 text-sm text-(--color-text-secondary)">No slots are configured for this date.</p> : null}
      {error ? <p role="alert" className="mt-3 text-sm text-rose-300">{error}</p> : null}
    </div>
  )
}
