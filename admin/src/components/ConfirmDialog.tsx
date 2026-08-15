type ConfirmDialogProps = {
  isOpen: boolean
  title: string
  description: string
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmDialog({ isOpen, title, description, onConfirm, onCancel }: ConfirmDialogProps) {
  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" role="dialog" aria-modal="true" aria-label={title}>
      <div className="admin-card w-full max-w-md p-6">
        <h2 className="text-lg font-semibold text-(--color-text)">{title}</h2>
        <p className="mt-2 text-sm text-(--color-text-secondary)">{description}</p>
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={onCancel} className="rounded-lg border border-white/20 px-4 py-2 text-sm text-(--color-text-secondary) hover:border-white/40 hover:text-(--color-text)">
            Cancel
          </button>
          <button type="button" onClick={onConfirm} className="rounded-lg bg-(--color-primary) px-4 py-2 text-sm font-medium text-(--color-surface) hover:bg-(--color-primary-strong)">
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}
