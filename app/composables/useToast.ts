import { computed } from 'vue'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

interface ToastState {
  message: string | null
  type: ToastType
  duration: number
}

export const useAppToast = () => {
  const toastState = useState<ToastState>('toast-state', () => ({
    message: null,
    type: 'info',
    duration: 3000,
  }))
  const timeoutId = useState<ReturnType<typeof setTimeout> | null>('toast-timeout', () => null)

  const showToast = (text: string, type: ToastType = 'info', duration: number = 3000) => {
    if (timeoutId.value) {
      clearTimeout(timeoutId.value)
    }
    toastState.value = {
      message: text,
      type,
      duration,
    }
    timeoutId.value = setTimeout(() => {
      toastState.value = {
        message: null,
        type: 'info',
        duration: 3000,
      }
      timeoutId.value = null
    }, duration)
  }

  return {
    message: computed(() => toastState.value.message),
    type: computed(() => toastState.value.type),
    duration: computed(() => toastState.value.duration),
    showToast,
  }
}
