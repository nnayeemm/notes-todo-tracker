import type { ReactNode } from 'react'
import { Icon } from './Icon'
import './ErrorMessage.css'

interface ErrorMessageProps {
  action?: ReactNode
  message: string
  title?: string
}

export function ErrorMessage({
  action,
  message,
  title = 'Something went wrong',
}: ErrorMessageProps) {
  return (
    <div className="error-message" role="alert">
      <div className="error-message__body">
        <Icon className="error-message__icon" name="error" />
        <div>
          <p className="error-message__title">{title}</p>
          <p className="error-message__copy">{message}</p>
        </div>
      </div>
      {action ? <div className="error-message__action">{action}</div> : null}
    </div>
  )
}
