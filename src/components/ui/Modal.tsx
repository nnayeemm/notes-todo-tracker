import { useEffect, type ReactNode } from 'react'
import { Icon } from './Icon'
import './Modal.css'

type ModalSize = 'sm' | 'md' | 'lg'

interface ModalProps {
  children: ReactNode
  footer?: ReactNode
  isOpen: boolean
  onClose: () => void
  size?: ModalSize
  title: string
  description?: string
}

export function Modal({
  children,
  description,
  footer,
  isOpen,
  onClose,
  size = 'md',
  title,
}: ModalProps) {
  useEffect(() => {
    if (!isOpen) {
      return undefined
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) {
    return null
  }

  return (
    <div
      aria-modal="true"
      className="modal"
      role="dialog"
      onClick={onClose}
    >
      <div
        className={`modal__panel modal__panel--${size}`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal__header">
          <div>
            <h2 className="modal__title">{title}</h2>
            {description ? <p className="modal__description">{description}</p> : null}
          </div>
          <button
            aria-label="Close modal"
            className="modal__close"
            onClick={onClose}
            type="button"
          >
            <Icon className="modal__close-icon" name="close" />
          </button>
        </div>

        <div className="modal__body">{children}</div>
        {footer ? <div className="modal__footer">{footer}</div> : null}
      </div>
    </div>
  )
}
