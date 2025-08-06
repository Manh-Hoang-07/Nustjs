import { ref, computed, watch } from 'vue'

/**
 * Composable để quản lý modal với các tính năng nâng cao
 * @param {Object} options - Các tùy chọn
 * @param {boolean} options.initialState - Trạng thái ban đầu
 * @param {boolean} options.closeOnEscape - Đóng khi nhấn Escape
 * @param {boolean} options.closeOnOverlay - Đóng khi click overlay
 * @param {Function} options.onOpen - Callback khi mở modal
 * @param {Function} options.onClose - Callback khi đóng modal
 * @param {Function} options.beforeClose - Callback trước khi đóng (có thể return false để cancel)
 * @returns {Object} - Các state và methods cho modal
 */
export default function useModal(options = {}) {
  const {
    initialState = false,
    closeOnEscape = true,
    closeOnOverlay = true,
    onOpen = null,
    onClose = null,
    beforeClose = null
  } = options

  // State
  const isOpen = ref(initialState)
  const isLoading = ref(false)
  const data = ref(null)

  // Computed
  const isClosed = computed(() => !isOpen.value)

  // Methods
  const open = (modalData = null) => {
    if (modalData !== null) {
      data.value = modalData
    }
    isOpen.value = true
    
    if (onOpen) {
      onOpen(data.value)
    }
  }

  const close = async () => {
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

  const toggle = () => {
    if (isOpen.value) {
      close()
    } else {
      open()
    }
  }

  const setLoading = (loading) => {
    isLoading.value = loading
  }

  const setData = (newData) => {
    data.value = newData
  }

  const reset = () => {
    isOpen.value = false
    isLoading.value = false
    data.value = null
  }

  // Keyboard event handler
  const handleKeydown = (event) => {
    if (closeOnEscape && event.key === 'Escape' && isOpen.value) {
      close()
    }
  }

  // Overlay click handler
  const handleOverlayClick = (event) => {
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