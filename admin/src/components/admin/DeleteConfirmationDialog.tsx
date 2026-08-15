import DangerButton from './DangerButton'
import SecondaryButton from './SecondaryButton'
import Modal from './modal/Modal'

type DeleteConfirmationDialogProps = {
  isOpen: boolean
  resourceName: string
  onCancel: () => void
  onConfirm: () => void
}

export default function DeleteConfirmationDialog({ isOpen, resourceName, onCancel, onConfirm }: DeleteConfirmationDialogProps) {
  return (
    <Modal
      isOpen={isOpen}
      title="Delete Confirmation"
      onClose={onCancel}
      footer={
        <div className="flex justify-end gap-2">
          <SecondaryButton onClick={onCancel}>Cancel</SecondaryButton>
          <DangerButton onClick={onConfirm}>Delete</DangerButton>
        </div>
      }
    >
      <p className="text-sm text-(--color-text-secondary)">Are you sure you want to delete <span className="font-medium text-(--color-text)">{resourceName}</span>? This action is reversible in future soft-delete workflows.</p>
    </Modal>
  )
}
