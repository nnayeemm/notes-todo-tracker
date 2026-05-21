import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from '../auth/AuthContext'
import { ProtectedRoute } from '../auth/ProtectedRoute'
import { AppShell } from '../components/layout/AppShell'
import { NoteDetailsPage } from '../pages/NoteDetailsPage'
import { NotesPage } from '../pages/NotesPage'
import { AuthPage } from '../pages/auth/AuthPage'
import { TodosPage } from '../pages/TodosPage'

export function AppRouter() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<AuthPage mode="login" />} />
          <Route path="/register" element={<AuthPage mode="register" />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<AppShell />}>
              <Route index element={<Navigate replace to="/notes" />} />
              <Route path="/notes" element={<NotesPage />} />
              <Route path="/notes/:noteId" element={<NoteDetailsPage />} />
              <Route path="/todos" element={<TodosPage />} />
              <Route path="*" element={<Navigate replace to="/notes" />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
