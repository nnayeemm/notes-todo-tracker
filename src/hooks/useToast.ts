import { useEffect, useState } from 'react'
import type { ToastState } from '../types/api'

const TOAST_TIMEOUT = 3200

export function useToast() {
  const [toast, setToast] = useState<ToastState | null>(null)

  useEffect(() => {
    if (!toast) {
      return undefined
    }

    const timeoutId = window.setTimeout(() => {
      setToast(null)
    }, TOAST_TIMEOUT)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [toast])

  return {
    toast,
    showToast(nextToast: ToastState) {
      setToast(nextToast)
    },
    clearToast() {
      setToast(null)
    },
  }
}
