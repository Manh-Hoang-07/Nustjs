<template>
  <div class="ckeditor-container">
    <!-- Loading state -->
    <div v-if="loading" class="flex items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
      <div class="text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
        <p class="text-gray-600">Đang tải trình soạn thảo...</p>
      </div>
    </div>
    
    <!-- Editor container -->
    <div v-else>
      <div ref="editorContainer" class="editor-container"></div>
      <div v-if="error" class="mt-2 text-red-600 text-sm">{{ error }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Nhập nội dung...'
  },
  height: {
    type: String,
    default: '400px'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  config: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:modelValue', 'ready', 'change'])

const editorContainer = ref(null)
const editor = ref(null)
const loading = ref(true)
const error = ref(null)

// Lazy load CKEditor
let CKEditor = null

const loadCKEditor = async () => {
  try {
    // Dynamic import để lazy load
    const { default: DecoupledEditor } = await import('@ckeditor/ckeditor5-build-decoupled-document')
    CKEditor = DecoupledEditor
    return true
  } catch (err) {
    error.value = 'Không thể tải trình soạn thảo'
    console.error('CKEditor load error:', err)
    return false
  }
}

const initEditor = async () => {
  if (!CKEditor) {
    const loaded = await loadCKEditor()
    if (!loaded) return
  }

  try {
    loading.value = true
    error.value = null

    // Default configuration
    const defaultConfig = {
      placeholder: props.placeholder,
      toolbar: {
        items: [
          'heading',
          '|',
          'bold',
          'italic',
          'underline',
          'strikethrough',
          '|',
          'fontSize',
          'fontFamily',
          'fontColor',
          'fontBackgroundColor',
          '|',
          'alignment',
          '|',
          'numberedList',
          'bulletedList',
          '|',
          'indent',
          'outdent',
          '|',
          'link',
          'blockQuote',
          'insertTable',
          'mediaEmbed',
          '|',
          'undo',
          'redo'
        ]
      },
      table: {
        contentToolbar: [
          'tableColumn',
          'tableRow',
          'mergeTableCells'
        ]
      },
      mediaEmbed: {
        previewsInData: true
      },
      ...props.config
    }

    // Create editor
    editor.value = await CKEditor.create(editorContainer.value, defaultConfig)

    // Set initial content
    if (props.modelValue) {
      editor.value.setData(props.modelValue)
    }

    // Handle content changes
    editor.value.model.document.on('change:data', () => {
      const data = editor.value.getData()
      emit('update:modelValue', data)
      emit('change', data)
    })

    // Handle editor ready
    emit('ready', editor.value)

    // Handle disabled state
    if (props.disabled) {
      editor.value.isReadOnly = true
    }

  } catch (err) {
    error.value = 'Không thể khởi tạo trình soạn thảo'
    console.error('CKEditor init error:', err)
  } finally {
    loading.value = false
  }
}

// Watch for modelValue changes
watch(() => props.modelValue, (newValue) => {
  if (editor.value && newValue !== editor.value.getData()) {
    editor.value.setData(newValue || '')
  }
}, { immediate: false })

// Watch for disabled state
watch(() => props.disabled, (disabled) => {
  if (editor.value) {
    editor.value.isReadOnly = disabled
  }
})

// Watch for config changes
watch(() => props.config, () => {
  // Reinitialize editor if config changes significantly
  if (editor.value) {
    destroyEditor()
    nextTick(() => {
      initEditor()
    })
  }
}, { deep: true })

const destroyEditor = async () => {
  if (editor.value) {
    try {
      await editor.value.destroy()
    } catch (err) {
      console.error('CKEditor destroy error:', err)
    }
    editor.value = null
  }
}

onMounted(() => {
  initEditor()
})

onUnmounted(() => {
  destroyEditor()
})

// Expose editor instance
defineExpose({
  editor: () => editor.value,
  getData: () => editor.value?.getData() || '',
  setData: (data) => editor.value?.setData(data),
  isReadOnly: (readonly) => {
    if (editor.value) {
      editor.value.isReadOnly = readonly
    }
  }
})
</script>

<style scoped>
.ckeditor-container {
  width: 100%;
}

.editor-container {
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  overflow: hidden;
}

.editor-container :deep(.ck-editor__editable) {
  min-height: v-bind(height);
  max-height: 600px;
  overflow-y: auto;
}

.editor-container :deep(.ck-editor__editable_inline) {
  padding: 1rem;
}

.editor-container :deep(.ck-toolbar) {
  border-bottom: 1px solid #d1d5db;
}

.editor-container :deep(.ck-content) {
  font-family: inherit;
  line-height: 1.6;
}
</style> 
