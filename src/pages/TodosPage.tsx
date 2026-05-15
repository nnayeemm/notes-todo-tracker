import { useDeferredValue, useEffect, useState } from 'react'
import { TodosList } from '../components/todos/TodosList'
import { TodoFormModal } from '../components/todos/TodoFormModal'
import { Button } from '../components/ui/Button'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { EmptyState } from '../components/ui/EmptyState'
import { ErrorMessage } from '../components/ui/ErrorMessage'
import { Icon } from '../components/ui/Icon'
import { Input } from '../components/ui/Input'
import { LoadingIndicator } from '../components/ui/LoadingIndicator'
import { Toast } from '../components/ui/Toast'
import { useToast } from '../hooks/useToast'
import { notesService } from '../services/notesService'
import { todosService } from '../services/todosService'
import type {
  NoteSummary,
  Priority,
  Todo,
  TodoCreatePayload,
  TodoUpdatePayload,
} from '../types/api'
import './TodosPage.css'

type StatusFilter = 'all' | 'open' | 'completed'
type PriorityFilter = 'all' | Priority

export function TodosPage() {
  const { clearToast, showToast, toast } = useToast()
  const [todos, setTodos] = useState<Todo[]>([])
  const [notes, setNotes] = useState<NoteSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('all')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [todoToDelete, setTodoToDelete] = useState<Todo | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [completingTodoId, setCompletingTodoId] = useState<number | null>(null)

  const deferredSearchTerm = useDeferredValue(searchTerm)

  const loadData = async () => {
    try {
      setError('')
      const [nextTodos, nextNotes] = await Promise.all([
        todosService.getTodos(),
        notesService.getNotes(),
      ])
      setTodos(nextTodos)
      setNotes(nextNotes)
    } catch (caughtError) {
      const message =
        caughtError instanceof Error ? caughtError.message : 'Unable to load todos.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let isMounted = true

    const run = async () => {
      try {
        const [nextTodos, nextNotes] = await Promise.all([
          todosService.getTodos(),
          notesService.getNotes(),
        ])

        if (!isMounted) {
          return
        }

        setError('')
        setTodos(nextTodos)
        setNotes(nextNotes)
      } catch (caughtError) {
        if (!isMounted) {
          return
        }

        const message =
          caughtError instanceof Error ? caughtError.message : 'Unable to load todos.'
        setError(message)
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    void run()

    return () => {
      isMounted = false
    }
  }, [])

  const normalizedSearch = deferredSearchTerm.trim().toLowerCase()
  const filteredTodos = todos.filter((todo) => {
    const matchesSearch = normalizedSearch
      ? [todo.title, todo.description ?? '', String(todo.note_id ?? '')]
          .join(' ')
          .toLowerCase()
          .includes(normalizedSearch)
      : true

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'completed' ? todo.is_completed : !todo.is_completed)

    const matchesPriority =
      priorityFilter === 'all' || todo.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

  const handleSubmit = async (payload: TodoCreatePayload | TodoUpdatePayload) => {
    try {
      setIsSubmitting(true)

      if (editingTodo) {
        await todosService.updateTodo(editingTodo.id, payload as TodoUpdatePayload)
        showToast({ message: 'Todo updated successfully.', type: 'success' })
      } else {
        await todosService.createTodo(payload as TodoCreatePayload)
        showToast({ message: 'Todo created successfully.', type: 'success' })
      }

      setIsFormOpen(false)
      setEditingTodo(null)
      setLoading(true)
      await loadData()
    } catch (caughtError) {
      const message =
        caughtError instanceof Error ? caughtError.message : 'Unable to save todo.'
      showToast({ message, type: 'error' })
      throw caughtError instanceof Error ? caughtError : new Error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!todoToDelete) {
      return
    }

    try {
      setIsDeleting(true)
      await todosService.deleteTodo(todoToDelete.id)
      showToast({ message: 'Todo deleted successfully.', type: 'success' })
      setTodoToDelete(null)
      setLoading(true)
      await loadData()
    } catch (caughtError) {
      const message =
        caughtError instanceof Error ? caughtError.message : 'Unable to delete todo.'
      showToast({ message, type: 'error' })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleComplete = async (todo: Todo) => {
    try {
      setCompletingTodoId(todo.id)
      await todosService.updateTodo(todo.id, {
        is_completed: !todo.is_completed,
      })
      showToast({
        message: todo.is_completed ? 'Todo marked as open again.' : 'Todo marked as complete.',
        type: 'success',
      })
      setLoading(true)
      await loadData()
    } catch (caughtError) {
      const message =
        caughtError instanceof Error ? caughtError.message : 'Unable to update todo completion.'
      showToast({ message, type: 'error' })
    } finally {
      setCompletingTodoId(null)
    }
  }

  return (
    <div className="page">
      <div className="page__header">
        <div className="page__heading">
          <div className="meta-row">
            <p className="page__eyebrow">Tasks</p>
            <span className="page__count">{todos.length} total</span>
          </div>
          <h1 className="page__title">Task Manager</h1>
          <p className="page__subtitle">Track work clearly, update status fast, and jump into linked notes.</p>
        </div>

        <div className="page__toolbar page__toolbar--stacked page__toolbar-panel todos-page__toolbar surface surface--padded">
          <Input
            label="Search todos"
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search title, description, or note ID"
            value={searchTerm}
            wrapperClassName="todos-page__search"
          />
          <div className="todos-page__filters">
            <label className="field todos-page__filter">
              <span className="field__label">Status</span>
              <select
                className="field__control"
                onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
                value={statusFilter}
              >
                <option value="all">All</option>
                <option value="open">Open</option>
                <option value="completed">Completed</option>
              </select>
            </label>
            <label className="field todos-page__filter">
              <span className="field__label">Priority</span>
              <select
                className="field__control"
                onChange={(event) => setPriorityFilter(event.target.value as PriorityFilter)}
                value={priorityFilter}
              >
                <option value="all">All</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </label>
          </div>
          <Button
            fullWidth
            onClick={() => {
              setEditingTodo(null)
              setIsFormOpen(true)
            }}
          >
            <Icon className="button__icon" name="add" />
            Create todo
          </Button>
        </div>
      </div>

      {loading ? (
        <LoadingIndicator label="Loading todos..." />
      ) : error ? (
        <ErrorMessage action={<Button onClick={() => void loadData()}>Try again</Button>} message={error} />
      ) : filteredTodos.length === 0 ? (
        <EmptyState
          action={
            todos.length === 0 ? (
              <Button onClick={() => setIsFormOpen(true)}>Create your first todo</Button>
            ) : undefined
          }
          description={
            todos.length === 0
              ? 'Create a todo, link it to a note if needed, and update it through the backend.'
              : 'Adjust your search text or filters to find the todos already loaded from the backend.'
          }
          title={todos.length === 0 ? 'No todos yet' : 'No todos match these filters'}
        />
      ) : (
        <TodosList
          completingTodoId={completingTodoId}
          linkedNotesById={new Map(notes.map((note) => [note.id, note]))}
          todos={filteredTodos}
          onComplete={(todo) => void handleComplete(todo)}
          onDelete={(todo) => setTodoToDelete(todo)}
          onEdit={(todo) => {
            setEditingTodo(todo)
            setIsFormOpen(true)
          }}
        />
      )}

      {completingTodoId ? (
        <p className="todos-page__status">Updating todo #{completingTodoId}...</p>
      ) : null}

      {isFormOpen ? (
        <TodoFormModal
          key={editingTodo?.id ?? 'new-todo'}
          initialValues={editingTodo}
          isOpen={isFormOpen}
          isSubmitting={isSubmitting}
          notes={notes}
          onClose={() => {
            setEditingTodo(null)
            setIsFormOpen(false)
          }}
          onSubmit={handleSubmit}
        />
      ) : null}

      <ConfirmDialog
        confirmLabel="Delete todo"
        description={
          todoToDelete ? `Delete "${todoToDelete.title}" from the backend.` : ''
        }
        isLoading={isDeleting}
        isOpen={Boolean(todoToDelete)}
        onCancel={() => setTodoToDelete(null)}
        onConfirm={() => void handleDelete()}
        title="Delete todo?"
      />

      <Toast onClose={clearToast} toast={toast} />
    </div>
  )
}
