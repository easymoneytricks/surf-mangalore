import { type TextareaHTMLAttributes } from 'react'

import FieldBase from './FieldBase'

type TextareaInputProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string
  helpText?: string
  validationMessage?: string
}

export default function TextareaInput({ label, helpText, validationMessage, className = '', ...props }: TextareaInputProps) {
  return (
    <FieldBase label={label} helpText={helpText} validationMessage={validationMessage}>
      <textarea className={`min-h-28 w-full rounded-xl border border-white/15 bg-white/6 px-3 py-2 text-sm text-(--color-text) ${className}`} {...props} />
    </FieldBase>
  )
}
