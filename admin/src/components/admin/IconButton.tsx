import { type ButtonHTMLAttributes, type ReactNode } from 'react'

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: ReactNode
  label: string
}

export default function IconButton({ icon, label, className = '', type = 'button', ...props }: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      className={`inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/6 text-(--color-text) transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-primary) ${className}`}
      {...props}
    >
      {icon}
    </button>
  )
}
