import type { NoteSummary, Todo } from '../../types/api'
import { TodoCard } from './TodoCard'
import './TodosList.css'

interface TodosListProps {
  completingTodoId: number | null
  linkedNotesById: Map<number, NoteSummary>
  onComplete: (todo: Todo) => void
  onDelete: (todo: Todo) => void
  onEdit: (todo: Todo) => void
  todos: Todo[]
}

export function TodosList({
  completingTodoId,
  linkedNotesById,
  onComplete,
  onDelete,
  onEdit,
  todos,
}: TodosListProps) {
  return (
    <div className="todos-list">
      {todos.map((todo) => (
        <TodoCard
          key={todo.id}
          isCompleting={completingTodoId === todo.id}
          linkedNote={todo.note_id ? linkedNotesById.get(todo.note_id) ?? null : null}
          onComplete={onComplete}
          onDelete={onDelete}
          onEdit={onEdit}
          todo={todo}
        />
      ))}
    </div>
  )
}
