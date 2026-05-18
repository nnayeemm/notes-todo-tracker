import { Icon } from '../ui/Icon'
import './AddNewTodoCard.css'

interface AddNewTodoCardProps {
  onClick: () => void
}

export function AddNewTodoCard({ onClick }: AddNewTodoCardProps) {
  return (
    <button type="button" className="add-todo-card" onClick={onClick}>
      <div className="add-todo-card__iconWrap" aria-hidden="true">
        <Icon className="add-todo-card__plus" name="add" />
      </div>

      <div className="add-todo-card__content">
        <h3 className="add-todo-card__title">Add New Todo</h3>
        <p className="add-todo-card__subtitle">Track your next task</p>
      </div>

      <span className="add-todo-card__srOnly">Create a new todo</span>
    </button>
  )
}

