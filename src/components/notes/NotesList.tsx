import type { NoteSummary } from '../../types/api'
import { NoteCard } from './NoteCard'
import './NotesList.css'

interface NotesListProps {
  notes: NoteSummary[]
  onCreate: () => void
  onDelete: (note: NoteSummary) => void
  onEdit: (note: NoteSummary) => void
  onOpen: (noteId: number) => void
  onTogglePin: (note: NoteSummary) => void
}

export function NotesList({ notes, onCreate, onDelete, onEdit, onOpen, onTogglePin }: NotesListProps) {
  return (
    <div className="notes-list">
      {notes.map((note) => (
        <NoteCard
          key={note.id}
          note={note}
          onDelete={onDelete}
          onEdit={onEdit}
          onOpen={onOpen}
          onTogglePin={onTogglePin}
        />
      ))}

      <button className="notes-list__create" onClick={onCreate} type="button">
        <span className="notes-list__create-icon">+</span>
        <span className="notes-list__create-title">Add New Note</span>
        <span className="notes-list__create-copy">Capture a quick thought</span>
      </button>
    </div>
  )
}
