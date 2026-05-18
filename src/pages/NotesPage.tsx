import { useDeferredValue, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'
import { ErrorMessage } from '../components/ui/ErrorMessage'
import { Icon } from '../components/ui/Icon'
import { Input } from '../components/ui/Input'
import { LoadingIndicator } from '../components/ui/LoadingIndicator'
import { Toast } from '../components/ui/Toast'
import { NoteFormModal } from '../components/notes/NoteFormModal'
import { NotesList } from '../components/notes/NotesList'
import { useToast } from '../hooks/useToast'
import { attachmentsService } from '../services/attachmentsService'
import { notesService } from '../services/notesService'
import type { Attachment, NoteDetail, NoteSummary, NoteUpsertPayload } from '../types/api'
import './NotesPage.css'

export function NotesPage() {
  const navigate = useNavigate()
  const { clearToast, showToast, toast } = useToast()
  const [notes, setNotes] = useState<NoteSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingNote, setEditingNote] = useState<NoteDetail | null>(null)
  const [editingAttachments, setEditingAttachments] = useState<Attachment[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [noteToDelete, setNoteToDelete] = useState<NoteSummary | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [togglingPinNoteId, setTogglingPinNoteId] = useState<number | null>(null)

  const deferredSearchTerm = useDeferredValue(searchTerm)

  const loadNotes = async () => {
    try {
      setError('')
      setLoading(true)
      const nextNotes = await notesService.getNotes()
      setNotes(nextNotes)
    } catch (caughtError) {
      const message =
        caughtError instanceof Error ? caughtError.message : 'Unable to load notes.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let isMounted = true

    const run = async () => {
      if (!isMounted) {
        return
      }

      await loadNotes()
    }

    void run()

    return () => {
      isMounted = false
    }
  }, [])

  const normalizedSearch = deferredSearchTerm.trim().toLowerCase()
  const filteredNotes = normalizedSearch
    ? notes.filter((note) =>
        [note.title, note.content, note.category ?? '']
          .join(' ')
          .toLowerCase()
          .includes(normalizedSearch),
      )
    : notes

  const handleSubmit = async (payload: NoteUpsertPayload, files: File[]) => {
    try {
      setIsSubmitting(true)

      if (editingNote) {
        await notesService.updateNote(editingNote.id, payload)
        const failedUploads: string[] = []

        for (const file of files) {
          try {
            await attachmentsService.uploadAttachment(editingNote.id, file)
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
      } else {
        const createdNote = await notesService.createNote(payload)
        const failedUploads: string[] = []

        for (const file of files) {
          try {
            await attachmentsService.uploadAttachment(createdNote.id, file)
          } catch {
            failedUploads.push(file.name)
          }
        }

        if (failedUploads.length > 0) {
          showToast({
            message: `Note created, but these attachments failed to upload: ${failedUploads.join(', ')}.`,
            type: 'error',
          })
        } else {
          showToast({
            message:
              files.length > 0
                ? 'Note created and attachments uploaded successfully.'
                : 'Note created successfully.',
            type: 'success',
          })
        }
      }

      setIsFormOpen(false)
      setEditingNote(null)
      setEditingAttachments([])
      await loadNotes()
    } catch (caughtError) {
      const message =
        caughtError instanceof Error ? caughtError.message : 'Unable to save note.'
      showToast({ message, type: 'error' })
      throw caughtError instanceof Error ? caughtError : new Error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!noteToDelete) {
      return
    }

    try {
      setIsDeleting(true)
      await notesService.deleteNote(noteToDelete.id)
      showToast({ message: 'Note deleted successfully.', type: 'success' })
      setNoteToDelete(null)
      await loadNotes()
    } catch (caughtError) {
      const message =
        caughtError instanceof Error ? caughtError.message : 'Unable to delete note.'
      showToast({ message, type: 'error' })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleTogglePin = async (note: NoteSummary) => {
    try {
      setTogglingPinNoteId(note.id)
      await notesService.updateNote(note.id, {
        title: note.title,
        content: note.content,
        category: note.category,
        is_pinned: !note.is_pinned,
      })
      showToast({
        message: note.is_pinned ? 'Note unpinned.' : 'Note pinned.',
        type: 'success',
      })
      await loadNotes()
    } catch (caughtError) {
      const message =
        caughtError instanceof Error ? caughtError.message : 'Unable to pin or unpin the note.'
      showToast({ message, type: 'error' })
    } finally {
      setTogglingPinNoteId(null)
    }
  }

  return (
    <div className="page">
      <div className="page__header">
        <div className="page__heading">
          <div className="meta-row">
            <p className="page__eyebrow">Notes</p>
            <span className="page__count">{notes.length} total</span>
          </div>
          <h1 className="page__title">Notes Workspace</h1>
          <p className="page__subtitle">Capture ideas, review details, and keep attachments organized.</p>
        </div>

        <div className="page__toolbar page__toolbar--stacked page__toolbar-panel notes-page__toolbar surface surface--padded">
          <Input
            label="Search notes"
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search title, content, or category"
            value={searchTerm}
            wrapperClassName="notes-page__search"
          />
          <Button
            fullWidth
            onClick={() => {
              setEditingNote(null)
              setIsFormOpen(true)
            }}
          >
            <Icon className="button__icon" name="add" />
            Create note
          </Button>
        </div>
      </div>

      {loading ? (
        <LoadingIndicator label="Loading notes..." />
      ) : error ? (
        <ErrorMessage action={<Button onClick={() => void loadNotes()}>Try again</Button>} message={error} />
      ) : filteredNotes.length === 0 ? (
        <EmptyState
          action={
            notes.length === 0 ? (
              <Button onClick={() => setIsFormOpen(true)}>Create your first note</Button>
            ) : undefined
          }
          description={
            notes.length === 0
              ? 'Create notes, pin important ones, and open note details for attachments.'
              : 'Try a different search phrase to match the notes already fetched from the backend.'
          }
          title={notes.length === 0 ? 'No notes yet' : 'No notes match your search'}
        />
      ) : (
        <NotesList
          notes={filteredNotes}
          togglingPinId={togglingPinNoteId}
          onCreate={() => {
            setEditingNote(null)
            setEditingAttachments([])
            setIsFormOpen(true)
          }}
          onDelete={(note) => setNoteToDelete(note)}
          onEdit={async (note) => {
            try {
              setIsSubmitting(true)
              const [fullNote, nextAttachments] = await Promise.all([
                notesService.getNote(note.id),
                attachmentsService.getAttachments(note.id),
              ])
              setEditingNote(fullNote)
              setEditingAttachments(nextAttachments)
              setIsFormOpen(true)
            } catch (caughtError) {
              const message =
                caughtError instanceof Error ? caughtError.message : 'Unable to load the note for editing.'
              showToast({ message, type: 'error' })
            } finally {
              setIsSubmitting(false)
            }
          }}
          onOpen={(noteId) => navigate(`/notes/${noteId}`)}
          onTogglePin={handleTogglePin}
        />
      )}

      {isFormOpen ? (
        <NoteFormModal
          key={editingNote?.id ?? 'new-note'}
          attachments={editingAttachments}
          initialValues={editingNote}
          isOpen={isFormOpen}
          isSubmitting={isSubmitting}
          onDeleteNote={
            editingNote
              ? () => {
                  setIsFormOpen(false)
                  setNoteToDelete(editingNote)
                }
              : undefined
          }
          onClose={() => {
            setEditingNote(null)
            setEditingAttachments([])
            setIsFormOpen(false)
          }}
          onSubmit={handleSubmit}
        />
      ) : null}

      <ConfirmDialog
        confirmLabel="Delete note"
        description={
          noteToDelete
            ? `Delete "${noteToDelete.title}" and remove it from the current notes list.`
            : ''
        }
        isLoading={isDeleting}
        isOpen={Boolean(noteToDelete)}
        onCancel={() => setNoteToDelete(null)}
        onConfirm={() => void handleDelete()}
        title="Delete note?"
      />

      <Toast onClose={clearToast} toast={toast} />
    </div>
  )
}
