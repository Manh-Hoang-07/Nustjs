import { ref, computed, watch, type Ref, type ComputedRef } from 'vue'

// ===== TYPES =====

interface ModalOptions {
  initialState?: boolean
  closeOnEscape?: boolean
  closeOnOverlay?: boolean
  onOpen?: (data: any) => void
  onClose?: (data: any) => void
  beforeClose?: (data: any) => Promise<boolean> | boolean
}

interface ModalResult {
  // State
  isOpen: Ref<boolean>
  isLoading: Ref<boolean>
  data: Ref<any>
  
  // Computed
  isClosed: ComputedRef<boolean>
  
  // Methods
  open: (modalData?: any) => void
  close: () => Promise<boolean>
  toggle: () => void
  setLoading: (loading: boolean) => void
  setData: (newData: any) => void
  reset: () => void
  handleOverlayClick: (event: Event) => void
}

// ===== COMPOSABLE =====

/**
 * Composable để quản lý modal với các tính năng nâng cao
 */
export default function useModal(options: ModalOptions = {}): ModalResult {
  const {
    initialState = false,
    closeOnEscape = true,
    closeOnOverlay = true,
    onOpen = null,
    onClose = null,
    beforeClose = null
  } = options

  // State
  const isOpen: Ref<boolean> = ref(initialState)
  const isLoading: Ref<boolean> = ref(false)
  const data: Ref<any> = ref(null)

  // Computed
  const isClosed: ComputedRef<boolean> = computed(() => !isOpen.value)

  // Methods
  const open = (modalData: any = null): void => {
    if (modalData !== null) {
      data.value = modalData
    }
    isOpen.value = true
    
    if (onOpen) {
      onOpen(data.value)
    }
  }

  const close = async (): Promise<boolean> => {
    // Check beforeClose callback
    if (beforeClose) {
      const shouldClose = await beforeClose(data.value)
      if (shouldClose === false) {
        return false
      }
    }

    isOpen.value = false
    
    if (onClose) {
      onClose(data.value)
    }

    // Clear data after closing
    setTimeout(() => {
      data.value = null
    }, 300) // Wait for animation

    return true
  }

  const toggle = (): void => {
    if (isOpen.value) {
      close()
    } else {
      open()
    }
  }

  const setLoading = (loading: boolean): void => {
    isLoading.value = loading
  }

  const setData = (newData: any): void => {
    data.value = newData
  }

  const reset = (): void => {
    isOpen.value = false
    isLoading.value = false
    data.value = null
  }

  // Keyboard event handler
  const handleKeydown = (event: KeyboardEvent): void => {
    if (closeOnEscape && event.key === 'Escape' && isOpen.value) {
      close()
    }
  }

  // Overlay click handler
  const handleOverlayClick = (event: Event): void => {
    if (closeOnOverlay && event.target === event.currentTarget) {
      close()
    }
  }

  // Watch for open state changes
  watch(isOpen, (newValue) => {
    if (newValue) {
      // Add event listeners when modal opens
      if (closeOnEscape) {
        document.addEventListener('keydown', handleKeydown)
      }
      // Prevent body scroll
      document.body.style.overflow = 'hidden'
    } else {
      // Remove event listeners when modal closes
      if (closeOnEscape) {
        document.removeEventListener('keydown', handleKeydown)
      }
      // Restore body scroll
      document.body.style.overflow = ''
    }
  })

  return {
    // State
    isOpen,
    isLoading,
    data,
    
    // Computed
    isClosed,
    
    // Methods
    open,
    close,
    toggle,
    setLoading,
    setData,
    reset,
    handleOverlayClick
  }
}
