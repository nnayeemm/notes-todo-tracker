import type { KeyboardEvent } from 'react'
import type { NoteSummary } from '../../types/api'
import { formatDateTime, truncateText } from '../../utils/format'
import { Button } from '../ui/Button'
import { Icon } from '../ui/Icon'
import './NoteCard.css'

interface NoteCardProps {
  note: NoteSummary
  onDelete: (note: NoteSummary) => void
  onEdit: (note: NoteSummary) => void
  onOpen: (noteId: number) => void
  onTogglePin: (note: NoteSummary) => void
}

export function NoteCard({ note, onDelete, onEdit, onOpen, onTogglePin }: NoteCardProps) {
  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onOpen(note.id)
    }
  }

  return (
    <article
      className="note-card surface"
      onClick={() => onOpen(note.id)}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
    >
      <div className="note-card__topline">
        <span className={`note-card__category ${note.category ? '' : 'note-card__category--muted'}`}>
          {note.category ?? 'General'}
        </span>
        <div className="note-card__topline-actions">
          <Button
            size="sm"
            variant="ghost"
            onClick={(event) => {
              event.stopPropagation()
              onTogglePin(note)
            }}
          >
            <Icon className="button__icon note-card__pin-action-icon" name={note.is_pinned ? 'unpin' : 'pin'} />
            {note.is_pinned ? 'Unpin' : 'Pin'}
          </Button>
          {note.is_pinned ? <span className="note-card__pin">Pinned</span> : null}
        </div>
      </div>

      <h2 className="note-card__title">{note.title}</h2>
      <p className="note-card__preview">{truncateText(note.content)}</p>

      <div className="note-card__footer">
        <div className="note-card__meta">
          <span className="meta-text">{formatDateTime(note.updated_at)}</span>
          <span className="meta-text">
            {note.attachment_count} {note.attachment_count === 1 ? 'file' : 'files'}
          </span>
        </div>

        <div className="note-card__actions" onClick={(event) => event.stopPropagation()}>
          <Button size="sm" variant="ghost" onClick={() => onEdit(note)}>
            <Icon className="button__icon" name="edit" />
            Edit
          </Button>
          <Button size="sm" variant="secondary" onClick={() => onDelete(note)}>
            <Icon className="button__icon" name="delete" />
            Delete
          </Button>
        </div>
      </div>
    </article>
  )
}
