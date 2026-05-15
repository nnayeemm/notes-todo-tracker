import type { ToastState } from '../../types/api'
import { Icon } from './Icon'
import './Toast.css'

interface ToastProps {
  onClose: () => void
  toast: ToastState | null
}

export function Toast({ onClose, toast }: ToastProps) {
  if (!toast) {
    return null
  }

  return (
    <div className={`toast toast--${toast.type}`} role="status">
      <div className="toast__body">
        <Icon className="toast__icon" name={toast.type === 'success' ? 'success' : 'error'} />
        <span>{toast.message}</span>
      </div>
      <button aria-label="Dismiss message" className="toast__close" onClick={onClose} type="button">
        <Icon className="toast__close-icon" name="close" />
      </button>
    </div>
  )
}
