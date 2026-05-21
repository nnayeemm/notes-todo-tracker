const ACCESS_TOKEN_KEY = 'notes_frontend_access_token'

export const AUTH_UNAUTHORIZED_EVENT = 'auth:unauthorized'

export function getStoredAccessToken() {
  return sessionStorage.getItem(ACCESS_TOKEN_KEY)
}

export function setStoredAccessToken(token: string) {
  sessionStorage.setItem(ACCESS_TOKEN_KEY, token)
}

export function clearStoredAccessToken() {
  sessionStorage.removeItem(ACCESS_TOKEN_KEY)
}

export function notifyUnauthorized() {
  window.dispatchEvent(new Event(AUTH_UNAUTHORIZED_EVENT))
}
