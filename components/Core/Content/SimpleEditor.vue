<template>
  <div class="simple-editor">
    <!-- Toolbar -->
    <div class="toolbar" v-if="!readonly">
      <button 
        type="button" 
        @click="execCommand('bold')" 
        :class="{ active: isActive('bold') }"
        title="Bold"
      >
        <strong>B</strong>
      </button>
      <button 
        type="button" 
        @click="execCommand('italic')" 
        :class="{ active: isActive('italic') }"
        title="Italic"
      >
        <em>I</em>
      </button>
      <button 
        type="button" 
        @click="execCommand('underline')" 
        :class="{ active: isActive('underline') }"
        title="Underline"
      >
        <u>U</u>
      </button>
      <div class="separator"></div>
      <button 
        type="button" 
        @click="execCommand('insertUnorderedList')" 
        :class="{ active: isActive('insertUnorderedList') }"
        title="Bullet List"
      >
        • List
      </button>
      <button 
        type="button" 
        @click="execCommand('insertOrderedList')" 
        :class="{ active: isActive('insertOrderedList') }"
        title="Numbered List"
      >
        1. List
      </button>
      <div class="separator"></div>
      <button 
        type="button" 
        @click="execCommand('justifyLeft')" 
        :class="{ active: isActive('justifyLeft') }"
        title="Align Left"
      >
        ←
      </button>
      <button 
        type="button" 
        @click="execCommand('justifyCenter')" 
        :class="{ active: isActive('justifyCenter') }"
        title="Align Center"
      >
        ↔
      </button>
      <button 
        type="button" 
        @click="execCommand('justifyRight')" 
        :class="{ active: isActive('justifyRight') }"
        title="Align Right"
      >
        →
      </button>
      <div class="separator"></div>
      <button 
        type="button" 
        @click="execCommand('undo')" 
        title="Undo"
      >
        ↶ Undo
      </button>
      <button 
        type="button" 
        @click="execCommand('redo')" 
        title="Redo"
      >
        ↷ Redo
      </button>
    </div>
    
    <!-- Editor content -->
    <div
      ref="editorRef"
      class="editor-content"
      :contenteditable="!readonly && !disabled"
      :placeholder="placeholder"
      @input="onInput"
      @focus="onFocus"
      @blur="onBlur"
      @keydown="onKeydown"
      v-html="content"
    ></div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, onMounted } from 'vue'

// Props
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
    default: '300px'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  readonly: {
    type: Boolean,
    default: false
  },
  toolbar: {
    type: String,
    default: 'standard',
    validator: (value) => ['minimal', 'basic', 'standard', 'full'].includes(value)
  }
})

// Emits
const emit = defineEmits(['update:modelValue', 'ready', 'change', 'focus', 'blur'])

// Reactive state
const editorRef = ref(null)
const content = ref(props.modelValue)

// Watch for modelValue changes
watch(() => props.modelValue, (newValue) => {
  if (newValue !== content.value) {
    content.value = newValue
    if (editorRef.value) {
      editorRef.value.innerHTML = newValue
    }
  }
})

// Watch for content changes
watch(content, (newValue) => {
  emit('update:modelValue', newValue)
  emit('change', newValue)
})

// Event handlers
const onInput = (event) => {
  content.value = event.target.innerHTML
}

const onFocus = (event) => {
  emit('focus', event)
}

const onBlur = (event) => {
  emit('blur', event)
}

const onKeydown = (event) => {
  // Handle Ctrl+Z for undo, Ctrl+Y for redo
  if (event.ctrlKey) {
    if (event.key === 'z') {
      event.preventDefault()
      execCommand('undo')
    } else if (event.key === 'y') {
      event.preventDefault()
      execCommand('redo')
    }
  }
}

// Command execution
const execCommand = (command, value = null) => {
  if (editorRef.value) {
    editorRef.value.focus()
    document.execCommand(command, false, value)
    // Trigger input event to update content
    const event = new Event('input', { bubbles: true })
    editorRef.value.dispatchEvent(event)
  }
}

// Check if command is active
const isActive = (command) => {
  if (editorRef.value) {
    return document.queryCommandState(command)
  }
  return false
}

// Initialize
onMounted(() => {
  console.log('SimpleEditor mounted')
  emit('ready', editorRef.value)
})

// Expose methods
defineExpose({
  editor: () => editorRef.value,
  getContent: () => content.value,
  setContent: (newContent) => {
    content.value = newContent
    if (editorRef.value) {
      editorRef.value.innerHTML = newContent
    }
  },
  focus: () => {
    if (editorRef.value) {
      editorRef.value.focus()
    }
  },
  insertText: (text) => {
    if (editorRef.value) {
      editorRef.value.focus()
      document.execCommand('insertText', false, text)
      const event = new Event('input', { bubbles: true })
      editorRef.value.dispatchEvent(event)
    }
  }
})
</script>

<style scoped>
.simple-editor {
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  overflow: hidden;
  background: white;
}

.toolbar {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  background-color: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.toolbar button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.375rem 0.75rem;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s;
  min-width: 2rem;
  height: 2rem;
}

.toolbar button:hover {
  background-color: #f3f4f6;
  border-color: #9ca3af;
}

.toolbar button.active {
  background-color: #3b82f6;
  color: white;
  border-color: #2563eb;
}

.toolbar button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.separator {
  width: 1px;
  height: 1.5rem;
  background-color: #d1d5db;
  margin: 0 0.25rem;
}

.editor-content {
  min-height: v-bind(height);
  max-height: 600px;
  overflow-y: auto;
  padding: 1rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 14px;
  line-height: 1.6;
  color: #333;
  outline: none;
}

.editor-content:empty::before {
  content: attr(placeholder);
  color: #9ca3af;
  font-style: italic;
  pointer-events: none;
}

.editor-content:focus {
  outline: none;
}

/* Content styling */
.editor-content :deep(p) {
  margin: 0.5rem 0;
}

.editor-content :deep(h1),
.editor-content :deep(h2),
.editor-content :deep(h3),
.editor-content :deep(h4),
.editor-content :deep(h5),
.editor-content :deep(h6) {
  margin: 1rem 0 0.5rem 0;
  font-weight: 600;
}

.editor-content :deep(ul),
.editor-content :deep(ol) {
  margin: 0.5rem 0;
  padding-left: 1.5rem;
}

.editor-content :deep(li) {
  margin: 0.25rem 0;
}

.editor-content :deep(strong),
.editor-content :deep(b) {
  font-weight: 600;
}

.editor-content :deep(em),
.editor-content :deep(i) {
  font-style: italic;
}

.editor-content :deep(u) {
  text-decoration: underline;
}

/* Size variants */
.simple-editor.size-sm .editor-content {
  min-height: 150px;
  font-size: 13px;
  padding: 0.75rem;
}

.simple-editor.size-lg .editor-content {
  min-height: 500px;
  font-size: 15px;
  padding: 1.5rem;
}

/* Disabled state */
.simple-editor.disabled .editor-content {
  background-color: #f9fafb;
  color: #6b7280;
  cursor: not-allowed;
}

.simple-editor.readonly .editor-content {
  background-color: #f9fafb;
}

/* Dark theme support */
.dark .simple-editor {
  background: #1f2937;
  border-color: #374151;
}

.dark .toolbar {
  background-color: #374151;
  border-bottom-color: #4b5563;
}

.dark .toolbar button {
  background: #1f2937;
  border-color: #4b5563;
  color: #f9fafb;
}

.dark .toolbar button:hover {
  background-color: #4b5563;
}

.dark .toolbar button.active {
  background-color: #3b82f6;
  color: white;
}

.dark .editor-content {
  background: #1f2937;
  color: #f9fafb;
}

.dark .editor-content:empty::before {
  color: #6b7280;
}

/* Responsive */
@media (max-width: 640px) {
  .toolbar {
    flex-wrap: wrap;
    gap: 0.125rem;
  }
  
  .toolbar button {
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
    min-width: 1.5rem;
    height: 1.75rem;
  }
  
  .separator {
    display: none;
  }
}
</style>
