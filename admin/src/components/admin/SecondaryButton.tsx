import { type ButtonHTMLAttributes } from 'react'

type SecondaryButtonProps = ButtonHTMLAttributes<HTMLButtonElement>

export default function SecondaryButton({ className = '', type = 'button', ...props }: SecondaryButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center rounded-full border border-white/20 bg-white/6 px-4 py-2 text-sm font-medium text-(--color-text) transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-primary) ${className}`}
      {...props}
    />
  )
}
