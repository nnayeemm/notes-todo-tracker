const fallbackBaseUrl =
  'https://notes-todo-tracker-backend.onrender.com'
export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ?? fallbackBaseUrl
).replace(/\/$/, '')

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

function getUrl(path: string) {
  return path.startsWith('http') ? path : `${API_BASE_URL}${path}`
}

function getErrorMessage(payload: unknown, status: number) {
  if (typeof payload === 'string' && payload.trim()) {
    return payload
  }

  if (payload && typeof payload === 'object') {
    if ('message' in payload && typeof payload.message === 'string') {
      return payload.message
    }

    if ('detail' in payload) {
      const detail = payload.detail

      if (typeof detail === 'string') {
        return detail
      }

      if (Array.isArray(detail) && detail.length > 0) {
        const validationMessages = detail.flatMap((item) => {
          if (!item || typeof item !== 'object' || !('msg' in item) || typeof item.msg !== 'string') {
            return []
          }

          const location =
            'loc' in item && Array.isArray(item.loc)
              ? item.loc
                  .filter((part: unknown): part is string => typeof part === 'string' && part !== 'body')
                  .join('.')
              : ''

          return location ? `${location}: ${item.msg}` : item.msg
        })

        if (validationMessages.length > 0) {
          return validationMessages.join('; ')
        }
      }
    }
  }

  return `Request failed with status ${status}.`
}

export async function request<T>(path: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers)
  const isFormData = init.body instanceof FormData

  if (!isFormData && init.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  const response = await fetch(getUrl(path), {
    ...init,
    headers,
  })

  const contentType = response.headers.get('content-type') ?? ''
  const payload: unknown = contentType.includes('application/json')
    ? await response.json()
    : await response.text()

  if (!response.ok) {
    throw new ApiError(response.status, getErrorMessage(payload, response.status))
  }

  return payload as T
}

export function resolveApiUrl(path: string) {
  return getUrl(path)
}
