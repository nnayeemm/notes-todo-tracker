import { useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/authContextCore'
import { Button } from '../../components/ui/Button'
import { Icon } from '../../components/ui/Icon'
import { Input } from '../../components/ui/Input'
import './AuthPage.css'

type AuthMode = 'login' | 'register'

interface AuthPageProps {
  mode: AuthMode
}

interface RouteState {
  from?: {
    pathname?: string
    search?: string
  }
}

export function AuthPage({ mode }: AuthPageProps) {
  const { isAuthenticated, isInitializing, login, register } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const state = location.state as RouteState | null
  const from = `${state?.from?.pathname ?? '/notes'}${state?.from?.search ?? ''}`
  const isRegister = mode === 'register'

  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isInitializing && isAuthenticated) {
    return <Navigate replace to={from} />
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      if (isRegister) {
        await register({
          email: email.trim(),
          username: username.trim(),
          password,
        })
      } else {
        await login(username.trim(), password)
      }

      navigate(from, { replace: true })
    } catch (caughtError) {
      const message =
        caughtError instanceof Error
          ? caughtError.message
          : isRegister
            ? 'Unable to create your account.'
            : 'Unable to sign in.'
      setError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-page__story" aria-label="FlowNotes">
        <div className="auth-page__brand">
          <Icon className="auth-page__brand-icon" name="note" />
          <span>FlowNotes</span>
        </div>
        <div className="auth-page__headline">
          <h1>
            Elevate your thoughts
            <span>to the next level.</span>
          </h1>
          <p>Experience a premium workspace designed for focused notes, steady tasks, and organized thinking.</p>
        </div>
        
        
      </section>

      <section className="auth-card" aria-label={isRegister ? 'Create account' : 'Login'}>
        <div className="auth-card__header">
          <h2>{isRegister ? 'Create your account' : 'Welcome back'}</h2>
          <p>{isRegister ? 'Join your workspace today.' : 'Sign in to continue your notes and tasks.'}</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <Input
            autoComplete={isRegister ? 'username' : 'username'}
            label={isRegister ? 'Username' : 'Username or email'}
            onChange={(event) => setUsername(event.target.value)}
            placeholder={isRegister ? 'Your unique handle' : 'you@example.com'}
            required
            value={username}
          />
          {isRegister ? (
            <Input
              autoComplete="email"
              label="Email address"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
              type="email"
              value={email}
            />
          ) : null}
          <Input
            autoComplete={isRegister ? 'new-password' : 'current-password'}
            hint={isRegister ? 'Minimum 8 characters with letters and numbers.' : undefined}
            label="Password"
            minLength={8}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
            required
            type="password"
            value={password}
          />

          {error ? <p className="auth-form__error">{error}</p> : null}

          <Button fullWidth isLoading={isSubmitting} type="submit">
            {isRegister ? 'Create Account' : 'Login'}
          </Button>
        </form>

        <div className="auth-card__switch">
          {isRegister ? (
            <p>
              Already have an account? <Link to="/login">Login</Link>
            </p>
          ) : (
            <p>
              New to FlowNotes? <Link to="/register">Create account</Link>
            </p>
          )}
        </div>
      </section>
    </main>
  )
}
