import FieldBase from './FieldBase'

type Option = {
  label: string
  value: string
}

type SelectInputProps = {
  label: string
  value: string
  options: Option[]
  onChange: (value: string) => void
  helpText?: string
  validationMessage?: string
}

export default function SelectInput({ label, value, options, onChange, helpText, validationMessage }: SelectInputProps) {
  return (
    <FieldBase label={label} helpText={helpText} validationMessage={validationMessage}>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full rounded-xl border border-white/15 bg-white/6 px-3 text-sm text-(--color-text)"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </FieldBase>
  )
}
