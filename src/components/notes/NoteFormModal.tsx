import { useState } from 'react'
import type { Attachment, NoteDetail, NoteSummary, NoteUpsertPayload } from '../../types/api'
import { AttachmentList } from './AttachmentList'

import { ErrorMessage } from '../ui/ErrorMessage'
import { Icon } from '../ui/Icon'
import { Input } from '../ui/Input'
import { Modal } from '../ui/Modal'
import './NoteFormModal.css'

type NoteFormSource = NoteSummary | NoteDetail | null

interface NoteFormModalProps {
  attachments?: Attachment[]
  deletingAttachmentId?: number | null
  initialValues: NoteFormSource
  isOpen: boolean
  isSubmitting: boolean
  onClose: () => void
  onDeleteAttachment?: (attachment: Attachment) => void
  onDeleteNote?: () => void
  onSubmit: (payload: NoteUpsertPayload, files: File[]) => Promise<void>
}

export function NoteFormModal({
  attachments = [],
  deletingAttachmentId = null,
  initialValues,
  isOpen,
  isSubmitting,
  onClose,
  onDeleteAttachment,
  onDeleteNote,
  onSubmit,
}: NoteFormModalProps) {
  const [title, setTitle] = useState(initialValues?.title ?? '')
  const [content, setContent] = useState(initialValues?.content ?? '')
  const [category, setCategory] = useState(initialValues?.category ?? '')
  const [isPinned, setIsPinned] = useState(initialValues?.is_pinned ?? false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [formError, setFormError] = useState('')

  const hasExistingNote = Boolean(initialValues)

  const handleFileSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextFiles = Array.from(event.target.files ?? [])

    if (nextFiles.length === 0) {
      return
    }

    setFormError('')
    setSelectedFiles((currentFiles) => [...currentFiles, ...nextFiles])
    event.target.value = ''
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!title.trim() || !content.trim()) {
      setFormError('Title and content are both required.')
      return
    }

    try {
      setFormError('')

      await onSubmit(
        {
          title: title.trim(),
          content: content.trim(),
          category: category.trim() ? category.trim() : null,
          is_pinned: isPinned,
        },
        selectedFiles,
      )
    } catch (caughtError) {
      const message =
        caughtError instanceof Error ? caughtError.message : 'Unable to save the note.'
      setFormError(message)
    }
  }

  return (
    <Modal
      description={
        hasExistingNote
          ? 'Update note details, open saved files, remove old attachments, and add more before saving.'
          : 'Create a new note and add its attachments in the same step.'
      }
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
          {hasExistingNote && onDeleteNote ? (
            <button
              aria-label="Delete note"
              className="modal-icon-btn modal-icon-btn--delete"
              onClick={onDeleteNote}
              type="button"
            >
              <Icon name="delete" className="modal-icon-btn__icon" />
            </button>
          ) : null}
          <button
            aria-label={isSubmitting ? 'Saving…' : 'Save note'}
            className="modal-icon-btn modal-icon-btn--save"
            disabled={isSubmitting}
            form="note-form"
            type="submit"
          >
            <Icon name={isSubmitting ? 'undo' : 'checkmark'} className="modal-icon-btn__icon" />
          </button>
        </>
      }
      headerAction={
        <label aria-label="Pin this note" className="note-form__pin-toggle">
          <span className="note-form__pin-label">
            <Icon className="note-form__pin-icon" name="pin" />
            Pin
          </span>
          <span
            aria-checked={isPinned}
            className={`note-form__toggle-track${isPinned ? ' note-form__toggle-track--on' : ''}`}
            role="switch"
          >
            <span className="note-form__toggle-thumb" />
          </span>
          <input
            checked={isPinned}
            className="note-form__toggle-input"
            onChange={(e) => setIsPinned(e.target.checked)}
            type="checkbox"
          />
        </label>
      }
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title={hasExistingNote ? 'Edit note' : 'Add new note'}
    >
      <form className="note-form" id="note-form" onSubmit={handleSubmit}>
        {formError ? <ErrorMessage message={formError} title="Validation issue" /> : null}

        <div className="two-column">
          <Input
            label="Title"
            maxLength={255}
            onChange={(event) => {
              setFormError('')
              setTitle(event.target.value)
            }}
            placeholder="Sprint notes"
            value={title}
          />
          <Input
            label="Category"
            maxLength={100}
            onChange={(event) => {
              setFormError('')
              setCategory(event.target.value)
            }}
            placeholder="Work"
            value={category}
          />
        </div>

        <Input
          label="Content"
          onChange={(event) => {
            setFormError('')
            setContent(event.target.value)
          }}
          placeholder="Capture the full note content here..."
          textarea
          value={content}
        />

        <section className="note-form__attachments">
          <div className="note-form__attachments-copy">
            <h3 className="note-form__attachments-title">
              {hasExistingNote ? 'Attachments' : 'Add attachments'}
            </h3>
            <p className="note-form__attachments-text">
              {hasExistingNote
                ? 'Open files here, delete the ones you do not need, and upload more before saving.'
                : 'Pick files now and they will upload right after the note is created.'}
            </p>
          </div>

          <label className="note-form__file-picker">
            <span className="field__label">{hasExistingNote ? 'Upload more files' : 'Add files'}</span>
            <input multiple onChange={handleFileSelection} type="file" />
          </label>

          {selectedFiles.length > 0 ? (
            <div className="note-form__file-list">
              {selectedFiles.map((file, index) => (
                <div key={`${file.name}-${file.size}-${index}`} className="note-form__file-item">
                  <span className="note-form__file-name">{file.name}</span>
                  <button
                    className="note-form__file-remove"
                    onClick={() => {
                      setSelectedFiles((currentFiles) =>
                        currentFiles.filter((_, fileIndex) => fileIndex !== index),
                      )
                    }}
                    type="button"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="note-form__attachments-empty">
              {hasExistingNote ? 'No new files selected yet.' : 'No files selected yet.'}
            </p>
          )}

          {hasExistingNote ? (
            attachments.length > 0 ? (
              <AttachmentList
                attachments={attachments}
                canDelete={Boolean(onDeleteAttachment)}
                deletingAttachmentId={deletingAttachmentId}
                onDelete={onDeleteAttachment}
                showOpenLink
              />
            ) : (
              <div className="note-form__attachments-empty-card">No attachments added yet.</div>
            )
          ) : null}
        </section>
      </form>
    </Modal>
  )
}
