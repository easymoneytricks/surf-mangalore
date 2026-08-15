type Option = {
  label: string
  value: string
}

type RadioGroupInputProps = {
  label: string
  value: string
  options: Option[]
  onChange: (value: string) => void
}

export default function RadioGroupInput({ label, value, options, onChange }: RadioGroupInputProps) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-xs font-medium tracking-[0.08em] text-(--color-text-secondary) uppercase">{label}</legend>
      <div className="flex flex-wrap gap-3">
        {options.map((option) => (
          <label key={option.value} className="inline-flex items-center gap-2 text-sm text-(--color-text)">
            <input
              type="radio"
              value={option.value}
              checked={value === option.value}
              onChange={(event) => onChange(event.target.value)}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}
