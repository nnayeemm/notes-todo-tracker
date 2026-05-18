import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { AttachmentList } from '../components/notes/AttachmentList'
import { NoteFormModal } from '../components/notes/NoteFormModal'
import { Button } from '../components/ui/Button'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { EmptyState } from '../components/ui/EmptyState'
import { ErrorMessage } from '../components/ui/ErrorMessage'
import { Icon } from '../components/ui/Icon'
import { LoadingIndicator } from '../components/ui/LoadingIndicator'
import { Toast } from '../components/ui/Toast'
import { useToast } from '../hooks/useToast'
import { attachmentsService } from '../services/attachmentsService'
import { notesService } from '../services/notesService'
import type {
  Attachment,
  NoteDetail,
  NoteUpsertPayload,
} from '../types/api'
import { formatDateTime } from '../utils/format'
import './NoteDetailsPage.css'

type DeleteTarget =
  | { kind: 'note' }
  | { attachment: Attachment; kind: 'attachment' }
  | null

export function NoteDetailsPage() {
  const navigate = useNavigate()
  const { noteId } = useParams()
  const [searchParams] = useSearchParams()
  const parsedNoteId = Number(noteId)
  const isValidNoteId = Number.isInteger(parsedNoteId)
  const returnTo = searchParams.get('from') === 'todos' ? '/todos' : '/notes'
  const backLabel = returnTo === '/todos' ? 'Back to tasks' : 'Back to notes'
  const { clearToast, showToast, toast } = useToast()
  const [note, setNote] = useState<NoteDetail | null>(null)
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const loadNote = async () => {
    try {
      setError('')
      const [nextNote, nextAttachments] = await Promise.all([
        notesService.getNote(parsedNoteId),
        attachmentsService.getAttachments(parsedNoteId),
      ])
      setNote(nextNote)
      setAttachments(nextAttachments)
    } catch (caughtError) {
      const message =
        caughtError instanceof Error ? caughtError.message : 'Unable to load the note details.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!isValidNoteId) {
      return
    }

    let isMounted = true

    const run = async () => {
      try {
        const [nextNote, nextAttachments] = await Promise.all([
          notesService.getNote(parsedNoteId),
          attachmentsService.getAttachments(parsedNoteId),
        ])

        if (!isMounted) {
          return
        }

        setError('')
        setNote(nextNote)
        setAttachments(nextAttachments)
      } catch (caughtError) {
        if (!isMounted) {
          return
        }

        const message =
          caughtError instanceof Error ? caughtError.message : 'Unable to load the note details.'
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
  }, [isValidNoteId, parsedNoteId])

  const handleUpdateNote = async (payload: NoteUpsertPayload, files: File[]) => {
    if (!note) {
      return
    }

    try {
      setIsSaving(true)
      await notesService.updateNote(note.id, payload)
      const failedUploads: string[] = []

      for (const file of files) {
        try {
          await attachmentsService.uploadAttachment(note.id, file)
        } catch {
          failedUploads.push(file.name)
        }
      }

      if (failedUploads.length > 0) {
        showToast({
          message: `Note updated, but these attachments failed to upload: ${failedUploads.join(', ')}.`,
          type: 'error',
        })
      } else {
        showToast({
          message:
            files.length > 0
              ? 'Note updated and attachments uploaded successfully.'
              : 'Note updated successfully.',
          type: 'success',
        })
      }
      setIsFormOpen(false)
      setLoading(true)
      await loadNote()
    } catch (caughtError) {
      const message =
        caughtError instanceof Error ? caughtError.message : 'Unable to update the note.'
      showToast({ message, type: 'error' })
      throw caughtError instanceof Error ? caughtError : new Error(message)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!note || !deleteTarget) {
      return
    }

    try {
      setIsDeleting(true)

      if (deleteTarget.kind === 'note') {
        await notesService.deleteNote(note.id)
        showToast({ message: 'Note deleted successfully.', type: 'success' })
        navigate(returnTo)
        return
      }

      await attachmentsService.deleteAttachment(deleteTarget.attachment.id)
      showToast({ message: 'Attachment deleted successfully.', type: 'success' })
      setDeleteTarget(null)
      setLoading(true)
      await loadNote()
    } catch (caughtError) {
      const message =
        caughtError instanceof Error ? caughtError.message : 'Unable to delete the selected item.'
      showToast({ message, type: 'error' })
    } finally {
      setIsDeleting(false)
    }
  }

  if (!isValidNoteId) {
    return (
      <div className="page">
        <ErrorMessage message="Invalid note ID." />
      </div>
    )
  }

  if (loading) {
    return <LoadingIndicator label="Loading note details..." />
  }

  if (error || !note) {
    return (
      <div className="page">
        <ErrorMessage
          action={<Button onClick={() => void loadNote()}>Try again</Button>}
          message={error || 'This note could not be found.'}
        />
      </div>
    )
  }

  return (
    <div className="page note-details-page">
      <aside className="note-details-page__rail">
        <Link className="note-details__back-link" to={returnTo}>
          <Icon className="note-details__back-icon" name="arrowBack" />
          {backLabel}
        </Link>

        <div className="note-details-page__rail-card surface surface--padded">
          <p className="page__eyebrow">Selected note</p>
          <h2 className="note-details-page__rail-title">{note.title}</h2>
          <p className="note-details-page__rail-copy">Note #{note.id}</p>
          <div className="meta-row">
            <span className="status-chip">{note.category ?? 'General'}</span>
            {note.is_pinned ? <span className="status-chip status-chip--warning">Pinned</span> : null}
            <span className="status-chip status-chip--success">{attachments.length} files</span>
          </div>
        </div>
      </aside>

      <section className="note-details-page__sheet surface">
        <div className="note-details-page__sheet-header">
          <div className="note-details-page__sheet-header-top">
            <p className="page__eyebrow">Note details</p>
            <Button size="sm" variant="secondary" onClick={() => setIsFormOpen(true)}>
              <Icon className="button__icon" name="edit" />
              Edit note
            </Button>
          </div>
          <span className="note-details-page__updated-badge">
            Updated {formatDateTime(note.updated_at)}
          </span>
          <h1 className="page__title">{note.title}</h1>
          <p className="page__subtitle">Review note content and open the files already linked to this note.</p>
        </div>

        <div className="note-details-page__sheet-body">
          <section className="note-details__summary">
            <div className="note-details__meta-grid">
              <div>
                <p className="note-details__label">Category</p>
                <p className="note-details__value">{note.category ?? 'Uncategorized'}</p>
              </div>
              <div>
                <p className="note-details__label">Pinned</p>
                <p className="note-details__value">{note.is_pinned ? 'Yes' : 'No'}</p>
              </div>
              <div>
                <p className="note-details__label">Created</p>
                <p className="note-details__value">{formatDateTime(note.created_at)}</p>
              </div>
              <div>
                <p className="note-details__label">Attachments</p>
                <p className="note-details__value">{attachments.length}</p>
              </div>
            </div>

            <div className="note-details__content">
              <h2 className="note-details__content-title">Content</h2>
              <p className="note-details__content-body">{note.content}</p>
            </div>
          </section>

          <div className="note-details__attachments">
            {attachments.length === 0 ? (
              <EmptyState
                description="This note does not have any uploaded files yet."
                title="No attachments yet"
              />
            ) : (
              <AttachmentList
                attachments={attachments}
                canDelete={false}
                deletingAttachmentId={
                  deleteTarget?.kind === 'attachment' && isDeleting
                    ? deleteTarget.attachment.id
                    : null
                }
                showOpenLink
              />
            )}
          </div>
        </div>
      </section>

      {isFormOpen ? (
        <NoteFormModal
          key={note.id}
          attachments={attachments}
          deletingAttachmentId={
            deleteTarget?.kind === 'attachment' && isDeleting ? deleteTarget.attachment.id : null
          }
          initialValues={note}
          isOpen={isFormOpen}
          isSubmitting={isSaving}
          onClose={() => setIsFormOpen(false)}
          onDeleteAttachment={(attachment) => setDeleteTarget({ attachment, kind: 'attachment' })}
          onDeleteNote={() => {
            setIsFormOpen(false)
            setDeleteTarget({ kind: 'note' })
          }}
          onSubmit={handleUpdateNote}
        />
      ) : null}

      <ConfirmDialog
        confirmLabel={deleteTarget?.kind === 'note' ? 'Delete note' : 'Delete attachment'}
        description={
          deleteTarget?.kind === 'note'
            ? `Delete "${note.title}" from the backend.`
            : deleteTarget?.kind === 'attachment'
              ? `Delete "${deleteTarget.attachment.original_name}" from this note.`
              : ''
        }
        isLoading={isDeleting}
        isOpen={Boolean(deleteTarget)}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => void handleDelete()}
        title={deleteTarget?.kind === 'note' ? 'Delete note?' : 'Delete attachment?'}
      />

      <Toast onClose={clearToast} toast={toast} />
    </div>
  )
}
