<template>
  <div class="ckeditor-summary">
    <div v-if="!isMounted" class="loading-editor">
      <div class="loading-spinner"></div>
      <p>Đang tải trình soạn thảo...</p>
    </div>
    <div v-else class="editor-wrapper">
      <div ref="editorContainer" class="editor-container"></div>
    </div>
    <div v-if="error" class="error-message">{{ error }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'

// Props
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Nhập tóm tắt bài viết...'
  },
  height: {
    type: String,
    default: '200px'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  readonly: {
    type: Boolean,
    default: false
  },
  uploadUrl: {
    type: String,
    default: '/api/upload/image'
  },
  maxFileSize: {
    type: Number,
    default: 5 * 1024 * 1024 // 5MB
  },
  allowedImageTypes: {
    type: Array,
    default: () => ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  }
})

// Emits
const emit = defineEmits(['update:modelValue', 'ready', 'change', 'focus', 'blur', 'error'])

// Reactive state
const editorContainer = ref(null)
const editor = ref(null)
const error = ref('')
const isMounted = ref(false)
const isInitialized = ref(false)

// Initialize editor
const initEditor = async () => {
  try {
    if (!editorContainer.value) {
      console.log('Editor container not available')
      return
    }

    console.log('Starting CKEditor initialization...')
    
    // Dynamic import CKEditor Classic
    const CKEditor = await import('@ckeditor/ckeditor5-build-classic')
    const ClassicEditor = CKEditor.default

    if (!ClassicEditor) {
      throw new Error('ClassicEditor is undefined')
    }

    console.log('Creating editor instance...')
    
    // Create a completely new DOM element outside Vue
    const editorElement = document.createElement('div')
    editorElement.style.height = props.height
    editorElement.style.minHeight = props.height
    editorElement.style.width = '100%'
    editorElement.style.border = 'none'
    editorElement.style.outline = 'none'
    
    // Clear the container and append the new element
    editorContainer.value.innerHTML = ''
    editorContainer.value.appendChild(editorElement)
    
    // Create editor instance with minimal config
    const editorInstance = await ClassicEditor.create(editorElement, {
      placeholder: props.placeholder,
      toolbar: [
        'heading', '|',
        'bold', 'italic', 'underline', '|',
        'bulletedList', 'numberedList', '|',
        'link', '|',
        'imageUpload', '|',
        'undo', 'redo'
      ]
    })

    // Store editor instance
    editor.value = editorInstance

    // Configure image upload
    const fileRepository = editorInstance.plugins.get('FileRepository')
    if (fileRepository) {
      fileRepository.createUploadAdapter = (loader) => {
        return new ImageUploadAdapter(loader, props.uploadUrl, props.maxFileSize, props.allowedImageTypes)
      }
    }

    // Set initial content immediately after creation
    if (props.modelValue) {
      editorInstance.setData(props.modelValue)
    }

    // Set read-only state
    if (props.disabled || props.readonly) {
      editorInstance.enableReadOnlyMode('readonly')
    }

    // Event listeners - use safer approach
    const handleDataChange = () => {
      try {
        const data = editorInstance.getData()
        emit('update:modelValue', data)
        emit('change', data)
      } catch (err) {
        console.warn('Error in data change handler:', err)
      }
    }

    const handleFocus = (event) => {
      try {
        emit('focus', event)
      } catch (err) {
        console.warn('Error in focus handler:', err)
      }
    }

    const handleBlur = (event) => {
      try {
        emit('blur', event)
      } catch (err) {
        console.warn('Error in blur handler:', err)
      }
    }

    // Add event listeners using safer method
    try {
      editorInstance.model.document.on('change:data', handleDataChange)
      editorInstance.editing.view.document.on('focus', handleFocus)
      editorInstance.editing.view.document.on('blur', handleBlur)
    } catch (err) {
      console.warn('Error adding event listeners:', err)
      // Fallback to basic event handling
      editorInstance.model.document.on('change:data', handleDataChange)
    }

    console.log('CKEditor created successfully!')
    isInitialized.value = true
    emit('ready', editorInstance)

  } catch (err) {
    console.error('Error initializing CKEditor:', err)
    error.value = `Lỗi khởi tạo CKEditor: ${err.message || 'Unknown error'}`
    emit('error', err)
  }
}

// Image Upload Adapter
class ImageUploadAdapter {
  constructor(loader, uploadUrl, maxFileSize, allowedTypes) {
    this.loader = loader
    this.uploadUrl = uploadUrl
    this.maxFileSize = maxFileSize
    this.allowedTypes = allowedTypes
  }

  async upload() {
    const file = await this.loader.file

    // Validate file
    if (!this.validateFile(file)) {
      throw new Error('File không hợp lệ')
    }

    // Create FormData
    const formData = new FormData()
    formData.append('image', file)

    try {
      // Upload file
      const response = await fetch(this.uploadUrl, {
        method: 'POST',
        body: formData,
        headers: {
          'X-Requested-With': 'XMLHttpRequest'
        }
      })

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`)
      }

      const result = await response.json()

      if (!result.success || !result.url) {
        throw new Error(result.message || 'Upload failed')
      }

      return {
        default: result.url
      }
    } catch (error) {
      console.error('Upload error:', error)
      throw error
    }
  }

  validateFile(file) {
    // Check file size
    if (file.size > this.maxFileSize) {
      throw new Error(`File quá lớn. Kích thước tối đa: ${Math.round(this.maxFileSize / 1024 / 1024)}MB`)
    }

    // Check file type
    if (!this.allowedTypes.includes(file.type)) {
      throw new Error(`Loại file không được hỗ trợ. Chỉ chấp nhận: ${this.allowedTypes.join(', ')}`)
    }

    return true
  }

  abort() {
    // Implement abort logic if needed
  }
}

// Watch for modelValue changes
watch(() => props.modelValue, (newValue) => {
  if (editor.value && isInitialized.value) {
    try {
      const currentData = editor.value.getData()
      if (newValue !== currentData) {
        editor.value.setData(newValue || '')
      }
    } catch (err) {
      console.warn('Error updating editor content:', err)
    }
  }
})

// Watch for disabled/readonly changes
watch([() => props.disabled, () => props.readonly], () => {
  if (editor.value && isInitialized.value) {
    try {
      if (props.disabled || props.readonly) {
        editor.value.enableReadOnlyMode('readonly')
      } else {
        editor.value.disableReadOnlyMode('readonly')
      }
    } catch (err) {
      console.warn('Error updating editor readonly state:', err)
    }
  }
})

// Lifecycle
onMounted(async () => {
  // Wait for DOM to be ready
  await nextTick()
  
  // Set mounted flag
  isMounted.value = true
  
  // Wait a bit more for DOM to be fully ready
  setTimeout(async () => {
    await initEditor()
  }, 500)
})

onBeforeUnmount(() => {
  if (editor.value) {
    editor.value.destroy()
  }
})

// Expose methods
defineExpose({
  editor: () => editor.value,
  getContent: () => {
    try {
      return editor.value ? editor.value.getData() : ''
    } catch (err) {
      console.warn('Error getting editor content:', err)
      return ''
    }
  },
  setContent: (content) => {
    try {
      if (editor.value) {
        editor.value.setData(content || '')
      }
    } catch (err) {
      console.warn('Error setting editor content:', err)
    }
  },
  focus: () => {
    try {
      if (editor.value) {
        editor.value.editing.view.focus()
      }
    } catch (err) {
      console.warn('Error focusing editor:', err)
    }
  },
  insertText: (text) => {
    try {
      if (editor.value) {
        editor.value.model.change(writer => {
          const insertPosition = editor.value.model.document.selection.getFirstPosition()
          writer.insertText(text, insertPosition)
        })
      }
    } catch (err) {
      console.warn('Error inserting text:', err)
    }
  },
  isReady: () => isInitialized.value
})
</script>

<style scoped>
.ckeditor-summary {
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  overflow: hidden;
  background: white;
}

.editor-wrapper {
  position: relative;
}

.editor-container {
  min-height: v-bind(height);
  max-height: 400px;
  overflow-y: auto;
}

.loading-editor {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: v-bind(height);
  padding: 2rem;
  background-color: #f9fafb;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
}

.loading-spinner {
  width: 2rem;
  height: 2rem;
  border: 3px solid #e5e7eb;
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-editor p {
  color: #6b7280;
  font-size: 0.875rem;
  margin: 0;
}

.error-message {
  color: #dc2626;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  padding: 0 1rem;
}

/* CKEditor custom styles */
:deep(.ck-editor__editable) {
  border: none !important;
  border-radius: 0 !important;
  padding: 1rem !important;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
  font-size: 14px !important;
  line-height: 1.6 !important;
  color: #333 !important;
  min-height: v-bind(height) !important;
}

:deep(.ck-editor__editable:focus) {
  outline: none !important;
  box-shadow: none !important;
}

:deep(.ck-toolbar) {
  border: none !important;
  border-bottom: 1px solid #e5e7eb !important;
  border-radius: 0.5rem 0.5rem 0 0 !important;
  background-color: #f9fafb !important;
  padding: 0.5rem !important;
}

:deep(.ck-toolbar__separator) {
  background-color: #d1d5db !important;
}

:deep(.ck-button) {
  border-radius: 0.25rem !important;
  transition: all 0.2s !important;
}

:deep(.ck-button:hover) {
  background-color: #f3f4f6 !important;
}

:deep(.ck-button.ck-on) {
  background-color: #3b82f6 !important;
  color: white !important;
}

:deep(.ck-dropdown__panel) {
  border: 1px solid #d1d5db !important;
  border-radius: 0.5rem !important;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
}

:deep(.ck-list__item) {
  border-radius: 0.25rem !important;
}

:deep(.ck-list__item:hover) {
  background-color: #f3f4f6 !important;
}

:deep(.ck-list__item.ck-on) {
  background-color: #3b82f6 !important;
  color: white !important;
}

/* Image styles */
:deep(.ck-editor__editable img) {
  max-width: 100% !important;
  height: auto !important;
  border-radius: 0.25rem !important;
  margin: 0.5rem 0 !important;
}

/* Link styles */
:deep(.ck-editor__editable a) {
  color: #3b82f6 !important;
  text-decoration: underline !important;
}

:deep(.ck-editor__editable a:hover) {
  color: #1d4ed8 !important;
}

/* List styles */
:deep(.ck-editor__editable ul),
:deep(.ck-editor__editable ol) {
  margin: 0.5rem 0 !important;
  padding-left: 1.5rem !important;
}

:deep(.ck-editor__editable li) {
  margin: 0.25rem 0 !important;
}

/* Heading styles */
:deep(.ck-editor__editable h1),
:deep(.ck-editor__editable h2),
:deep(.ck-editor__editable h3),
:deep(.ck-editor__editable h4),
:deep(.ck-editor__editable h5),
:deep(.ck-editor__editable h6) {
  margin: 1rem 0 0.5rem 0 !important;
  font-weight: 600 !important;
  line-height: 1.25 !important;
}

:deep(.ck-editor__editable h1) {
  font-size: 1.875rem !important;
}

:deep(.ck-editor__editable h2) {
  font-size: 1.5rem !important;
}

:deep(.ck-editor__editable h3) {
  font-size: 1.25rem !important;
}

/* Dark theme support */
.dark .ckeditor-summary {
  background: #1f2937;
  border-color: #374151;
}

.dark .loading-editor {
  background-color: #374151;
  border-color: #4b5563;
}

.dark :deep(.ck-toolbar) {
  background-color: #374151 !important;
  border-bottom-color: #4b5563 !important;
}

.dark :deep(.ck-editor__editable) {
  background: #1f2937 !important;
  color: #f9fafb !important;
}

.dark :deep(.ck-button) {
  color: #f9fafb !important;
}

.dark :deep(.ck-button:hover) {
  background-color: #4b5563 !important;
}

.dark :deep(.ck-button.ck-on) {
  background-color: #3b82f6 !important;
  color: white !important;
}

.dark :deep(.ck-dropdown__panel) {
  background: #1f2937 !important;
  border-color: #4b5563 !important;
}

.dark :deep(.ck-list__item) {
  color: #f9fafb !important;
}

.dark :deep(.ck-list__item:hover) {
  background-color: #4b5563 !important;
}

/* Responsive */
@media (max-width: 640px) {
  :deep(.ck-toolbar) {
    flex-wrap: wrap !important;
    gap: 0.125rem !important;
  }
  
  :deep(.ck-button) {
    padding: 0.25rem 0.5rem !important;
    font-size: 0.75rem !important;
    min-width: 1.5rem !important;
    height: 1.75rem !important;
  }
  
  :deep(.ck-toolbar__separator) {
    display: none !important;
  }
}
</style>