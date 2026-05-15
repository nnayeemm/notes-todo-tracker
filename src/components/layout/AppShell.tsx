import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { Icon } from '../ui/Icon'
import './AppShell.css'

const navItems = [
  { to: '/notes', label: 'Notes', icon: 'note' as const },
  { to: '/todos', label: 'Tasks', icon: 'todo' as const },
]

export function AppShell() {
  const location = useLocation()
  const activeView = location.pathname.startsWith('/todos') ? 'Tasks' : 'Notes'
  const activeCopy =
    activeView === 'Tasks'
      ? 'Filter tasks, toggle progress, and jump straight into any linked note.'
      : 'Create notes, pin key ideas, and open note details without leaving the workspace.'

  return (
    <div className="app-shell">
      <aside className="app-shell__sidebar">
        <div className="app-shell__brand">
          <p className="app-shell__kicker">Productivity</p>
          <h1 className="app-shell__title">Personal Workspace</h1>
          <p className="app-shell__copy">Review notes, keep todos moving, and manage attachments in one place.</p>
        </div>

        <nav className="app-shell__nav" aria-label="Primary navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              className={({ isActive }) =>
                isActive ? 'app-shell__nav-link app-shell__nav-link--active' : 'app-shell__nav-link'
              }
              to={item.to}
            >
              <Icon className="app-shell__nav-icon" name={item.icon} />
              <span className="app-shell__nav-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="app-shell__footer">
          <div className="app-shell__footer-card">
            <p className="app-shell__footer-label">Active view</p>
            <p className="app-shell__footer-value">{activeView}</p>
            <p className="app-shell__footer-copy">{activeCopy}</p>
          </div>
        </div>
      </aside>

      <main className="app-shell__content">
        <Outlet />
      </main>
    </div>
  )
}
