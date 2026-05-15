import { Link } from 'react-router-dom'
import type { NoteSummary, Todo } from '../../types/api'
import { formatDateTime, truncateText } from '../../utils/format'
import { Button } from '../ui/Button'
import { Icon } from '../ui/Icon'
import './TodoCard.css'

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
  const priorityVariant =
    todo.priority === 'high'
      ? 'status-chip--danger'
      : todo.priority === 'medium'
        ? 'status-chip--warning'
        : 'status-chip--success'

  return (
    <article className={`todo-card surface ${todo.is_completed ? 'todo-card--completed' : ''}`}>
      <button
        aria-label={todo.is_completed ? 'Unmark todo complete' : 'Mark todo complete'}
        className={`todo-card__toggle ${todo.is_completed ? 'todo-card__toggle--done' : ''}`}
        disabled={isCompleting}
        onClick={() => onComplete(todo)}
        type="button"
      >
        <Icon className="todo-card__toggle-icon" name={todo.is_completed ? 'undo' : 'checkCircle'} />
      </button>

      <div className="todo-card__body">
        <div className="todo-card__topline">
          <div className="todo-card__text">
            <h2 className="todo-card__title">{todo.title}</h2>
            <p className="todo-card__description">
              {todo.description ? truncateText(todo.description) : 'No description provided.'}
            </p>
          </div>

          <div className="todo-card__side">
            <span className={`status-chip ${priorityVariant}`}>{todo.priority}</span>
            <div className="todo-card__actions">
              <Button size="sm" variant="ghost" onClick={() => onEdit(todo)}>
                <Icon className="button__icon" name="edit" />
                Edit
              </Button>
              <Button size="sm" variant="secondary" onClick={() => onDelete(todo)}>
                <Icon className="button__icon" name="delete" />
                Delete
              </Button>
            </div>
          </div>
        </div>

        <div className="todo-card__footer">
          <span className="meta-text">Due: {formatDateTime(todo.due_date)}</span>
          {linkedNote ? (
            <Link className="todo-card__linked-note" to={`/notes/${linkedNote.id}?from=todos`}>
              <Icon className="todo-card__linked-note-icon" name="link" />
              <span className="todo-card__linked-note-label">Linked note</span>
              <span className="todo-card__linked-note-title">
                #{linkedNote.id} {linkedNote.title}
              </span>
            </Link>
          ) : (
            <span className="meta-text">No linked note</span>
          )}
          <span className="meta-text">
            {todo.is_completed ? `Completed ${formatDateTime(todo.updated_at)}` : 'Open'}
          </span>
        </div>
      </div>
    </article>
  )
}
