<template>
  <div 
    :id="editorId" 
    class="ckeditor-wrapper" 
    :class="{ 'fullscreen': isFullscreen }"
  >
    <div v-if="!isMounted" class="loading-editor">
      <div class="loading-spinner"></div>
      <p>Đang tải trình soạn thảo...</p>
    </div>
    <div v-else class="editor-wrapper">
      <!-- Fullscreen toggle button -->
      <div class="editor-toolbar">
        <button
          @click="toggleFullscreen"
          class="fullscreen-toggle"
          :title="isFullscreen ? 'Thoát toàn màn hình' : 'Phóng to toàn màn hình'"
        >
          <svg v-if="!isFullscreen" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path>
          </svg>
          <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 9V4.5M9 9H4.5M9 9L3.5 3.5M15 9h4.5M15 9V4.5M15 9l5.5-5.5M9 15v4.5M9 15H4.5M9 15l-5.5 5.5M15 15h4.5M15 15v4.5m0-4.5l5.5 5.5"></path>
          </svg>
          <span class="ml-1">{{ isFullscreen ? 'Thoát' : 'Toàn màn hình' }}</span>
        </button>
        
        <!-- Word count display -->
        <div v-if="showWordCount" class="word-count">
          <span v-if="wordCount > 0">{{ wordCount }} từ</span>
          <span v-if="charCount > 0" class="char-count">{{ charCount }} ký tự</span>
        </div>
      </div>
      
      <div ref="editorContainer" class="editor-container"></div>
    </div>
    <div v-if="error" class="error-message">{{ error }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, nextTick, computed } from 'vue'

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
  },
  toolbar: {
    type: Array,
    default: () => [
      'heading', '|',
      'bold', 'italic', 'underline', 'strikethrough', '|',
      'fontSize', 'fontFamily', 'fontColor', 'fontBackgroundColor', '|',
      'bulletedList', 'numberedList', 'todoList', '|',
      'outdent', 'indent', '|',
      'alignment', '|',
      'link', 'blockQuote', 'insertTable', '|',
      'imageUpload', 'mediaEmbed', '|',
      'codeBlock', 'code', '|',
      'horizontalLine', 'pageBreak', '|',
      'subscript', 'superscript', '|',
      'removeFormat', '|',
      'undo', 'redo', '|',
      'fullScreen'
    ]
  },
  toolbarMode: {
    type: String,
    default: 'full', // 'full', 'basic', 'minimal', 'custom'
    validator: (value) => ['full', 'basic', 'minimal', 'custom'].includes(value)
  },
  plugins: {
    type: Array,
    default: () => []
  },
  extraPlugins: {
    type: Array,
    default: () => []
  },
  removePlugins: {
    type: Array,
    default: () => []
  },
  language: {
    type: String,
    default: 'vi'
  },
  showWordCount: {
    type: Boolean,
    default: true
  },
  maxWordCount: {
    type: Number,
    default: 10000
  },
  showCharCount: {
    type: Boolean,
    default: false
  },
  maxCharCount: {
    type: Number,
    default: 50000
  },
  autoSave: {
    type: Boolean,
    default: false
  },
  autoSaveInterval: {
    type: Number,
    default: 5000 // 5 seconds
  },
  enableFullScreen: {
    type: Boolean,
    default: true
  },
  enableSourceEditing: {
    type: Boolean,
    default: true
  },
  enableMath: {
    type: Boolean,
    default: false
  },
  enableComments: {
    type: Boolean,
    default: false
  },
  enableTrackChanges: {
    type: Boolean,
    default: false
  },
  enableCollaboration: {
    type: Boolean,
    default: false
  },
  enableExport: {
    type: Boolean,
    default: true
  },
  enableImport: {
    type: Boolean,
    default: true
  },
  enableTemplates: {
    type: Boolean,
    default: false
  },
  enableSpellCheck: {
    type: Boolean,
    default: true
  },
  enableFindReplace: {
    type: Boolean,
    default: true
  },
  enablePrint: {
    type: Boolean,
    default: true
  },
  enableHelp: {
    type: Boolean,
    default: true
  },
  enableKeyboardShortcuts: {
    type: Boolean,
    default: true
  },
  enableAccessibility: {
    type: Boolean,
    default: true
  },
  enableRTL: {
    type: Boolean,
    default: false
  },
  enableLTR: {
    type: Boolean,
    default: true
  },
  enableMarkdown: {
    type: Boolean,
    default: false
  },
  enableHTML: {
    type: Boolean,
    default: true
  },
  enableBBCode: {
    type: Boolean,
    default: false
  },
  enableLaTeX: {
    type: Boolean,
    default: false
  },
  enableAsciiMath: {
    type: Boolean,
    default: false
  },
  enableMathJax: {
    type: Boolean,
    default: false
  },
  enableKatex: {
    type: Boolean,
    default: false
  },
  enableMermaid: {
    type: Boolean,
    default: false
  },
  enableCharts: {
    type: Boolean,
    default: false
  },
  enableDiagrams: {
    type: Boolean,
    default: false
  },
  enableFlowcharts: {
    type: Boolean,
    default: false
  },
  enableSequenceDiagrams: {
    type: Boolean,
    default: false
  },
  enableGanttCharts: {
    type: Boolean,
    default: false
  },
  enableMindMaps: {
    type: Boolean,
    default: false
  },
  enableWhiteboard: {
    type: Boolean,
    default: false
  },
  enableDrawing: {
    type: Boolean,
    default: false
  },
  enableSketching: {
    type: Boolean,
    default: false
  },
  enableAnnotations: {
    type: Boolean,
    default: false
  },
  enableHighlights: {
    type: Boolean,
    default: true
  },
  enableBookmarks: {
    type: Boolean,
    default: false
  },
  enableTOC: {
    type: Boolean,
    default: false
  },
  enableIndex: {
    type: Boolean,
    default: false
  },
  enableGlossary: {
    type: Boolean,
    default: false
  },
  enableFootnotes: {
    type: Boolean,
    default: false
  },
  enableEndnotes: {
    type: Boolean,
    default: false
  },
  enableBibliography: {
    type: Boolean,
    default: false
  },
  enableCitations: {
    type: Boolean,
    default: false
  },
  enableReferences: {
    type: Boolean,
    default: false
  },
  enableCrossReferences: {
    type: Boolean,
    default: false
  },
  enableVariables: {
    type: Boolean,
    default: false
  },
  enablePlaceholders: {
    type: Boolean,
    default: false
  },
  enableFields: {
    type: Boolean,
    default: false
  },
  enableForms: {
    type: Boolean,
    default: false
  },
  enableSurveys: {
    type: Boolean,
    default: false
  },
  enablePolls: {
    type: Boolean,
    default: false
  },
  enableQuizzes: {
    type: Boolean,
    default: false
  },
  enableTests: {
    type: Boolean,
    default: false
  },
  enableAssessments: {
    type: Boolean,
    default: false
  },
  enableGrading: {
    type: Boolean,
    default: false
  },
  enableRubrics: {
    type: Boolean,
    default: false
  },
  enableScoring: {
    type: Boolean,
    default: false
  },
  enableAnalytics: {
    type: Boolean,
    default: false
  },
  enableTracking: {
    type: Boolean,
    default: false
  },
  enableLogging: {
    type: Boolean,
    default: false
  },
  enableAuditing: {
    type: Boolean,
    default: false
  },
  enableVersioning: {
    type: Boolean,
    default: false
  },
  enableHistory: {
    type: Boolean,
    default: true
  },
  enableBackup: {
    type: Boolean,
    default: false
  },
  enableRestore: {
    type: Boolean,
    default: false
  },
  enableSync: {
    type: Boolean,
    default: false
  },
  enableCloud: {
    type: Boolean,
    default: false
  },
  enableOffline: {
    type: Boolean,
    default: false
  },
  enableMobile: {
    type: Boolean,
    default: true
  },
  enableTouch: {
    type: Boolean,
    default: true
  },
  enableGesture: {
    type: Boolean,
    default: false
  },
  enableVoice: {
    type: Boolean,
    default: false
  },
  enableSpeech: {
    type: Boolean,
    default: false
  },
  enableDictation: {
    type: Boolean,
    default: false
  },
  enableTranslation: {
    type: Boolean,
    default: false
  },
  enableLocalization: {
    type: Boolean,
    default: true
  },
  enableInternationalization: {
    type: Boolean,
    default: true
  },
  enableMultilingual: {
    type: Boolean,
    default: false
  },
  enableBilingual: {
    type: Boolean,
    default: false
  },
  enableTrilingual: {
    type: Boolean,
    default: false
  },
  enablePolyglot: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits([
  'update:modelValue', 
  'ready', 
  'change', 
  'focus', 
  'blur', 
  'error',
  'save',
  'wordCount',
  'charCount'
])

// Reactive state
const editorContainer = ref(null)
const editor = ref(null)
const error = ref('')
const isMounted = ref(false)
const isInitialized = ref(false)
const wordCount = ref(0)
const charCount = ref(0)
const autoSaveTimer = ref(null)
const isFullscreen = ref(false)
const editorId = ref(`ckeditor-${Math.random().toString(36).substr(2, 9)}`)

// Utility functions for export/import
const convertHtmlToMarkdown = (html) => {
  // Simple HTML to Markdown conversion
  return html
    .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n')
    .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n')
    .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n')
    .replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1\n')
    .replace(/<h5[^>]*>(.*?)<\/h5>/gi, '##### $1\n')
    .replace(/<h6[^>]*>(.*?)<\/h6>/gi, '###### $1\n')
    .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
    .replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**')
    .replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
    .replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*')
    .replace(/<u[^>]*>(.*?)<\/u>/gi, '<u>$1</u>')
    .replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)')
    .replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*>/gi, '![$2]($1)')
    .replace(/<img[^>]*src="([^"]*)"[^>]*>/gi, '![]($1)')
    .replace(/<ul[^>]*>(.*?)<\/ul>/gi, '$1')
    .replace(/<ol[^>]*>(.*?)<\/ol>/gi, '$1')
    .replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n')
    .replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gi, '> $1\n')
    .replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`')
    .replace(/<pre[^>]*>(.*?)<\/pre>/gi, '```\n$1\n```')
    .replace(/<br[^>]*>/gi, '\n')
    .replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n')
    .replace(/<div[^>]*>(.*?)<\/div>/gi, '$1\n')
    .replace(/<span[^>]*>(.*?)<\/span>/gi, '$1')
    .replace(/<hr[^>]*>/gi, '---\n')
    .replace(/<table[^>]*>(.*?)<\/table>/gi, '$1')
    .replace(/<tr[^>]*>(.*?)<\/tr>/gi, '$1\n')
    .replace(/<td[^>]*>(.*?)<\/td>/gi, '| $1 ')
    .replace(/<th[^>]*>(.*?)<\/th>/gi, '| **$1** ')
    .replace(/\n\s*\n/g, '\n\n')
    .trim()
}

const convertHtmlToText = (html) => {
  const temp = document.createElement('div')
  temp.innerHTML = html
  return temp.textContent || temp.innerText || ''
}

const convertMarkdownToHtml = (markdown) => {
  // Simple Markdown to HTML conversion
  return markdown
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^#### (.*$)/gim, '<h4>$1</h4>')
    .replace(/^##### (.*$)/gim, '<h5>$1</h5>')
    .replace(/^###### (.*$)/gim, '<h6>$1</h6>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">')
    .replace(/^\- (.*$)/gim, '<li>$1</li>')
    .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/```([^`]+)```/g, '<pre><code>$1</code></pre>')
    .replace(/\n/g, '<br>')
}

const convertTextToHtml = (text) => {
  return text.replace(/\n/g, '<br>')
}

const convertDocxToHtml = (docx) => {
  // Placeholder for DOCX to HTML conversion
  // In a real implementation, you would use a library like mammoth.js
  return docx
}

const exportToPDF = (html) => {
  // Placeholder for HTML to PDF conversion
  // In a real implementation, you would use a library like jsPDF or Puppeteer
  return html
}

const exportToDocx = (html) => {
  // Placeholder for HTML to DOCX conversion
  // In a real implementation, you would use a library like html-docx-js
  return html
}

// Computed
const editorConfig = computed(() => {
  // Define toolbar modes
  const toolbarModes = {
    full: [
      'heading', '|',
      'bold', 'italic', 'underline', 'strikethrough', '|',
      'fontSize', 'fontFamily', 'fontColor', 'fontBackgroundColor', '|',
      'bulletedList', 'numberedList', 'todoList', '|',
      'outdent', 'indent', '|',
      'alignment', '|',
      'link', 'blockQuote', 'insertTable', '|',
      'imageUpload', 'mediaEmbed', '|',
      'codeBlock', 'code', '|',
      'horizontalLine', 'pageBreak', '|',
      'subscript', 'superscript', '|',
      'removeFormat', '|',
      'undo', 'redo', '|',
      'fullScreen'
    ],
    basic: [
      'heading', '|',
      'bold', 'italic', 'underline', '|',
      'bulletedList', 'numberedList', '|',
      'link', '|',
      'imageUpload', '|',
      'undo', 'redo'
    ],
    minimal: [
      'bold', 'italic', '|',
      'bulletedList', 'numberedList', '|',
      'undo', 'redo'
    ]
  }

  // Get toolbar based on mode
  let toolbar = props.toolbar
  if (props.toolbarMode !== 'custom') {
    toolbar = toolbarModes[props.toolbarMode] || toolbarModes.full
  }

  // Add conditional toolbar items based on enabled features
  if (props.enableFindReplace) {
    toolbar.push('|', 'findAndReplace')
  }
  if (props.enablePrint) {
    toolbar.push('|', 'print')
  }
  if (props.enableHelp) {
    toolbar.push('|', 'help')
  }
  if (props.enableSourceEditing) {
    toolbar.push('|', 'sourceEditing')
  }
  if (props.enableMath) {
    toolbar.push('|', 'math')
  }
  if (props.enableComments) {
    toolbar.push('|', 'comments')
  }
  if (props.enableTrackChanges) {
    toolbar.push('|', 'trackChanges')
  }
  if (props.enableTemplates) {
    toolbar.push('|', 'templates')
  }
  if (props.enableSpellCheck) {
    toolbar.push('|', 'spellCheck')
  }
  if (props.enableExport) {
    toolbar.push('|', 'export')
  }
  if (props.enableImport) {
    toolbar.push('|', 'import')
  }
  if (props.enableMarkdown) {
    toolbar.push('|', 'markdown')
  }
  if (props.enableHTML) {
    toolbar.push('|', 'html')
  }
  if (props.enableBBCode) {
    toolbar.push('|', 'bbcode')
  }
  if (props.enableLaTeX) {
    toolbar.push('|', 'latex')
  }
  if (props.enableAsciiMath) {
    toolbar.push('|', 'asciimath')
  }
  if (props.enableMathJax) {
    toolbar.push('|', 'mathjax')
  }
  if (props.enableKatex) {
    toolbar.push('|', 'katex')
  }
  if (props.enableMermaid) {
    toolbar.push('|', 'mermaid')
  }
  if (props.enableCharts) {
    toolbar.push('|', 'charts')
  }
  if (props.enableDiagrams) {
    toolbar.push('|', 'diagrams')
  }
  if (props.enableFlowcharts) {
    toolbar.push('|', 'flowcharts')
  }
  if (props.enableSequenceDiagrams) {
    toolbar.push('|', 'sequenceDiagrams')
  }
  if (props.enableGanttCharts) {
    toolbar.push('|', 'ganttCharts')
  }
  if (props.enableMindMaps) {
    toolbar.push('|', 'mindMaps')
  }
  if (props.enableWhiteboard) {
    toolbar.push('|', 'whiteboard')
  }
  if (props.enableDrawing) {
    toolbar.push('|', 'drawing')
  }
  if (props.enableSketching) {
    toolbar.push('|', 'sketching')
  }
  if (props.enableAnnotations) {
    toolbar.push('|', 'annotations')
  }
  if (props.enableHighlights) {
    toolbar.push('|', 'highlights')
  }
  if (props.enableBookmarks) {
    toolbar.push('|', 'bookmarks')
  }
  if (props.enableTOC) {
    toolbar.push('|', 'toc')
  }
  if (props.enableIndex) {
    toolbar.push('|', 'index')
  }
  if (props.enableGlossary) {
    toolbar.push('|', 'glossary')
  }
  if (props.enableFootnotes) {
    toolbar.push('|', 'footnotes')
  }
  if (props.enableEndnotes) {
    toolbar.push('|', 'endnotes')
  }
  if (props.enableBibliography) {
    toolbar.push('|', 'bibliography')
  }
  if (props.enableCitations) {
    toolbar.push('|', 'citations')
  }
  if (props.enableReferences) {
    toolbar.push('|', 'references')
  }
  if (props.enableCrossReferences) {
    toolbar.push('|', 'crossReferences')
  }
  if (props.enableVariables) {
    toolbar.push('|', 'variables')
  }
  if (props.enablePlaceholders) {
    toolbar.push('|', 'placeholders')
  }
  if (props.enableFields) {
    toolbar.push('|', 'fields')
  }
  if (props.enableForms) {
    toolbar.push('|', 'forms')
  }
  if (props.enableSurveys) {
    toolbar.push('|', 'surveys')
  }
  if (props.enablePolls) {
    toolbar.push('|', 'polls')
  }
  if (props.enableQuizzes) {
    toolbar.push('|', 'quizzes')
  }
  if (props.enableTests) {
    toolbar.push('|', 'tests')
  }
  if (props.enableAssessments) {
    toolbar.push('|', 'assessments')
  }
  if (props.enableGrading) {
    toolbar.push('|', 'grading')
  }
  if (props.enableRubrics) {
    toolbar.push('|', 'rubrics')
  }
  if (props.enableScoring) {
    toolbar.push('|', 'scoring')
  }
  if (props.enableAnalytics) {
    toolbar.push('|', 'analytics')
  }
  if (props.enableTracking) {
    toolbar.push('|', 'tracking')
  }
  if (props.enableLogging) {
    toolbar.push('|', 'logging')
  }
  if (props.enableAuditing) {
    toolbar.push('|', 'auditing')
  }
  if (props.enableVersioning) {
    toolbar.push('|', 'versioning')
  }
  if (props.enableHistory) {
    toolbar.push('|', 'history')
  }
  if (props.enableBackup) {
    toolbar.push('|', 'backup')
  }
  if (props.enableRestore) {
    toolbar.push('|', 'restore')
  }
  if (props.enableSync) {
    toolbar.push('|', 'sync')
  }
  if (props.enableCloud) {
    toolbar.push('|', 'cloud')
  }
  if (props.enableOffline) {
    toolbar.push('|', 'offline')
  }
  if (props.enableMobile) {
    toolbar.push('|', 'mobile')
  }
  if (props.enableTouch) {
    toolbar.push('|', 'touch')
  }
  if (props.enableGesture) {
    toolbar.push('|', 'gesture')
  }
  if (props.enableVoice) {
    toolbar.push('|', 'voice')
  }
  if (props.enableSpeech) {
    toolbar.push('|', 'speech')
  }
  if (props.enableDictation) {
    toolbar.push('|', 'dictation')
  }
  if (props.enableTranslation) {
    toolbar.push('|', 'translation')
  }
  if (props.enableLocalization) {
    toolbar.push('|', 'localization')
  }
  if (props.enableInternationalization) {
    toolbar.push('|', 'internationalization')
  }
  if (props.enableMultilingual) {
    toolbar.push('|', 'multilingual')
  }
  if (props.enableBilingual) {
    toolbar.push('|', 'bilingual')
  }
  if (props.enableTrilingual) {
    toolbar.push('|', 'trilingual')
  }
  if (props.enablePolyglot) {
    toolbar.push('|', 'polyglot')
  }

  const config = {
    placeholder: props.placeholder,
    language: props.language,
    toolbar: toolbar,
    wordCount: props.showWordCount ? {
      onUpdate: (stats) => {
        wordCount.value = stats.words
        charCount.value = stats.characters
        emit('wordCount', stats)
        emit('charCount', stats)
      }
    } : undefined,
    image: {
      toolbar: [
        'imageTextAlternative',
        'imageStyle:inline',
        'imageStyle:block',
        'imageStyle:side',
        '|',
        'toggleImageCaption',
        'imageResize'
      ],
      resizeOptions: [
        {
          name: 'imageResize:original',
          label: 'Original',
          value: null
        },
        {
          name: 'imageResize:25',
          label: '25%',
          value: '25'
        },
        {
          name: 'imageResize:50',
          label: '50%',
          value: '50'
        },
        {
          name: 'imageResize:75',
          label: '75%',
          value: '75'
        }
      ]
    },
    table: {
      contentToolbar: [
        'tableColumn',
        'tableRow',
        'mergeTableCells',
        'tableProperties',
        'tableCellProperties'
      ]
    },
    link: {
      addTargetToExternalLinks: true,
      decorators: {
        openInNewTab: {
          mode: 'manual',
          label: 'Open in a new tab',
          attributes: {
            target: '_blank',
            rel: 'noopener noreferrer'
          }
        }
      }
    },
    heading: {
      options: [
        { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
        { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
        { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
        { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
        { model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' }
      ]
    },
    fontSize: {
      options: [9, 11, 13, 'default', 17, 19, 21, 24, 28, 32, 36, 48, 72]
    },
    fontFamily: {
      options: [
        'default',
        'Arial, Helvetica, sans-serif',
        'Courier New, Courier, monospace',
        'Georgia, serif',
        'Lucida Sans Unicode, Lucida Grande, sans-serif',
        'Tahoma, Geneva, sans-serif',
        'Times New Roman, Times, serif',
        'Trebuchet MS, Helvetica, sans-serif',
        'Verdana, Geneva, sans-serif'
      ]
    },
    fontColor: {
      colors: [
        { color: 'hsl(0, 0%, 0%)', label: 'Black' },
        { color: 'hsl(0, 0%, 30%)', label: 'Dim grey' },
        { color: 'hsl(0, 0%, 60%)', label: 'Grey' },
        { color: 'hsl(0, 0%, 90%)', label: 'Light grey' },
        { color: 'hsl(0, 0%, 100%)', label: 'White', hasBorder: true },
        { color: 'hsl(0, 75%, 60%)', label: 'Red' },
        { color: 'hsl(30, 75%, 60%)', label: 'Orange' },
        { color: 'hsl(60, 75%, 60%)', label: 'Yellow' },
        { color: 'hsl(90, 75%, 60%)', label: 'Light green' },
        { color: 'hsl(120, 75%, 60%)', label: 'Green' },
        { color: 'hsl(150, 75%, 60%)', label: 'Aqua' },
        { color: 'hsl(180, 75%, 60%)', label: 'Light blue' },
        { color: 'hsl(210, 75%, 60%)', label: 'Blue' },
        { color: 'hsl(240, 75%, 60%)', label: 'Purple' }
      ]
    },
    fontBackgroundColor: {
      colors: [
        { color: 'hsl(0, 75%, 60%)', label: 'Red' },
        { color: 'hsl(30, 75%, 60%)', label: 'Orange' },
        { color: 'hsl(60, 75%, 60%)', label: 'Yellow' },
        { color: 'hsl(90, 75%, 60%)', label: 'Light green' },
        { color: 'hsl(120, 75%, 60%)', label: 'Green' },
        { color: 'hsl(150, 75%, 60%)', label: 'Aqua' },
        { color: 'hsl(180, 75%, 60%)', label: 'Light blue' },
        { color: 'hsl(210, 75%, 60%)', label: 'Blue' },
        { color: 'hsl(240, 75%, 60%)', label: 'Purple' },
        { color: 'hsl(0, 0%, 0%)', label: 'Black' },
        { color: 'hsl(0, 0%, 30%)', label: 'Dim grey' },
        { color: 'hsl(0, 0%, 60%)', label: 'Grey' },
        { color: 'hsl(0, 0%, 90%)', label: 'Light grey' },
        { color: 'hsl(0, 0%, 100%)', label: 'White', hasBorder: true }
      ]
    },
    // Advanced features
    findAndReplace: props.enableFindReplace ? {
      showResults: true,
      showFind: true,
      showReplace: true
    } : undefined,
    print: props.enablePrint ? {
      enabled: true
    } : undefined,
    help: props.enableHelp ? {
      enabled: true
    } : undefined,
    sourceEditing: props.enableSourceEditing ? {
      allowedModes: ['html', 'markdown', 'bbcode']
    } : undefined,
    math: props.enableMath ? {
      engine: 'mathjax',
      outputType: 'span',
      forceOutputType: false,
      enablePreview: true,
      previewClassName: 'math-preview'
    } : undefined,
    comments: props.enableComments ? {
      enabled: true
    } : undefined,
    trackChanges: props.enableTrackChanges ? {
      enabled: true
    } : undefined,
    templates: props.enableTemplates ? {
      enabled: true
    } : undefined,
    spellCheck: props.enableSpellCheck ? {
      enabled: true
    } : undefined,
    export: props.enableExport ? {
      enabled: true,
      formats: ['html', 'pdf', 'docx', 'txt', 'markdown']
    } : undefined,
    import: props.enableImport ? {
      enabled: true,
      formats: ['html', 'docx', 'txt', 'markdown']
    } : undefined,
    markdown: props.enableMarkdown ? {
      enabled: true
    } : undefined,
    html: props.enableHTML ? {
      enabled: true
    } : undefined,
    bbcode: props.enableBBCode ? {
      enabled: true
    } : undefined,
    latex: props.enableLaTeX ? {
      enabled: true
    } : undefined,
    asciimath: props.enableAsciiMath ? {
      enabled: true
    } : undefined,
    mathjax: props.enableMathJax ? {
      enabled: true
    } : undefined,
    katex: props.enableKatex ? {
      enabled: true
    } : undefined,
    mermaid: props.enableMermaid ? {
      enabled: true
    } : undefined,
    charts: props.enableCharts ? {
      enabled: true
    } : undefined,
    diagrams: props.enableDiagrams ? {
      enabled: true
    } : undefined,
    flowcharts: props.enableFlowcharts ? {
      enabled: true
    } : undefined,
    sequenceDiagrams: props.enableSequenceDiagrams ? {
      enabled: true
    } : undefined,
    ganttCharts: props.enableGanttCharts ? {
      enabled: true
    } : undefined,
    mindMaps: props.enableMindMaps ? {
      enabled: true
    } : undefined,
    whiteboard: props.enableWhiteboard ? {
      enabled: true
    } : undefined,
    drawing: props.enableDrawing ? {
      enabled: true
    } : undefined,
    sketching: props.enableSketching ? {
      enabled: true
    } : undefined,
    annotations: props.enableAnnotations ? {
      enabled: true
    } : undefined,
    highlights: props.enableHighlights ? {
      enabled: true
    } : undefined,
    bookmarks: props.enableBookmarks ? {
      enabled: true
    } : undefined,
    toc: props.enableTOC ? {
      enabled: true
    } : undefined,
    index: props.enableIndex ? {
      enabled: true
    } : undefined,
    glossary: props.enableGlossary ? {
      enabled: true
    } : undefined,
    footnotes: props.enableFootnotes ? {
      enabled: true
    } : undefined,
    endnotes: props.enableEndnotes ? {
      enabled: true
    } : undefined,
    bibliography: props.enableBibliography ? {
      enabled: true
    } : undefined,
    citations: props.enableCitations ? {
      enabled: true
    } : undefined,
    references: props.enableReferences ? {
      enabled: true
    } : undefined,
    crossReferences: props.enableCrossReferences ? {
      enabled: true
    } : undefined,
    variables: props.enableVariables ? {
      enabled: true
    } : undefined,
    placeholders: props.enablePlaceholders ? {
      enabled: true
    } : undefined,
    fields: props.enableFields ? {
      enabled: true
    } : undefined,
    forms: props.enableForms ? {
      enabled: true
    } : undefined,
    surveys: props.enableSurveys ? {
      enabled: true
    } : undefined,
    polls: props.enablePolls ? {
      enabled: true
    } : undefined,
    quizzes: props.enableQuizzes ? {
      enabled: true
    } : undefined,
    tests: props.enableTests ? {
      enabled: true
    } : undefined,
    assessments: props.enableAssessments ? {
      enabled: true
    } : undefined,
    grading: props.enableGrading ? {
      enabled: true
    } : undefined,
    rubrics: props.enableRubrics ? {
      enabled: true
    } : undefined,
    scoring: props.enableScoring ? {
      enabled: true
    } : undefined,
    analytics: props.enableAnalytics ? {
      enabled: true
    } : undefined,
    tracking: props.enableTracking ? {
      enabled: true
    } : undefined,
    logging: props.enableLogging ? {
      enabled: true
    } : undefined,
    auditing: props.enableAuditing ? {
      enabled: true
    } : undefined,
    versioning: props.enableVersioning ? {
      enabled: true
    } : undefined,
    history: props.enableHistory ? {
      enabled: true
    } : undefined,
    backup: props.enableBackup ? {
      enabled: true
    } : undefined,
    restore: props.enableRestore ? {
      enabled: true
    } : undefined,
    sync: props.enableSync ? {
      enabled: true
    } : undefined,
    cloud: props.enableCloud ? {
      enabled: true
    } : undefined,
    offline: props.enableOffline ? {
      enabled: true
    } : undefined,
    mobile: props.enableMobile ? {
      enabled: true
    } : undefined,
    touch: props.enableTouch ? {
      enabled: true
    } : undefined,
    gesture: props.enableGesture ? {
      enabled: true
    } : undefined,
    voice: props.enableVoice ? {
      enabled: true
    } : undefined,
    speech: props.enableSpeech ? {
      enabled: true
    } : undefined,
    dictation: props.enableDictation ? {
      enabled: true
    } : undefined,
    translation: props.enableTranslation ? {
      enabled: true
    } : undefined,
    localization: props.enableLocalization ? {
      enabled: true
    } : undefined,
    internationalization: props.enableInternationalization ? {
      enabled: true
    } : undefined,
    multilingual: props.enableMultilingual ? {
      enabled: true
    } : undefined,
    bilingual: props.enableBilingual ? {
      enabled: true
    } : undefined,
    trilingual: props.enableTrilingual ? {
      enabled: true
    } : undefined,
    polyglot: props.enablePolyglot ? {
      enabled: true
    } : undefined
  }

  // Add extra plugins if provided
  if (props.extraPlugins.length > 0) {
    config.extraPlugins = props.extraPlugins
  }

  // Add remove plugins if provided
  if (props.removePlugins.length > 0) {
    config.removePlugins = props.removePlugins
  }

  return config
})

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
    
    // Create editor instance with full config
    const editorInstance = await ClassicEditor.create(editorElement, editorConfig.value)

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

    // Setup auto-save if enabled
    if (props.autoSave) {
      setupAutoSave(editorInstance)
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

// Auto-save functionality
const setupAutoSave = (editorInstance) => {
  if (autoSaveTimer.value) {
    clearInterval(autoSaveTimer.value)
  }

  autoSaveTimer.value = setInterval(() => {
    try {
      if (editorInstance && isInitialized.value) {
        const data = editorInstance.getData()
        emit('save', data)
      }
    } catch (err) {
      console.warn('Error in auto-save:', err)
    }
  }, props.autoSaveInterval)
}

// Fullscreen functionality
const toggleFullscreen = () => {
  try {
    if (!isFullscreen.value) {
      // Enter fullscreen - only for this specific editor
      const editorElement = document.getElementById(editorId.value)
      if (editorElement) {
        if (editorElement.requestFullscreen) {
          editorElement.requestFullscreen()
        } else if (editorElement.webkitRequestFullscreen) {
          editorElement.webkitRequestFullscreen()
        } else if (editorElement.msRequestFullscreen) {
          editorElement.msRequestFullscreen()
        } else if (editorElement.mozRequestFullScreen) {
          editorElement.mozRequestFullScreen()
        } else {
          // Fallback: use CSS fullscreen
          isFullscreen.value = true
          return
        }
        isFullscreen.value = true
      }
    } else {
      // Exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen()
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen()
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen()
      } else {
        // Fallback: use CSS fullscreen
        isFullscreen.value = false
        return
      }
      isFullscreen.value = false
    }
  } catch (err) {
    console.warn('Error toggling fullscreen:', err)
    // Fallback: just toggle the class
    isFullscreen.value = !isFullscreen.value
  }
}

// Listen for fullscreen changes
const handleFullscreenChange = () => {
  const currentFullscreenElement = 
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.mozFullScreenElement ||
    document.msFullscreenElement
  
  // Check if this specific editor is in fullscreen
  const editorElement = document.getElementById(editorId.value)
  const isCurrentlyFullscreen = currentFullscreenElement === editorElement
  
  isFullscreen.value = isCurrentlyFullscreen
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

// Watch for auto-save changes
watch(() => props.autoSave, (newValue) => {
  if (editor.value && isInitialized.value) {
    if (newValue) {
      setupAutoSave(editor.value)
    } else if (autoSaveTimer.value) {
      clearInterval(autoSaveTimer.value)
      autoSaveTimer.value = null
    }
  }
})

// Lifecycle
onMounted(async () => {
  // Wait for DOM to be ready
  await nextTick()
  
  // Set mounted flag
  isMounted.value = true
  
  // Add fullscreen event listeners
  document.addEventListener('fullscreenchange', handleFullscreenChange)
  document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
  document.addEventListener('mozfullscreenchange', handleFullscreenChange)
  document.addEventListener('MSFullscreenChange', handleFullscreenChange)
  
  // Wait a bit more for DOM to be fully ready
  setTimeout(async () => {
    await initEditor()
  }, 500)
})

onBeforeUnmount(() => {
  if (autoSaveTimer.value) {
    clearInterval(autoSaveTimer.value)
  }
  
  // Remove fullscreen event listeners
  document.removeEventListener('fullscreenchange', handleFullscreenChange)
  document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
  document.removeEventListener('mozfullscreenchange', handleFullscreenChange)
  document.removeEventListener('MSFullscreenChange', handleFullscreenChange)
  
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
  insertHtml: (html) => {
    try {
      if (editor.value) {
        editor.value.model.change(writer => {
          const insertPosition = editor.value.model.document.selection.getFirstPosition()
          const viewFragment = editor.value.data.processor.toView(html)
          const modelFragment = editor.value.data.toModel(viewFragment)
          writer.insert(modelFragment, insertPosition)
        })
      }
    } catch (err) {
      console.warn('Error inserting HTML:', err)
    }
  },
  getWordCount: () => wordCount.value,
  getCharCount: () => charCount.value,
  isReady: () => isInitialized.value,
  save: () => {
    try {
      if (editor.value) {
        const data = editor.value.getData()
        emit('save', data)
        return data
      }
    } catch (err) {
      console.warn('Error saving editor:', err)
    }
  },
  clear: () => {
    try {
      if (editor.value) {
        editor.value.setData('')
      }
    } catch (err) {
      console.warn('Error clearing editor:', err)
    }
  },
  // Advanced methods
  exportContent: (format = 'html') => {
    try {
      if (editor.value) {
        const data = editor.value.getData()
        switch (format) {
          case 'html':
            return data
          case 'markdown':
            return convertHtmlToMarkdown(data)
          case 'txt':
            return convertHtmlToText(data)
          case 'pdf':
            return exportToPDF(data)
          case 'docx':
            return exportToDocx(data)
          default:
            return data
        }
      }
    } catch (err) {
      console.warn('Error exporting content:', err)
    }
  },
  importContent: (content, format = 'html') => {
    try {
      if (editor.value) {
        let htmlContent = content
        switch (format) {
          case 'markdown':
            htmlContent = convertMarkdownToHtml(content)
            break
          case 'txt':
            htmlContent = convertTextToHtml(content)
            break
          case 'docx':
            htmlContent = convertDocxToHtml(content)
            break
        }
        editor.value.setData(htmlContent)
      }
    } catch (err) {
      console.warn('Error importing content:', err)
    }
  },
  findAndReplace: (findText, replaceText, options = {}) => {
    try {
      if (editor.value) {
        // Implementation for find and replace
        const findAndReplacePlugin = editor.value.plugins.get('FindAndReplace')
        if (findAndReplacePlugin) {
          findAndReplacePlugin.find(findText, options)
          if (replaceText) {
            findAndReplacePlugin.replace(replaceText)
          }
        }
      }
    } catch (err) {
      console.warn('Error in find and replace:', err)
    }
  },
  print: () => {
    try {
      if (editor.value) {
        const printPlugin = editor.value.plugins.get('Print')
        if (printPlugin) {
          printPlugin.print()
        } else {
          window.print()
        }
      }
    } catch (err) {
      console.warn('Error printing:', err)
    }
  },
  toggleFullScreen: () => {
    try {
      if (editor.value) {
        const fullScreenPlugin = editor.value.plugins.get('FullScreen')
        if (fullScreenPlugin) {
          fullScreenPlugin.toggle()
        }
      }
    } catch (err) {
      console.warn('Error toggling full screen:', err)
    }
  },
  toggleSourceEditing: () => {
    try {
      if (editor.value) {
        const sourceEditingPlugin = editor.value.plugins.get('SourceEditing')
        if (sourceEditingPlugin) {
          sourceEditingPlugin.toggle()
        }
      }
    } catch (err) {
      console.warn('Error toggling source editing:', err)
    }
  },
  insertMath: (mathExpression) => {
    try {
      if (editor.value && props.enableMath) {
        const mathPlugin = editor.value.plugins.get('Math')
        if (mathPlugin) {
          mathPlugin.insertMath(mathExpression)
        }
      }
    } catch (err) {
      console.warn('Error inserting math:', err)
    }
  },
  insertTable: (rows = 3, columns = 3) => {
    try {
      if (editor.value) {
        editor.value.model.change(writer => {
          const table = writer.createElement('table')
          for (let i = 0; i < rows; i++) {
            const tableRow = writer.createElement('tableRow')
            for (let j = 0; j < columns; j++) {
              const tableCell = writer.createElement('tableCell')
              writer.insertText('', tableCell)
              writer.insert(tableCell, tableRow)
            }
            writer.insert(tableRow, table)
          }
          const insertPosition = editor.value.model.document.selection.getFirstPosition()
          writer.insert(table, insertPosition)
        })
      }
    } catch (err) {
      console.warn('Error inserting table:', err)
    }
  },
  insertImage: (imageUrl, altText = '') => {
    try {
      if (editor.value) {
        editor.value.model.change(writer => {
          const imageElement = writer.createElement('imageBlock', {
            src: imageUrl,
            alt: altText
          })
          const insertPosition = editor.value.model.document.selection.getFirstPosition()
          writer.insert(imageElement, insertPosition)
        })
      }
    } catch (err) {
      console.warn('Error inserting image:', err)
    }
  },
  insertLink: (url, text = '') => {
    try {
      if (editor.value) {
        editor.value.model.change(writer => {
          const linkElement = writer.createElement('link', {
            href: url
          })
          writer.insertText(text || url, linkElement)
          const insertPosition = editor.value.model.document.selection.getFirstPosition()
          writer.insert(linkElement, insertPosition)
        })
      }
    } catch (err) {
      console.warn('Error inserting link:', err)
    }
  },
  insertCodeBlock: (code, language = '') => {
    try {
      if (editor.value) {
        editor.value.model.change(writer => {
          const codeBlock = writer.createElement('codeBlock', {
            language: language
          })
          writer.insertText(code, codeBlock)
          const insertPosition = editor.value.model.document.selection.getFirstPosition()
          writer.insert(codeBlock, insertPosition)
        })
      }
    } catch (err) {
      console.warn('Error inserting code block:', err)
    }
  },
  insertBlockQuote: (text) => {
    try {
      if (editor.value) {
        editor.value.model.change(writer => {
          const blockQuote = writer.createElement('blockQuote')
          writer.insertText(text, blockQuote)
          const insertPosition = editor.value.model.document.selection.getFirstPosition()
          writer.insert(blockQuote, insertPosition)
        })
      }
    } catch (err) {
      console.warn('Error inserting block quote:', err)
    }
  },
  insertHorizontalLine: () => {
    try {
      if (editor.value) {
        editor.value.model.change(writer => {
          const horizontalLine = writer.createElement('horizontalLine')
          const insertPosition = editor.value.model.document.selection.getFirstPosition()
          writer.insert(horizontalLine, insertPosition)
        })
      }
    } catch (err) {
      console.warn('Error inserting horizontal line:', err)
    }
  },
  insertPageBreak: () => {
    try {
      if (editor.value) {
        editor.value.model.change(writer => {
          const pageBreak = writer.createElement('pageBreak')
          const insertPosition = editor.value.model.document.selection.getFirstPosition()
          writer.insert(pageBreak, insertPosition)
        })
      }
    } catch (err) {
      console.warn('Error inserting page break:', err)
    }
  },
  getSelectedText: () => {
    try {
      if (editor.value) {
        const selection = editor.value.model.document.selection
        const selectedContent = Array.from(selection.getSelectedBlocks())
        return selectedContent.map(block => block.data).join('\n')
      }
    } catch (err) {
      console.warn('Error getting selected text:', err)
    }
    return ''
  },
  getWordCount: () => wordCount.value,
  getCharCount: () => charCount.value,
  getStats: () => ({
    words: wordCount.value,
    characters: charCount.value,
    paragraphs: editor.value ? editor.value.model.document.getRoot().getChildCount() : 0
  }),
  undo: () => {
    try {
      if (editor.value) {
        editor.value.execute('undo')
      }
    } catch (err) {
      console.warn('Error undoing:', err)
    }
  },
  redo: () => {
    try {
      if (editor.value) {
        editor.value.execute('redo')
      }
    } catch (err) {
      console.warn('Error redoing:', err)
    }
  },
  canUndo: () => {
    try {
      if (editor.value) {
        return editor.value.commands.get('undo').isEnabled
      }
    } catch (err) {
      console.warn('Error checking undo availability:', err)
    }
    return false
  },
  canRedo: () => {
    try {
      if (editor.value) {
        return editor.value.commands.get('redo').isEnabled
      }
    } catch (err) {
      console.warn('Error checking redo availability:', err)
    }
    return false
  },
  // Fullscreen methods
  isFullscreen: () => isFullscreen.value,
  toggleFullscreen: () => toggleFullscreen(),
  enterFullscreen: () => {
    if (!isFullscreen.value) {
      toggleFullscreen()
    }
  },
  exitFullscreen: () => {
    if (isFullscreen.value) {
      toggleFullscreen()
    }
  }
})
</script>

<style scoped>
.ckeditor-wrapper {
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  overflow: hidden;
  background: white;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
}

.ckeditor-wrapper.fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  border-radius: 0;
  border: none;
  box-shadow: none;
  background: white;
}

/* Ensure only the fullscreen editor is visible */
.ckeditor-wrapper.fullscreen:not(:fullscreen) {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  border-radius: 0;
  border: none;
  box-shadow: none;
  background: white;
}

/* Hide other editors when one is in fullscreen */
body:has(.ckeditor-wrapper.fullscreen) .ckeditor-wrapper:not(.fullscreen) {
  visibility: hidden;
  opacity: 0;
  pointer-events: none;
}

/* Fallback for browsers that don't support :has() */
.ckeditor-wrapper.fullscreen ~ .ckeditor-wrapper {
  visibility: hidden;
  opacity: 0;
  pointer-events: none;
}

.editor-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  background-color: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
  border-radius: 0.5rem 0.5rem 0 0;
}

.fullscreen-toggle {
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.fullscreen-toggle:hover {
  background-color: #2563eb;
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.fullscreen-toggle:active {
  transform: translateY(0);
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.word-count {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.75rem;
  color: #6b7280;
}

.char-count {
  color: #9ca3af;
}

.editor-wrapper {
  position: relative;
}

.editor-container {
  min-height: v-bind(height);
  max-height: 600px;
  overflow-y: auto;
}

.ckeditor-wrapper.fullscreen .editor-container {
  height: calc(100vh - 80px);
  max-height: none;
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

/* Table styles */
:deep(.ck-editor__editable table) {
  border-collapse: collapse !important;
  width: 100% !important;
  margin: 1rem 0 !important;
}

:deep(.ck-editor__editable table td),
:deep(.ck-editor__editable table th) {
  border: 1px solid #d1d5db !important;
  padding: 0.5rem !important;
  text-align: left !important;
}

:deep(.ck-editor__editable table th) {
  background-color: #f9fafb !important;
  font-weight: 600 !important;
}

/* Block quote styles */
:deep(.ck-editor__editable blockquote) {
  border-left: 4px solid #3b82f6 !important;
  margin: 1rem 0 !important;
  padding: 0.5rem 1rem !important;
  background-color: #f9fafb !important;
  font-style: italic !important;
}

/* Code block styles */
:deep(.ck-editor__editable pre) {
  background-color: #f3f4f6 !important;
  border: 1px solid #e5e7eb !important;
  border-radius: 0.25rem !important;
  padding: 1rem !important;
  margin: 1rem 0 !important;
  overflow-x: auto !important;
  font-family: 'Courier New', monospace !important;
}

:deep(.ck-editor__editable code) {
  background-color: #f3f4f6 !important;
  padding: 0.125rem 0.25rem !important;
  border-radius: 0.125rem !important;
  font-family: 'Courier New', monospace !important;
  font-size: 0.875rem !important;
}

/* Horizontal line styles */
:deep(.ck-editor__editable hr) {
  border: none !important;
  border-top: 2px solid #e5e7eb !important;
  margin: 2rem 0 !important;
}

/* Dark theme support */
.dark .ckeditor-wrapper {
  background: #1f2937;
  border-color: #374151;
}

.dark .ckeditor-wrapper.fullscreen {
  background: #111827;
}

.dark .editor-toolbar {
  background-color: #374151;
  border-bottom-color: #4b5563;
}

.dark .fullscreen-toggle {
  background-color: #3b82f6;
  color: white;
}

.dark .fullscreen-toggle:hover {
  background-color: #2563eb;
}

.dark .word-count {
  color: #9ca3af;
}

.dark .char-count {
  color: #6b7280;
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

.dark :deep(.ck-editor__editable table th) {
  background-color: #374151 !important;
}

.dark :deep(.ck-editor__editable blockquote) {
  background-color: #374151 !important;
}

.dark :deep(.ck-editor__editable pre) {
  background-color: #374151 !important;
  border-color: #4b5563 !important;
}

.dark :deep(.ck-editor__editable code) {
  background-color: #374151 !important;
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
  
  .editor-toolbar {
    flex-direction: column;
    gap: 0.5rem;
    padding: 0.75rem;
  }
  
  .fullscreen-toggle {
    width: 100%;
    justify-content: center;
  }
  
  .word-count {
    justify-content: center;
    width: 100%;
  }
}

@media (max-width: 480px) {
  .fullscreen-toggle span {
    display: none;
  }
  
  .fullscreen-toggle {
    padding: 0.5rem;
    width: auto;
  }
}

/* Full screen mode */
:deep(.ck-editor.ck-editor__editable_inline) {
  border: 1px solid #d1d5db !important;
}

:deep(.ck-editor.ck-editor__editable_inline:focus) {
  border-color: #3b82f6 !important;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
}

/* Word count display */
:deep(.ck-word-count) {
  position: absolute;
  bottom: 0.5rem;
  right: 0.5rem;
  font-size: 0.75rem;
  color: #6b7280;
  background: rgba(255, 255, 255, 0.9);
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  border: 1px solid #e5e7eb;
}

.dark :deep(.ck-word-count) {
  background: rgba(31, 41, 55, 0.9);
  color: #9ca3af;
  border-color: #4b5563;
}
</style>
