import { useState } from 'react'
import type {
  NoteSummary,
  Priority,
  Todo,
  TodoCreatePayload,
  TodoUpdatePayload,
} from '../../types/api'
import { toDateTimeInputValue, toIsoDateTime } from '../../utils/format'

import { ErrorMessage } from '../ui/ErrorMessage'
import { Icon } from '../ui/Icon'
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
        await onSubmit(basePayload)
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
          <button
            aria-label="Cancel"
            className="modal-icon-btn modal-icon-btn--cancel"
            onClick={onClose}
            type="button"
          >
            <Icon name="close" className="modal-icon-btn__icon" />
          </button>
          <button
            aria-label={isSubmitting ? 'Saving…' : initialValues ? 'Save todo' : 'Create todo'}
            className="modal-icon-btn modal-icon-btn--save"
            disabled={isSubmitting}
            form="todo-form"
            type="submit"
          >
            <Icon name={isSubmitting ? 'undo' : 'checkmark'} className="modal-icon-btn__icon" />
          </button>
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


      </form>
    </Modal>
  )
}
