export type Priority = 'low' | 'medium' | 'high'

export interface ApiMessage {
  message: string
}

export interface Attachment {
  id: number
  note_id: number
  original_name: string
  stored_name: string
  file_path: string
  file_url: string
  content_type: string | null
  file_size: number
  created_at: string
}

export interface NoteSummary {
  id: number
  title: string
  content: string
  category: string | null
  is_pinned: boolean
  created_at: string
  updated_at: string
  attachment_count: number
}

export interface NoteDetail extends NoteSummary {
  attachments: Attachment[]
}

export interface NoteUpsertPayload {
  title: string
  content: string
  category: string | null
  is_pinned: boolean
}

export interface Todo {
  id: number
  title: string
  description: string | null
  priority: Priority
  due_date: string | null
  note_id: number | null
  is_completed: boolean
  created_at: string
  updated_at: string
}

export interface TodoCreatePayload {
  title: string
  description: string | null
  priority: Priority
  due_date: string | null
  note_id: number | null
}

export interface TodoUpdatePayload {
  title?: string | null
  description?: string | null
  priority?: Priority | null
  due_date?: string | null
  note_id?: number | null
  is_completed?: boolean | null
}

export interface ToastState {
  type: 'success' | 'error'
  message: string
}
