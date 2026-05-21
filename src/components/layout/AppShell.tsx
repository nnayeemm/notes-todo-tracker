import { useEffect, useRef, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../auth/authContextCore'
import { Icon } from '../ui/Icon'
import './AppShell.css'

const navItems = [
  { to: '/notes', label: 'Notes', icon: 'note' as const },
  { to: '/todos', label: 'Tasks', icon: 'todo' as const },
]

export function AppShell() {
  const location = useLocation()
  const { logout, user } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const sidebarRef = useRef<HTMLElement>(null)
  const burgerRef = useRef<HTMLButtonElement>(null)

  const activeView = location.pathname.startsWith('/todos') ? 'Tasks' : 'Notes'
  const activeCopy =
    activeView === 'Tasks'
      ? 'Filter tasks, toggle progress, and jump straight into any linked note.'
      : 'Create notes, pin key ideas, and open note details without leaving the workspace.'

  // Body scroll lock
  useEffect(() => {
    document.body.classList.toggle('body--no-scroll', sidebarOpen)
    return () => document.body.classList.remove('body--no-scroll')
  }, [sidebarOpen])

  // Escape key to close
  useEffect(() => {
    if (!sidebarOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSidebarOpen(false)
        burgerRef.current?.focus()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [sidebarOpen])

  // Focus first focusable element in sidebar when it opens
  useEffect(() => {
    if (!sidebarOpen) return
    const firstFocusable = sidebarRef.current?.querySelector<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    firstFocusable?.focus()
  }, [sidebarOpen])

  const close = () => {
    setSidebarOpen(false)
    burgerRef.current?.focus()
  }

  return (
    <div className="app-shell">
      {/* Mobile header with user info */}
      <header className="app-shell__mobile-header">
        <button
          ref={burgerRef}
          aria-controls="app-sidebar"
          aria-expanded={sidebarOpen}
          aria-label={sidebarOpen ? 'Close navigation menu' : 'Open navigation menu'}
          className={`app-shell__burger${sidebarOpen ? ' app-shell__burger--open' : ''}`}
          onClick={() => setSidebarOpen((v) => !v)}
          type="button"
        >
          <span className="app-shell__burger-bar" />
          <span className="app-shell__burger-bar" />
          <span className="app-shell__burger-bar" />
        </button>

        <div className="app-shell__mobile-user">
          <div className="app-shell__avatar" aria-hidden="true">
            {(user?.username || user?.email || 'U').slice(0, 1).toUpperCase()}
          </div>
          <div className="app-shell__account-copy">
            <p className="app-shell__account-name">{user?.username ?? 'Signed in'}</p>
            <p className="app-shell__account-email">{user?.email ?? 'Session active'}</p>
          </div>
        </div>

        <button className="app-shell__mobile-logout" onClick={logout} type="button" title="Logout">
          <Icon className="app-shell__logout-icon" name="logout" />
        </button>
      </header>

      {/* Overlay — mobile only */}
      {sidebarOpen && (
        <div
          aria-hidden="true"
          className="app-shell__overlay"
          onClick={close}
        />
      )}

      <aside
        ref={sidebarRef}
        id="app-sidebar"
        className={`app-shell__sidebar${sidebarOpen ? ' app-shell__sidebar--open' : ''}`}
        aria-label="Main navigation"
      >
        {/* Mobile-only drawer header with close button */}
        <div className="app-shell__drawer-header">
          <span className="app-shell__drawer-label">Menu</span>
          <button
            aria-label="Close sidebar"
            className="app-shell__drawer-close"
            onClick={close}
            type="button"
          >
            <Icon className="app-shell__drawer-close-icon" name="close" />
          </button>
        </div>

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
              onClick={() => setSidebarOpen(false)}
              to={item.to}
            >
              <Icon className="app-shell__nav-icon" name={item.icon} />
              <span className="app-shell__nav-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="app-shell__footer">
          <div className="app-shell__account">
            <div className="app-shell__avatar" aria-hidden="true">
              {(user?.username || user?.email || 'U').slice(0, 1).toUpperCase()}
            </div>
            <div className="app-shell__account-copy">
              <p className="app-shell__account-name">{user?.username ?? 'Signed in'}</p>
              <p className="app-shell__account-email">{user?.email ?? 'Session active'}</p>
            </div>
          </div>
          <button className="app-shell__logout" onClick={logout} type="button">
            <Icon className="app-shell__logout-icon" name="logout" />
            <span>Logout</span>
          </button>
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
