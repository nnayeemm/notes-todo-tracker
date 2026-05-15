import type { ReactNode } from 'react'
import './EmptyState.css'

interface EmptyStateProps {
  action?: ReactNode
  description: string
  title: string
}

export function EmptyState({ action, description, title }: EmptyStateProps) {
  return (
    <div className="empty-state surface surface--padded">
      <p className="empty-state__eyebrow">Nothing here yet</p>
      <h2 className="empty-state__title">{title}</h2>
      <p className="empty-state__description">{description}</p>
      {action ? <div className="empty-state__action">{action}</div> : null}
    </div>
  )
}
