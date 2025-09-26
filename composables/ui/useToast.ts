import { ref, type Ref } from 'vue'

// ===== TYPES =====

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface Toast {
  id: number
  message: string
  type: ToastType
  duration: number
  visible: boolean
}

interface ToastResult {
  toasts: Ref<Toast[]>
  showToast: (message: string, type?: ToastType, duration?: number) => number
  showSuccess: (message: string, duration?: number) => number
  showError: (message: string, duration?: number) => number
  showWarning: (message: string, duration?: number) => number
  showInfo: (message: string, duration?: number) => number
  removeToast: (id: number) => void
  clearAll: () => void
}

// ===== GLOBAL STATE =====

const toasts: Ref<Toast[]> = ref([])
let toastId = 0

// ===== COMPOSABLE =====

export function useToast(): ToastResult {
  const showToast = (message: string, type: ToastType = 'info', duration: number = 3000): number => {
    const id = ++toastId
    const toast: Toast = {
      id,
      message,
      type,
      duration,
      visible: true
    }
    
    toasts.value.push(toast)
    
    // Auto remove after duration
    setTimeout(() => {
      removeToast(id)
    }, duration)
    
    return id
  }
  
  const removeToast = (id: number): void => {
    const index = toasts.value.findIndex(toast => toast.id === id)
    if (index > -1) {
      toasts.value[index].visible = false
      setTimeout(() => {
        toasts.value.splice(index, 1)
      }, 300) // Animation duration
    }
  }
  
  const showSuccess = (message: string, duration?: number): number => {
    return showToast(message, 'success', duration)
  }
  
  const showError = (message: string, duration?: number): number => {
    return showToast(message, 'error', duration)
  }
  
  const showWarning = (message: string, duration?: number): number => {
    return showToast(message, 'warning', duration)
  }
  
  const showInfo = (message: string, duration?: number): number => {
    return showToast(message, 'info', duration)
  }
  
  const clearAll = (): void => {
    toasts.value = []
  }
  
  return {
    toasts,
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    removeToast,
    clearAll
  }
}
