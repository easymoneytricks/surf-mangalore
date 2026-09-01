type DatePickerProps = {
  value: string
  error?: string
  onChange: (value: string) => void
  availableDates?: string[]
}

function getMinDate() {
  const today = new Date()
  return today.toISOString().split('T')[0]
}

export default function DatePicker({ value, error, onChange, availableDates }: DatePickerProps) {
  return (
    <div>
      <label htmlFor="preferred-date" className="text-xl font-semibold text-[var(--color-text)]">Choose preferred date</label>
      <p className="mt-2 text-sm leading-7 text-[var(--color-text-secondary)]">Select the day that works best and we will confirm ocean conditions afterward.</p>
      <div className="mt-6 max-w-md">
        {availableDates ? <select id="preferred-date" value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-2xl border border-white/12 bg-white/8 px-4 py-3 text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/25">
          <option value="">Select an available date</option>
          {availableDates.map((date) => <option key={date} value={date}>{date}</option>)}
        </select> : <input
          id="preferred-date"
          type="date"
          min={getMinDate()}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? 'preferred-date-error' : undefined}
          className="w-full rounded-2xl border border-white/12 bg-white/8 px-4 py-3 text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/25"
        />}
      </div>
      {error ? <p id="preferred-date-error" role="alert" className="mt-3 text-sm text-rose-300">{error}</p> : null}
    </div>
  )
}
