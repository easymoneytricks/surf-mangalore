import { type ReactNode } from 'react'

type ModalProps = {
  isOpen: boolean
  title: string
  children: ReactNode
  onClose: () => void
  footer?: ReactNode
}

export default function Modal({ isOpen, title, children, onClose, footer }: ModalProps) {
  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" role="presentation">
      <div role="dialog" aria-modal="true" aria-label={title} className="admin-card max-h-[calc(100vh-2rem)] w-full max-w-lg overflow-y-auto rounded-2xl p-6">
        <div className="mb-4 flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold text-(--color-text)">{title}</h3>
          <button type="button" onClick={onClose} className="rounded-full border border-white/20 px-2 py-1 text-xs text-(--color-text-secondary)">Close</button>
        </div>
        <div>{children}</div>
        {footer ? <div className="mt-5">{footer}</div> : null}
      </div>
    </div>
  )
}
