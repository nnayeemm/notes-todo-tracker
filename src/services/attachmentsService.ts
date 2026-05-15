import { request } from './http'
import type { Attachment } from '../types/api'

export const attachmentsService = {
  getAttachments(noteId: number) {
    return request<Attachment[]>(`/api/notes/${noteId}/attachments`)
  },
  uploadAttachment(noteId: number, file: File) {
    const formData = new FormData()
    formData.append('file', file)

    return request<Attachment>(`/api/notes/${noteId}/attachments`, {
      method: 'POST',
      body: formData,
    })
  },
  deleteAttachment(fileId: number) {
    return request<{ message: string }>(`/api/attachments/${fileId}`, {
      method: 'DELETE',
    })
  },
}
