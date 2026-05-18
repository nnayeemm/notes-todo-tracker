import { useState } from 'react'
import type { KeyboardEvent } from 'react'
import type { NoteSummary } from '../../types/api'
import { formatDateTime } from '../../utils/format'
import { Button } from '../ui/Button'
import { Icon } from '../ui/Icon'
import './NoteCard.css'

const PREVIEW_LIMIT = 160

// Deterministic category → hue mapping for dynamic color theming
const CATEGORY_HUES: Record<string, string> = {
  development: '172',
  design:      '258',
  marketing:   '32',
  research:    '210',
  personal:    '290',
  finance:     '142',
  ops:         '196',
  general:     '200',
}

function getCategoryHue(category: string | null): string {
  if (!category) return CATEGORY_HUES.general
  const key = category.toLowerCase().trim()
  if (CATEGORY_HUES[key]) return CATEGORY_HUES[key]
  // Deterministic fallback from string hash
  let hash = 0
  for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) & 0xffff
  return String(hash % 360)
}

interface NoteCardProps {
  isTogglingPin?: boolean
  note: NoteSummary
  onDelete: (note: NoteSummary) => void
  onEdit: (note: NoteSummary) => void
  onOpen: (noteId: number) => void
  onTogglePin: (note: NoteSummary) => void
}

export function NoteCard({
  isTogglingPin = false,
  note,
  onDelete,
  onEdit,
  onOpen,
  onTogglePin,
}: NoteCardProps) {
  const [expanded, setExpanded] = useState(false)

  const content = note.content ?? ''
  const isTruncatable = content.length > PREVIEW_LIMIT
  const displayedContent =
    isTruncatable && !expanded
      ? `${content.slice(0, PREVIEW_LIMIT).trimEnd()}…`
      : content

  const hue = getCategoryHue(note.category)
  const categoryLabel = note.category ?? 'General'

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onOpen(note.id)
    }
  }

  return (
    <article
      className={`note-card${note.is_pinned ? ' note-card--pinned' : ''}`}
      onClick={() => onOpen(note.id)}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      style={{ '--note-hue': hue } as React.CSSProperties}
      aria-label={`Open note: ${note.title}`}
    >
      {/* Pinned glow strip */}
      {note.is_pinned && <div className="note-card__pin-strip" aria-hidden="true" />}

      {/* ── Top row: category + pin controls ── */}
      <div className="note-card__topline">
        <span className="note-card__category">
          {categoryLabel}
        </span>

        <div
          className="note-card__pin-controls"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            aria-label={note.is_pinned ? 'Unpin note' : 'Pin note'}
            className={`note-card__pin-btn${note.is_pinned ? ' note-card__pin-btn--active' : ''}`}
            disabled={isTogglingPin}
            onClick={() => onTogglePin(note)}
            type="button"
          >
            <Icon
              className="note-card__pin-icon"
              name={note.is_pinned ? 'unpin' : 'pin'}
            />
            {note.is_pinned ? 'Unpin' : 'Pin'}
          </button>

          {note.is_pinned && (
            <span className="note-card__pinned-badge" aria-label="This note is pinned">
              <Icon className="note-card__pinned-badge-icon" name="pin" />
              Pinned
            </span>
          )}
        </div>
      </div>

      {/* ── Title ── */}
      <h2 className="note-card__title">{note.title}</h2>

      {/* ── Content (grow) ── */}
      <div className="note-card__content">
        {/* ── Preview / description ── */}
        <div className="note-card__preview-wrap">
          <p className="note-card__preview">
            {content ? displayedContent : <em className="note-card__preview--empty">No content yet.</em>}
          </p>
          {isTruncatable && (
            <button
              className="note-card__read-more"
              onClick={(e) => {
                e.stopPropagation()
                setExpanded((v) => !v)
              }}
              type="button"
            >
              {expanded ? 'Show less' : 'Read more'}
            </button>
          )}
        </div>

        {/* ── Divider ── */}
        <div className="note-card__divider" aria-hidden="true" />

        {/* ── Metadata row ── */}
        <div className="note-card__meta">
          <span className="note-card__meta-item">
            <Icon className="note-card__meta-icon" name="calendar" />
            {formatDateTime(note.updated_at)}
          </span>
          <span className="note-card__meta-item">
            <Icon className="note-card__meta-icon" name="paperclip" />
            {note.attachment_count} {note.attachment_count === 1 ? 'file' : 'files'}
          </span>
        </div>
      </div>

      {/* ── Footer / Action buttons (pinned to bottom) ── */}
      <div
        className="note-card__actions"
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          className="note-card__action-btn note-card__action-btn--edit"
          size="sm"
          variant="ghost"
          onClick={() => onEdit(note)}
        >
          <Icon className="button__icon" name="edit" />
          Edit
        </Button>
        <Button
          className="note-card__action-btn note-card__action-btn--delete"
          size="sm"
          variant="secondary"
          onClick={() => onDelete(note)}
        >
          <Icon className="button__icon" name="delete" />
          Delete
        </Button>
      </div>
    </article>
  )
}
