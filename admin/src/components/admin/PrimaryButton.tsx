import { type ButtonHTMLAttributes } from 'react'

type PrimaryButtonProps = ButtonHTMLAttributes<HTMLButtonElement>

export default function PrimaryButton({ className = '', type = 'button', ...props }: PrimaryButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center rounded-full bg-(--color-primary) px-4 py-2 text-sm font-semibold text-(--color-surface) transition hover:bg-(--color-primary-strong) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-primary) ${className}`}
      {...props}
    />
  )
}
