import FieldBase from './FieldBase'

type Option = {
  label: string
  value: string
}

type MultiSelectInputProps = {
  label: string
  values: string[]
  options: Option[]
  onChange: (values: string[]) => void
}

export default function MultiSelectInput({ label, values, options, onChange }: MultiSelectInputProps) {
  return (
    <FieldBase label={label}>
      <select
        multiple
        value={values}
        onChange={(event) => {
          const nextValues = Array.from(event.target.selectedOptions).map((option) => option.value)
          onChange(nextValues)
        }}
        className="min-h-28 w-full rounded-xl border border-white/15 bg-white/6 px-3 py-2 text-sm text-(--color-text)"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </FieldBase>
  )
}
