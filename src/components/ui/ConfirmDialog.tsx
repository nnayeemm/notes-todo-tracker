import { Button } from './Button'
import { Modal } from './Modal'

interface ConfirmDialogProps {
  confirmLabel?: string
  description: string
  isLoading?: boolean
  isOpen: boolean
  onCancel: () => void
  onConfirm: () => void
  title: string
}

export function ConfirmDialog({
  confirmLabel = 'Delete',
  description,
  isLoading = false,
  isOpen,
  onCancel,
  onConfirm,
  title,
}: ConfirmDialogProps) {
  return (
    <Modal
      description={description}
      footer={
        <>
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button isLoading={isLoading} variant="danger" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </>
      }
      isOpen={isOpen}
      onClose={onCancel}
      size="sm"
      title={title}
    >
      <p className="meta-text">
        This action can&apos;t be undone from the frontend.
      </p>
    </Modal>
  )
}
