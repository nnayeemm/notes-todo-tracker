import { request } from './http'
import type { NoteDetail, NoteSummary, NoteUpsertPayload } from '../types/api'

export const notesService = {
  getNotes() {
    return request<NoteSummary[]>('/api/notes')
  },
  getNote(noteId: number) {
    return request<NoteDetail>(`/api/notes/${noteId}`)
  },
  createNote(payload: NoteUpsertPayload) {
    return request<NoteDetail>('/api/notes', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },
  updateNote(noteId: number, payload: NoteUpsertPayload) {
    return request<NoteDetail>(`/api/notes/${noteId}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    })
  },
  deleteNote(noteId: number) {
    return request<{ message: string }>(`/api/notes/${noteId}`, {
      method: 'DELETE',
    })
  },
}
