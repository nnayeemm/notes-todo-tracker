import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { NoteSummary, Todo } from '../../types/api'
import { formatDateTime } from '../../utils/format'
import { Button } from '../ui/Button'
import { Icon } from '../ui/Icon'
import './TodoCard.css'

const DESCRIPTION_LIMIT = 140

interface TodoCardProps {
  isCompleting: boolean
  linkedNote: NoteSummary | null
  onComplete: (todo: Todo) => void
  onDelete: (todo: Todo) => void
  onEdit: (todo: Todo) => void
  todo: Todo
}

export function TodoCard({
  isCompleting,
  linkedNote,
  onComplete,
  onDelete,
  onEdit,
  todo,
}: TodoCardProps) {
  const [expanded, setExpanded] = useState(false)

  const description = todo.description ?? ''
  const isTruncatable = description.length > DESCRIPTION_LIMIT
  const displayedDescription =
    isTruncatable && !expanded
      ? `${description.slice(0, DESCRIPTION_LIMIT).trimEnd()}…`
      : description

  const priorityClass =
    todo.priority === 'high'
      ? 'todo-card--high'
      : todo.priority === 'medium'
        ? 'todo-card--medium'
        : 'todo-card--low'

  const priorityChipClass =
    todo.priority === 'high'
      ? 'status-chip--danger'
      : todo.priority === 'medium'
        ? 'status-chip--warning'
        : 'status-chip--success'

  return (
    <article
      className={`todo-card surface ${priorityClass} ${todo.is_completed ? 'todo-card--completed' : ''}`}
    >
      {/* Priority accent bar */}
      <div className="todo-card__accent" aria-hidden="true" />

      {/* Header row: toggle + title + priority badge */}
      <div className="todo-card__header">
        <button
          aria-label={todo.is_completed ? 'Unmark todo complete' : 'Mark todo complete'}
          className={`todo-card__toggle ${todo.is_completed ? 'todo-card__toggle--done' : ''}`}
          disabled={isCompleting}
          onClick={() => onComplete(todo)}
          type="button"
        >
          <Icon
            className="todo-card__toggle-icon"
            name={todo.is_completed ? 'undo' : 'checkCircle'}
          />
        </button>

        <div className="todo-card__header-text">
          <h2 className="todo-card__title">{todo.title}</h2>
        </div>

        <span className={`status-chip todo-card__priority-badge ${priorityChipClass}`}>
          {todo.priority}
        </span>
      </div>

      {/* Description */}
      {description ? (
        <div className="todo-card__description-wrap">
          <p className="todo-card__description">{displayedDescription}</p>
          {isTruncatable && (
            <button
              className="todo-card__read-more"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setExpanded((v) => !v)
              }}
              type="button"
            >
              {expanded ? 'Show less' : 'Read more'}
            </button>

          )}
        </div>
      ) : (
        <p className="todo-card__description todo-card__description--empty">
          No description provided.
        </p>
      )}

      {/* Action buttons */}
      <div className="todo-card__actions">
        <Button
          className="todo-card__action-btn todo-card__action-btn--edit"
          size="sm"
          variant="ghost"
          onClick={() => onEdit(todo)}
        >
          <Icon className="button__icon" name="edit" />
          Edit
        </Button>
        <Button
          className="todo-card__action-btn todo-card__action-btn--delete"
          size="sm"
          variant="secondary"
          onClick={() => onDelete(todo)}
        >
          <Icon className="button__icon" name="delete" />
          Delete
        </Button>
      </div>

      {/* Footer: due date · linked note · status */}
      <footer className="todo-card__footer">
        <div className="todo-card__footer-row">
          <span className="todo-card__meta-item">
            <Icon className="todo-card__meta-icon" name="pin" />
            Due: {formatDateTime(todo.due_date)}
          </span>

          <span className="todo-card__status-badge">
            {todo.is_completed ? 'Completed' : 'Open'}
          </span>
        </div>

        {linkedNote ? (
          <Link
            className="todo-card__linked-note"
            to={`/notes/${linkedNote.id}?from=todos`}
          >
            <span className="todo-card__linked-note-left">
              <Icon className="todo-card__linked-note-icon" name="link" />
              <span className="todo-card__linked-note-label">Linked note</span>
            </span>
            <span className="todo-card__linked-note-title">
              #{linkedNote.id} {linkedNote.title}
            </span>
          </Link>
        ) : (
          <span className="todo-card__no-link">
            <Icon className="todo-card__meta-icon" name="link" />
            No linked note
          </span>
        )}

        {todo.is_completed && (
          <p className="todo-card__completed-at">
            Completed {formatDateTime(todo.updated_at)}
          </p>
        )}
      </footer>
    </article>
  )
}
