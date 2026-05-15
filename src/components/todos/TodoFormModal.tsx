import { useState } from 'react'
import type {
  NoteSummary,
  Priority,
  Todo,
  TodoCreatePayload,
  TodoUpdatePayload,
} from '../../types/api'
import { toDateTimeInputValue, toIsoDateTime } from '../../utils/format'
import { Button } from '../ui/Button'
import { ErrorMessage } from '../ui/ErrorMessage'
import { Input } from '../ui/Input'
import { Modal } from '../ui/Modal'
import './TodoFormModal.css'

interface TodoFormModalProps {
  initialValues: Todo | null
  isOpen: boolean
  isSubmitting: boolean
  notes: NoteSummary[]
  onClose: () => void
  onSubmit: (payload: TodoCreatePayload | TodoUpdatePayload) => Promise<void>
}

export function TodoFormModal({
  initialValues,
  isOpen,
  isSubmitting,
  notes,
  onClose,
  onSubmit,
}: TodoFormModalProps) {
  const [title, setTitle] = useState(initialValues?.title ?? '')
  const [description, setDescription] = useState(initialValues?.description ?? '')
  const [priority, setPriority] = useState<Priority>(initialValues?.priority ?? 'medium')
  const [dueDate, setDueDate] = useState(toDateTimeInputValue(initialValues?.due_date))
  const [noteId, setNoteId] = useState(initialValues?.note_id ? String(initialValues.note_id) : '')
  const [isCompleted, setIsCompleted] = useState(initialValues?.is_completed ?? false)
  const [formError, setFormError] = useState('')

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!title.trim()) {
      setFormError('Todo title is required.')
      return
    }

    try {
      setFormError('')

      const basePayload: TodoCreatePayload = {
        title: title.trim(),
        description: description.trim() ? description.trim() : null,
        priority,
        due_date: dueDate ? toIsoDateTime(dueDate) : null,
        note_id: noteId ? Number(noteId) : null,
      }

      if (initialValues) {
        await onSubmit({
          ...basePayload,
          is_completed: isCompleted,
        })
        return
      }

      await onSubmit(basePayload)
    } catch (caughtError) {
      const message =
        caughtError instanceof Error ? caughtError.message : 'Unable to save the todo.'
      setFormError(message)
    }
  }

  return (
    <Modal
      description="create or update task records / to-do."
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button form="todo-form" isLoading={isSubmitting} type="submit">
            {initialValues ? 'Save todo' : 'Create todo'}
          </Button>
        </>
      }
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title={initialValues ? 'Edit todo' : 'Create todo'}
    >
      <form className="todo-form" id="todo-form" onSubmit={handleSubmit}>
        {formError ? <ErrorMessage message={formError} title="Validation issue" /> : null}

        <div className="two-column">
          <Input
            label="Title"
            maxLength={255}
            onChange={(event) => {
              setFormError('')
              setTitle(event.target.value)
            }}
            placeholder="Draft release checklist"
            value={title}
          />
          <label className="field">
            <span className="field__label">Priority</span>
            <select
              className="field__control"
              onChange={(event) => {
                setFormError('')
                setPriority(event.target.value as Priority)
              }}
              value={priority}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </label>
        </div>

        <Input
          label="Description"
          onChange={(event) => {
            setFormError('')
            setDescription(event.target.value)
          }}
          placeholder="Optional details for this todo..."
          textarea
          value={description}
        />

        <div className="two-column">
          <Input
            label="Due date"
            onChange={(event) => {
              setFormError('')
              setDueDate(event.target.value)
            }}
            type="datetime-local"
            value={dueDate}
          />

          <label className="field">
            <span className="field__label">Linked note</span>
            <select
              className="field__control"
              onChange={(event) => {
                setFormError('')
                setNoteId(event.target.value)
              }}
              value={noteId}
            >
              <option value="">No linked note</option>
              {notes.map((note) => (
                <option key={note.id} value={note.id}>
                  #{note.id} {note.title}
                </option>
              ))}
            </select>
          </label>
        </div>

        {initialValues ? (
          <label className="todo-form__checkbox">
            <input
              checked={isCompleted}
              onChange={(event) => {
                setFormError('')
                setIsCompleted(event.target.checked)
              }}
              type="checkbox"
            />
            <span>{isCompleted ? 'Completed' : 'Open'}</span>
          </label>
        ) : null}
      </form>
    </Modal>
  )
}
