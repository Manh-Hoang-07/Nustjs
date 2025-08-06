<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="modal-overlay">
        <div class="modal-backdrop" @click="handleBackdropClick"></div>
        <div class="modal-container" :class="modalSize">
          <div class="modal-header">
            <h3 class="modal-title">{{ title || 'Modal Title' }}</h3>
            <button type="button" class="modal-close" @click="close">
              <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <div v-if="loading" class="flex items-center justify-center py-8">
              <div class="flex flex-col items-center space-y-3">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p class="text-gray-600 text-sm">Đang tải...</p>
              </div>
            </div>
            <div v-else>
              <slot></slot>
            </div>
          </div>
          <div v-if="$slots.footer" class="modal-footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  show: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg', 'xl', 'full'].includes(value)
  },
  closeOnBackdrop: {
    type: Boolean,
    default: true
  },
  onClose: {
    type: Function,
    default: () => {}
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'close'])

// Hỗ trợ cả v-model và prop show
const isOpen = computed(() => props.modelValue || props.show)



const modalSize = computed(() => {
  switch (props.size) {
    case 'sm': return 'modal-sm'
    case 'lg': return 'modal-lg'
    case 'xl': return 'modal-xl'
    case 'full': return 'modal-full'
    default: return 'modal-md'
  }
})

function close() {
  emit('update:modelValue', false)
  emit('close')
  if (typeof props.onClose === 'function') {
    props.onClose()
  }
}

function handleBackdropClick() {
  if (props.closeOnBackdrop) {
    close()
  }
}

function handleEscKey(event) {
  if (event.key === 'Escape' && isOpen.value) {
    close()
  }
}

// Add event listener for Escape key
onMounted(() => {
  document.addEventListener('keydown', handleEscKey)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleEscKey)
})

// Modal scroll management
let scrollPosition = 0
let isModalOpen = false

// Prevent body scroll when modal is open
watch(isOpen, (newValue) => {
  if (newValue && !isModalOpen) {
    // Lưu vị trí scroll hiện tại
    scrollPosition = window.pageYOffset || document.documentElement.scrollTop
    document.body.classList.add('modal-open')
    isModalOpen = true
  } else if (!newValue && isModalOpen) {
    // Restore scroll position
    document.body.classList.remove('modal-open')
    isModalOpen = false
    // Đảm bảo scroll được restore sau khi class được remove
    nextTick(() => {
      window.scrollTo(0, scrollPosition)
    })
  }
}, { immediate: true })

// Cleanup khi component unmount
onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleEscKey)
  if (isModalOpen) {
    document.body.classList.remove('modal-open')
    isModalOpen = false
  }
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: -1;
}

.modal-container {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  max-height: calc(100vh - 2rem);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 10000;
}

.modal-sm {
  width: 100%;
  max-width: 24rem;
}

.modal-md {
  width: 100%;
  max-width: 32rem;
}

.modal-lg {
  width: 100%;
  max-width: 48rem;
}

.modal-xl {
  width: 100%;
  max-width: 64rem;
}

.modal-full {
  width: calc(100% - 2rem);
  height: calc(100vh - 2rem);
  max-width: none;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.modal-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1a202c;
}

.modal-close {
  color: #718096;
  background: none;
  border: none;
  cursor: pointer;
}

.modal-close:hover {
  color: #4a5568;
}

.modal-body {
  padding: 1rem;
  overflow-y: auto;
  flex: 1;
}

.modal-footer {
  padding: 1rem;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: flex-end;
}

/* Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

/* Global style for body when modal is open */
:global(body.modal-open) {
  overflow: hidden;
}
</style> 
