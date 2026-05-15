import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from '../components/layout/AppShell'
import { NoteDetailsPage } from '../pages/NoteDetailsPage'
import { NotesPage } from '../pages/NotesPage'
import { TodosPage } from '../pages/TodosPage'

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<Navigate replace to="/notes" />} />
          <Route path="/notes" element={<NotesPage />} />
          <Route path="/notes/:noteId" element={<NoteDetailsPage />} />
          <Route path="/todos" element={<TodosPage />} />
          <Route path="*" element={<Navigate replace to="/notes" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
