import { ref, type Ref } from 'vue'
import type { ToastType, Toast, ToastResult, ToastOptions } from './ui.types'
import { createToastOptions, generateToastId } from './ui.utils'

// ===== GLOBAL STATE =====

const toasts: Ref<Toast[]> = ref([])
let toastId = 0

// ===== COMPOSABLE =====

export function useToast(): ToastResult {
  const showToast = (message: string, type: ToastType = 'info', options: ToastOptions = {}): number => {
    const toastOptions = createToastOptions(options)
    const id = generateToastId()
    const toast: Toast = {
      id,
      message,
      type,
      duration: toastOptions.duration!,
      visible: true
    }
    
    toasts.value.push(toast)
    
    // Auto remove after duration
    setTimeout(() => {
      removeToast(id)
    }, toastOptions.duration!)
    
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
  
  const showSuccess = (message: string, options?: ToastOptions): number => {
    return showToast(message, 'success', options)
  }
  
  const showError = (message: string, options?: ToastOptions): number => {
    return showToast(message, 'error', options)
  }
  
  const showWarning = (message: string, options?: ToastOptions): number => {
    return showToast(message, 'warning', options)
  }
  
  const showInfo = (message: string, options?: ToastOptions): number => {
    return showToast(message, 'info', options)
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
